package com.agrirent.service;

import com.agrirent.dto.BookingResponse;
import com.agrirent.entity.Booking;
import com.agrirent.entity.Equipment;
import com.agrirent.entity.User;
import com.agrirent.exception.BadRequestException;
import com.agrirent.exception.ForbiddenException;
import com.agrirent.exception.NotFoundException;
import com.agrirent.repository.BookingRepository;
import com.agrirent.repository.EquipmentRepository;
import com.agrirent.repository.NotificationRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EquipmentRepository equipmentRepository;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @Transactional
    public BookingResponse createBooking(Map<String, Object> data, User farmer) {
        Long eqId = toLong(data.getOrDefault("equipmentId", data.get("equipment_id")));
        LocalDate startDate = parseDate(data.getOrDefault("startDate", data.get("start_date")));
        LocalDate endDate   = parseDate(data.getOrDefault("endDate",   data.get("end_date")));
        boolean includeDriver = toBool(data.getOrDefault("includeDriver", data.getOrDefault("include_driver", false)));
        String notes = (String) data.getOrDefault("notes", data.getOrDefault("remarks", ""));

        if (eqId == null || startDate == null || endDate == null) {
            throw new BadRequestException("Please provide required booking fields: equipmentId, startDate, and endDate");
        }
        if (!endDate.isAfter(startDate) && !endDate.equals(startDate)) {
            throw new BadRequestException("End date must be on or after start date");
        }
        if (startDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Start date cannot be in the past");
        }

        Equipment equipment = equipmentRepository.findById(eqId)
                .orElseThrow(() -> new NotFoundException("Equipment listing not found"));

        if (!Boolean.TRUE.equals(equipment.getIsAvailable()) && !Boolean.TRUE.equals(equipment.getAvailability())) {
            throw new BadRequestException("Equipment is currently marked unavailable by owner");
        }

        if (equipment.getOwner().getId().equals(farmer.getId())) {
            throw new BadRequestException("Equipment owners cannot book their own equipment");
        }

        // Date conflict check
        boolean conflict = bookingRepository.existsConflict(eqId, startDate, endDate, -1L);
        if (conflict) {
            throw new BadRequestException("Equipment is already reserved for the selected dates");
        }

        // Cost calculation (ported exactly from Node.js bookingService.js)
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate);
        if (totalDays < 1) totalDays = 1;
        BigDecimal dailyRate = equipment.getDailyRate() != null ? equipment.getDailyRate()
                : (equipment.getDailyRent() != null ? equipment.getDailyRent() : BigDecimal.ZERO);
        BigDecimal rentalCost = dailyRate.multiply(BigDecimal.valueOf(totalDays));
        BigDecimal driverCost = BigDecimal.ZERO;
        if (includeDriver && Boolean.TRUE.equals(equipment.getIsDriverAvailable())) {
            BigDecimal driverRate = equipment.getDriverRatePerDay() != null ? equipment.getDriverRatePerDay() : BigDecimal.ZERO;
            driverCost = driverRate.multiply(BigDecimal.valueOf(totalDays));
        }
        BigDecimal total = rentalCost.add(driverCost);

        Booking booking = Booking.builder()
                .equipment(equipment)
                .farmer(farmer)
                .owner(equipment.getOwner())
                .bookingDate(java.time.LocalDateTime.now())
                .startDate(startDate)
                .endDate(endDate)
                .totalDays((int) totalDays)
                .dailyRent(dailyRate)
                .dailyRate(dailyRate)
                .includeDriver(includeDriver)
                .driverCost(driverCost)
                .totalAmount(total)
                .totalPrice(total)
                .depositAmount(equipment.getDeposit() != null ? equipment.getDeposit() : BigDecimal.ZERO)
                .remarks(notes)
                .notes(notes)
                .bookingStatus("pending")
                .status("Pending")
                .paymentStatus("pending")
                .build();

        booking = bookingRepository.save(booking);

        // Notify owner
        try {
            notificationService.create(equipment.getOwner().getId(),
                    "New Booking Request",
                    String.format("%s requested to rent %s (%s to %s).",
                            farmer.getName(), equipment.getName(), startDate, endDate));
        } catch (Exception ignored) {}

        return toResponse(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookingResponse getById(Long id, User currentUser) {
        Booking b = bookingRepository.findById(id).orElseThrow(() -> new NotFoundException("Booking record not found"));
        boolean isFarmer = b.getFarmer().getId().equals(currentUser.getId());
        boolean isOwner  = b.getOwner().getId().equals(currentUser.getId());
        boolean isAdmin  = currentUser.getRole() == User.Role.admin;
        if (!isFarmer && !isOwner && !isAdmin) throw new ForbiddenException("Not authorized to view this booking");
        return toResponse(b);
    }

    public List<BookingResponse> getByFarmer(Long farmerId) {
        return bookingRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getByOwner(Long ownerId) {
        return bookingRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse approve(Long id, User currentUser) {
        Booking b = requireBooking(id);
        assertOwnerOrAdmin(b, currentUser, "Not authorized to approve this booking request");
        b.setBookingStatus("approved"); b.setStatus("Approved");
        b = bookingRepository.save(b);
        try {
            notificationService.create(b.getFarmer().getId(), "Booking Request Approved",
                    "Your rental request for " + b.getEquipment().getName() + " has been approved by the owner.");
        } catch (Exception ignored) {}
        return toResponse(b);
    }

    @Transactional
    public BookingResponse reject(Long id, User currentUser) {
        Booking b = requireBooking(id);
        assertOwnerOrAdmin(b, currentUser, "Not authorized to reject this booking request");
        b.setBookingStatus("rejected"); b.setStatus("Rejected");
        b = bookingRepository.save(b);
        try {
            notificationService.create(b.getFarmer().getId(), "Booking Request Rejected",
                    "Your rental request for " + b.getEquipment().getName() + " was rejected by the owner.");
        } catch (Exception ignored) {}
        return toResponse(b);
    }

    @Transactional
    public BookingResponse cancel(Long id, User currentUser) {
        Booking b = requireBooking(id);
        boolean isFarmer = b.getFarmer().getId().equals(currentUser.getId());
        boolean isOwner  = b.getOwner().getId().equals(currentUser.getId());
        boolean isAdmin  = currentUser.getRole() == User.Role.admin;
        if (!isFarmer && !isOwner && !isAdmin) throw new ForbiddenException("Not authorized to cancel this booking");
        if (isFarmer && !isOwner && !isAdmin && !"pending".equals(b.getBookingStatus())) {
            throw new BadRequestException("Farmers can only cancel pending booking requests");
        }
        b.setBookingStatus("cancelled"); b.setStatus("Cancelled");
        b = bookingRepository.save(b);
        try {
            if (isFarmer) {
                notificationService.create(b.getOwner().getId(), "Booking Request Cancelled",
                        "Farmer cancelled rental booking #" + id + ".");
            } else {
                notificationService.create(b.getFarmer().getId(), "Booking Request Cancelled",
                        "Rental booking #" + id + " was cancelled.");
            }
        } catch (Exception ignored) {}
        return toResponse(b);
    }

    @Transactional
    public BookingResponse updateStatus(Long id, String status, String paymentStatus, User currentUser) {
        List<String> allowed = List.of("pending","approved","rejected","completed","cancelled",
                "Pending","Approved","Rejected","Completed","Cancelled");
        if (!allowed.contains(status)) throw new BadRequestException("Invalid status transition requested");

        Booking b = requireBooking(id);
        boolean isFarmer = b.getFarmer().getId().equals(currentUser.getId());
        boolean isOwner  = b.getOwner().getId().equals(currentUser.getId());
        boolean isAdmin  = currentUser.getRole() == User.Role.admin;
        if (!isFarmer && !isOwner && !isAdmin) throw new ForbiddenException("Not authorized to update this booking");

        String lower = status.toLowerCase();
        String cap = Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
        b.setBookingStatus(lower);
        b.setStatus(cap);
        if (paymentStatus != null) b.setPaymentStatus(paymentStatus);
        b = bookingRepository.save(b);

        // Notifications
        try {
            String eqTitle = b.getEquipment().getName();
            switch (lower) {
                case "approved" -> notificationService.create(b.getFarmer().getId(), "Booking Request Approved", "Your rental request for " + eqTitle + " has been approved.");
                case "rejected" -> notificationService.create(b.getFarmer().getId(), "Booking Request Rejected", "Your rental request for " + eqTitle + " was rejected.");
                case "completed" -> notificationService.create(b.getFarmer().getId(), "Rental Completed", "Your rental period for " + eqTitle + " has been completed.");
                case "cancelled" -> {
                    if (isFarmer) notificationService.create(b.getOwner().getId(), "Booking Cancelled", "Farmer cancelled booking #" + id + ".");
                    else notificationService.create(b.getFarmer().getId(), "Booking Cancelled", "Booking #" + id + " was cancelled.");
                }
            }
        } catch (Exception ignored) {}

        return toResponse(b);
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        if (currentUser.getRole() != User.Role.admin) throw new ForbiddenException("Not authorized to delete booking records");
        Booking b = requireBooking(id);
        bookingRepository.delete(b);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────────────────

    private Booking requireBooking(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new NotFoundException("Booking record not found"));
    }

    private void assertOwnerOrAdmin(Booking b, User currentUser, String msg) {
        if (!b.getOwner().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.admin) {
            throw new ForbiddenException(msg);
        }
    }

    public BookingResponse toResponse(Booking b) {
        Equipment eq = b.getEquipment();
        User farmer = b.getFarmer();
        User owner  = b.getOwner();

        List<String> images = List.of();
        if (eq.getImages() != null && !eq.getImages().isBlank()) {
            try { images = objectMapper.readValue(eq.getImages(), new TypeReference<List<String>>() {}); }
            catch (Exception ignored) {}
        }

        String rawStatus = b.getBookingStatus() != null ? b.getBookingStatus() : "pending";
        String capStatus = b.getStatus() != null ? b.getStatus()
                : Character.toUpperCase(rawStatus.charAt(0)) + rawStatus.substring(1).toLowerCase();

        return BookingResponse.builder()
                ._id(b.getId())
                .id(b.getId())
                .equipment_id(eq.getId())
                .equipmentId(eq.getId())
                .farmer_id(farmer.getId())
                .farmerId(farmer.getId())
                .owner_id(owner.getId())
                .ownerId(owner.getId())
                .booking_date(b.getBookingDate() != null ? b.getBookingDate() : b.getCreatedAt())
                .bookingDate(b.getBookingDate() != null ? b.getBookingDate() : b.getCreatedAt())
                .start_date(b.getStartDate())
                .startDate(b.getStartDate())
                .end_date(b.getEndDate())
                .endDate(b.getEndDate())
                .total_days(b.getTotalDays())
                .totalDays(b.getTotalDays())
                .daily_rent(b.getDailyRent())
                .dailyRent(b.getDailyRent())
                .daily_rate(b.getDailyRate())
                .dailyRate(b.getDailyRate())
                .include_driver(b.getIncludeDriver())
                .includeDriver(b.getIncludeDriver())
                .driver_cost(b.getDriverCost())
                .driverCost(b.getDriverCost())
                .total_amount(b.getTotalAmount())
                .totalAmount(b.getTotalAmount())
                .total_price(b.getTotalPrice())
                .totalPrice(b.getTotalPrice())
                .deposit_amount(b.getDepositAmount())
                .depositAmount(b.getDepositAmount())
                .booking_status(rawStatus)
                .bookingStatus(rawStatus)
                .status(capStatus)
                .payment_status(b.getPaymentStatus())
                .paymentStatus(b.getPaymentStatus())
                .remarks(b.getRemarks())
                .notes(b.getNotes())
                .created_at(b.getCreatedAt())
                .createdAt(b.getCreatedAt())
                .updated_at(b.getUpdatedAt())
                .updatedAt(b.getUpdatedAt())
                .equipment(BookingResponse.EquipmentInfo.builder()
                        ._id(eq.getId())
                        .id(eq.getId())
                        .name(eq.getName())
                        .category(eq.getCategoryName())
                        .images(images)
                        .location(eq.getLocation())
                        .dailyRate(eq.getDailyRate())
                        .dailyRent(eq.getDailyRent())
                        .owner(BookingResponse.OwnerInfo.builder()
                                ._id(owner.getId())
                                .id(owner.getId())
                                .name(owner.getName())
                                .phone(owner.getPhone())
                                .location(owner.getLocation())
                                .email(owner.getEmail())
                                .build())
                        .build())
                .farmer(BookingResponse.FarmerInfo.builder()
                        ._id(farmer.getId())
                        .id(farmer.getId())
                        .name(farmer.getName())
                        .phone(farmer.getPhone())
                        .email(farmer.getEmail())
                        .location(farmer.getLocation())
                        .build())
                .build();
    }

    private Long toLong(Object v) {
        if (v == null) return null;
        try { return Long.parseLong(v.toString()); } catch (Exception e) { return null; }
    }

    private LocalDate parseDate(Object v) {
        if (v == null) return null;
        try { return LocalDate.parse(v.toString()); } catch (Exception e) { return null; }
    }

    private boolean toBool(Object v) {
        if (v instanceof Boolean b) return b;
        return "true".equalsIgnoreCase(String.valueOf(v));
    }
}

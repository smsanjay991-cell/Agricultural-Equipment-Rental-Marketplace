package com.agrirent.service;

import com.agrirent.entity.Booking;
import com.agrirent.entity.Payment;
import com.agrirent.entity.User;
import com.agrirent.exception.BadRequestException;
import com.agrirent.exception.ForbiddenException;
import com.agrirent.exception.NotFoundException;
import com.agrirent.repository.BookingRepository;
import com.agrirent.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    @Transactional
    public Map<String, Object> create(Long bookingId, BigDecimal amount, String method, String txnId, User farmer) {
        if (bookingId == null) throw new BadRequestException("Booking ID is required");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) throw new BadRequestException("Payment amount must be a positive number");

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new NotFoundException("Booking record not found"));

        if (!booking.getFarmer().getId().equals(farmer.getId()) && farmer.getRole() != User.Role.admin)
            throw new ForbiddenException("Not authorized to make payment for another user's booking");

        String normStatus = booking.getBookingStatus() != null ? booking.getBookingStatus().toLowerCase() : "";
        if (!normStatus.equals("approved") && !normStatus.equals("completed"))
            throw new BadRequestException("Payments are only permitted for approved rental bookings. Current booking status is '" + normStatus + "'");

        if ("paid".equalsIgnoreCase(booking.getPaymentStatus()))
            throw new BadRequestException("Payment has already been completed for this booking");

        boolean alreadyPaid = paymentRepository.findByBookingIdOrderByCreatedAtDesc(bookingId)
                .stream().anyMatch(p -> "Completed".equalsIgnoreCase(p.getPaymentStatus()));
        if (alreadyPaid) throw new BadRequestException("Payment has already been completed for this booking");

        Payment payment = Payment.builder()
                .booking(booking)
                .farmer(booking.getFarmer())
                .amount(amount)
                .paymentStatus("Completed")
                .paymentMethod(method != null ? method : "UPI/QR")
                .transactionId(txnId)
                .build();
        payment = paymentRepository.save(payment);

        // Update booking payment_status
        booking.setPaymentStatus("paid");
        bookingRepository.save(booking);

        // Notifications
        try {
            notificationService.create(booking.getFarmer().getId(), "Payment Confirmed",
                    "Your payment of ₹" + amount + " for rental booking #" + bookingId + " was successful.");
            notificationService.create(booking.getOwner().getId(), "Payment Received",
                    "Payment of ₹" + amount + " was received for rental booking #" + bookingId + ".");
        } catch (Exception ignored) {}

        return toMap(payment);
    }

    public Map<String, Object> getPaymentByBooking(Long bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new NotFoundException("Booking record not found"));
        boolean ok = booking.getFarmer().getId().equals(currentUser.getId())
                || booking.getOwner().getId().equals(currentUser.getId())
                || currentUser.getRole() == User.Role.admin;
        if (!ok) throw new ForbiddenException("Not authorized to view payment details for this booking");
        List<Payment> payments = paymentRepository.findByBookingIdOrderByCreatedAtDesc(bookingId);
        return Map.of("data", payments.isEmpty() ? null : toMap(payments.get(0)), "history", payments.stream().map(this::toMap).collect(Collectors.toList()));
    }

    public List<Map<String, Object>> getMyPayments(Long farmerId) {
        return paymentRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId).stream().map(this::toMap).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAll() {
        return paymentRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toMap).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> updateStatus(Long id, String status, User admin) {
        if (admin.getRole() != User.Role.admin) throw new ForbiddenException("Admin authorization required to update payment status");
        List<String> allowed = List.of("Pending","Completed","Failed","Refunded","pending","completed","failed","refunded");
        if (!allowed.contains(status)) throw new BadRequestException("Invalid payment status requested. Allowed: Pending, Completed, Failed, Refunded");
        String formatted = Character.toUpperCase(status.charAt(0)) + status.substring(1).toLowerCase();
        Payment p = paymentRepository.findById(id).orElseThrow(() -> new NotFoundException("Payment record not found"));
        p.setPaymentStatus(formatted);
        p = paymentRepository.save(p);
        try {
            notificationService.create(p.getFarmer().getId(), "Payment Status Updated",
                    "Your payment status for booking #" + p.getBooking().getId() + " was updated to '" + formatted + "' by Admin.");
        } catch (Exception ignored) {}
        return toMap(p);
    }

    private Map<String, Object> toMap(Payment p) {
        Map<String, Object> m = new java.util.LinkedHashMap<>();
        m.put("_id", p.getId());
        m.put("id", p.getId());
        m.put("bookingId", p.getBooking().getId());
        m.put("booking_id", p.getBooking().getId());
        m.put("farmerId", p.getFarmer().getId());
        m.put("farmer_id", p.getFarmer().getId());
        m.put("amount", p.getAmount());
        m.put("paymentStatus", p.getPaymentStatus());
        m.put("payment_status", p.getPaymentStatus());
        m.put("paymentMethod", p.getPaymentMethod() != null ? p.getPaymentMethod() : "");
        m.put("transactionId", p.getTransactionId() != null ? p.getTransactionId() : "");
        m.put("createdAt", p.getCreatedAt() != null ? p.getCreatedAt().toString() : "");
        return java.util.Collections.unmodifiableMap(m);
    }
}

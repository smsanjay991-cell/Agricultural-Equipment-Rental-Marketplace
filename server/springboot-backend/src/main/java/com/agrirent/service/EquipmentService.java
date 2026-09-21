package com.agrirent.service;

import com.agrirent.dto.EquipmentResponse;
import com.agrirent.dto.ReviewResponse;
import com.agrirent.entity.Equipment;
import com.agrirent.entity.Review;
import com.agrirent.entity.User;
import com.agrirent.exception.BadRequestException;
import com.agrirent.exception.ForbiddenException;
import com.agrirent.exception.NotFoundException;
import com.agrirent.repository.EquipmentRepository;
import com.agrirent.repository.ReviewRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final ReviewRepository reviewRepository;
    private final ObjectMapper objectMapper;

    public List<EquipmentResponse> findAll(Map<String, String> filters) {
        Specification<Equipment> spec = buildSpec(filters);
        return equipmentRepository.findAll(spec,
                org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(e -> toResponse(e, false))
                .collect(Collectors.toList());
    }

    public EquipmentResponse findById(Long id) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipment listing not found"));
        List<Review> reviews = reviewRepository.findByEquipmentIdOrderByCreatedAtDesc(id);
        EquipmentResponse resp = toResponse(eq, false);
        resp.setReviews(reviews.stream().map(this::toReviewResponse).collect(Collectors.toList()));
        return resp;
    }

    public List<EquipmentResponse> findByOwner(Long ownerId) {
        return equipmentRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(e -> toResponse(e, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public EquipmentResponse create(Map<String, Object> data, User owner) {
        Equipment eq = buildFromMap(data, new Equipment(), owner);
        eq = equipmentRepository.save(eq);
        return toResponse(eq, false);
    }

    @Transactional
    public EquipmentResponse update(Long id, Map<String, Object> data, User currentUser) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipment not found"));

        if (!eq.getOwner().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.admin) {
            throw new ForbiddenException("Not authorized to edit this equipment");
        }

        buildFromMap(data, eq, eq.getOwner()); // owner stays the same on update
        eq = equipmentRepository.save(eq);
        return toResponse(eq, false);
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipment not found"));

        if (!eq.getOwner().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.admin) {
            throw new ForbiddenException("Not authorized to delete this equipment");
        }
        equipmentRepository.delete(eq);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────────

    private Equipment buildFromMap(Map<String, Object> data, Equipment eq, User owner) {
        eq.setOwner(owner);

        if (data.containsKey("name"))        eq.setName((String) data.get("name"));
        if (data.containsKey("description")) eq.setDescription((String) data.get("description"));
        if (data.containsKey("brand"))       eq.setBrand((String) data.get("brand"));
        if (data.containsKey("model"))       eq.setModel((String) data.get("model"));
        if (data.containsKey("location"))    eq.setLocation((String) data.get("location"));
        if (data.containsKey("image"))       eq.setImage((String) data.get("image"));
        if (data.containsKey("fuelType"))    eq.setFuelType((String) data.get("fuelType"));
        if (data.containsKey("fuel_type"))   eq.setFuelType((String) data.get("fuel_type"));

        String cat = (String) data.getOrDefault("category", eq.getCategoryName() != null ? eq.getCategoryName() : "General");
        eq.setCategoryName(cat);

        BigDecimal rate = toBigDecimal(data.getOrDefault("daily_rent",
                data.getOrDefault("dailyRent", data.getOrDefault("dailyRate", BigDecimal.ZERO))));
        eq.setDailyRent(rate);
        eq.setDailyRate(rate);

        if (data.containsKey("deposit"))
            eq.setDeposit(toBigDecimal(data.get("deposit")));

        if (data.containsKey("horsepower"))
            eq.setHorsepower(toInt(data.get("horsepower")));

        if (data.containsKey("driverRatePerDay") || data.containsKey("driver_rate_per_day")) {
            BigDecimal dr = toBigDecimal(data.getOrDefault("driverRatePerDay", data.get("driver_rate_per_day")));
            eq.setDriverRatePerDay(dr);
        }

        if (data.containsKey("isDriverAvailable") || data.containsKey("is_driver_available")) {
            eq.setIsDriverAvailable(toBool(data.getOrDefault("isDriverAvailable", data.get("is_driver_available"))));
        }

        if (data.containsKey("availability") || data.containsKey("isAvailable")) {
            boolean avail = toBool(data.getOrDefault("availability", data.getOrDefault("isAvailable", true)));
            eq.setAvailability(avail);
            eq.setIsAvailable(avail);
        }

        // images array → JSON string
        Object imagesRaw = data.get("images");
        if (imagesRaw instanceof List) {
            try { eq.setImages(objectMapper.writeValueAsString(imagesRaw)); }
            catch (Exception ignored) {}
        } else if (eq.getImage() != null && !eq.getImage().isEmpty()) {
            eq.setImages("[\"" + eq.getImage() + "\"]");
        } else if (eq.getImages() == null || eq.getImages().isBlank()) {
            eq.setImages("[\"https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80\"]");
            eq.setImage("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80");
        }

        return eq;
    }

    private Specification<Equipment> buildSpec(Map<String, String> f) {
        return (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            String owner = f.get("owner");
            if (owner != null) preds.add(cb.equal(root.get("owner").get("id"), Long.parseLong(owner)));

            String cat = f.get("category");
            if (cat != null && !cat.equals("All"))
                preds.add(cb.equal(root.get("categoryName"), cat));

            String loc = f.get("location");
            if (loc != null && !loc.isBlank())
                preds.add(cb.like(cb.lower(root.get("location")), "%" + loc.toLowerCase() + "%"));

            String search = f.get("search");
            if (search != null && !search.isBlank()) {
                String term = "%" + search.toLowerCase() + "%";
                preds.add(cb.or(
                    cb.like(cb.lower(root.get("name")), term),
                    cb.like(cb.lower(root.get("description")), term),
                    cb.like(cb.lower(root.get("categoryName")), term),
                    cb.like(cb.lower(root.get("brand")), term),
                    cb.like(cb.lower(root.get("model")), term)
                ));
            }

            String minPrice = f.get("minPrice");
            if (minPrice != null)
                preds.add(cb.greaterThanOrEqualTo(root.get("dailyRate"), new BigDecimal(minPrice)));

            String maxPrice = f.get("maxPrice");
            if (maxPrice != null)
                preds.add(cb.lessThanOrEqualTo(root.get("dailyRate"), new BigDecimal(maxPrice)));

            String driver = f.get("isDriverAvailable");
            if ("true".equalsIgnoreCase(driver))
                preds.add(cb.isTrue(root.get("isDriverAvailable")));

            return cb.and(preds.toArray(new Predicate[0]));
        };
    }

    public EquipmentResponse toResponse(Equipment eq, boolean includeReviews) {
        List<String> images = parseImages(eq.getImages(), eq.getImage());
        String primaryImage = eq.getImage() != null && !eq.getImage().isBlank()
                ? eq.getImage()
                : (images.isEmpty() ? "" : images.get(0));

        EquipmentResponse.EquipmentResponseBuilder b = EquipmentResponse.builder()
                ._id(eq.getId())
                .id(eq.getId())
                .owner_id(eq.getOwner().getId())
                .ownerId(eq.getOwner().getId())
                .name(eq.getName())
                .category(eq.getCategoryName())
                .description(eq.getDescription())
                .brand(eq.getBrand())
                .model(eq.getModel())
                .daily_rent(eq.getDailyRent())
                .dailyRent(eq.getDailyRent())
                .daily_rate(eq.getDailyRate())
                .dailyRate(eq.getDailyRate())
                .deposit(eq.getDeposit())
                .availability(eq.getAvailability())
                .isAvailable(eq.getIsAvailable())
                .is_available(eq.getIsAvailable())
                .location(eq.getLocation())
                .image(primaryImage)
                .horsepower(eq.getHorsepower())
                .fuelType(eq.getFuelType())
                .fuel_type(eq.getFuelType())
                .isDriverAvailable(eq.getIsDriverAvailable())
                .is_driver_available(eq.getIsDriverAvailable())
                .driverRatePerDay(eq.getDriverRatePerDay())
                .driver_rate_per_day(eq.getDriverRatePerDay())
                .images(images)
                .averageRating(eq.getAverageRating())
                .average_rating(eq.getAverageRating())
                .numReviews(eq.getNumReviews())
                .num_reviews(eq.getNumReviews())
                .createdAt(eq.getCreatedAt())
                .created_at(eq.getCreatedAt())
                .updatedAt(eq.getUpdatedAt())
                .updated_at(eq.getUpdatedAt());

        // Owner nested object
        User ow = eq.getOwner();
        b.owner(EquipmentResponse.OwnerInfo.builder()
                ._id(ow.getId())
                .id(ow.getId())
                .name(ow.getName())
                .phone(ow.getPhone())
                .location(ow.getLocation())
                .email(ow.getEmail())
                .avatar(ow.getAvatar())
                .build());

        if (eq.getCategory() != null) {
            b.category_id(eq.getCategory().getId()).categoryId(eq.getCategory().getId());
        }

        return b.build();
    }

    public ReviewResponse toReviewResponse(Review r) {
        return ReviewResponse.builder()
                ._id(r.getId())
                .id(r.getId())
                .equipment_id(r.getEquipment().getId())
                .equipmentId(r.getEquipment().getId())
                .farmer_id(r.getFarmer().getId())
                .farmerId(r.getFarmer().getId())
                .booking_id(r.getBooking().getId())
                .bookingId(r.getBooking().getId())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .created_at(r.getCreatedAt())
                .farmer(ReviewResponse.FarmerInfo.builder()
                        ._id(r.getFarmer().getId())
                        .id(r.getFarmer().getId())
                        .name(r.getFarmer().getName())
                        .avatar(r.getFarmer().getAvatar())
                        .build())
                .build();
    }

    private List<String> parseImages(String json, String fallback) {
        if (json != null && !json.isBlank()) {
            try {
                List<String> list = objectMapper.readValue(json, new TypeReference<List<String>>() {});
                if (!list.isEmpty()) return list;
            } catch (Exception ignored) {}
        }
        if (fallback != null && !fallback.isBlank()) return List.of(fallback);
        return List.of();
    }

    private BigDecimal toBigDecimal(Object v) {
        if (v == null) return BigDecimal.ZERO;
        try { return new BigDecimal(v.toString()); } catch (Exception e) { return BigDecimal.ZERO; }
    }

    private int toInt(Object v) {
        if (v == null) return 0;
        try { return Integer.parseInt(v.toString()); } catch (Exception e) { return 0; }
    }

    private boolean toBool(Object v) {
        if (v == null) return false;
        if (v instanceof Boolean b) return b;
        return "true".equalsIgnoreCase(v.toString()) || "1".equals(v.toString());
    }
}

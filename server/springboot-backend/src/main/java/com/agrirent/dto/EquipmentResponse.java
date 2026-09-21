package com.agrirent.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Equipment response DTO – mirrors the Node.js formatEquipment() output.
 * Both snake_case and camelCase aliases are included for frontend compatibility.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EquipmentResponse {
    private Long _id;
    private Long id;
    private Long owner_id;
    private Long ownerId;
    private Long category_id;
    private Long categoryId;
    private String name;
    private String category;
    private String description;
    private String brand;
    private String model;
    private BigDecimal daily_rent;
    private BigDecimal dailyRent;
    private BigDecimal daily_rate;
    private BigDecimal dailyRate;
    private BigDecimal deposit;
    private Boolean availability;
    private Boolean isAvailable;
    private Boolean is_available;
    private String location;
    private String image;
    private Integer horsepower;
    private String fuelType;
    private String fuel_type;
    private Boolean isDriverAvailable;
    private Boolean is_driver_available;
    private BigDecimal driverRatePerDay;
    private BigDecimal driver_rate_per_day;
    private List<String> images;
    private BigDecimal averageRating;
    private BigDecimal average_rating;
    private Integer numReviews;
    private Integer num_reviews;
    private LocalDateTime createdAt;
    private LocalDateTime created_at;
    private LocalDateTime updatedAt;
    private LocalDateTime updated_at;
    private OwnerInfo owner;
    private List<ReviewResponse> reviews;

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class OwnerInfo {
        private Long _id;
        private Long id;
        private String name;
        private String phone;
        private String location;
        private String email;
        private String avatar;
    }
}

package com.agrirent.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Booking response DTO – mirrors the Node.js formatBooking() output with both
 * snake_case and camelCase aliases for maximum frontend compatibility.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingResponse {
    private Long _id;
    private Long id;
    private Long equipment_id;
    private Long equipmentId;
    private Long farmer_id;
    private Long farmerId;
    private Long owner_id;
    private Long ownerId;
    private LocalDateTime booking_date;
    private LocalDateTime bookingDate;
    private LocalDate start_date;
    private LocalDate startDate;
    private LocalDate end_date;
    private LocalDate endDate;
    private Integer total_days;
    private Integer totalDays;
    private BigDecimal daily_rent;
    private BigDecimal dailyRent;
    private BigDecimal daily_rate;
    private BigDecimal dailyRate;
    private Boolean include_driver;
    private Boolean includeDriver;
    private BigDecimal driver_cost;
    private BigDecimal driverCost;
    private BigDecimal total_amount;
    private BigDecimal totalAmount;
    private BigDecimal total_price;
    private BigDecimal totalPrice;
    private BigDecimal deposit_amount;
    private BigDecimal depositAmount;
    private String booking_status;
    private String bookingStatus;
    private String status;
    private String payment_status;
    private String paymentStatus;
    private String remarks;
    private String notes;
    private LocalDateTime created_at;
    private LocalDateTime createdAt;
    private LocalDateTime updated_at;
    private LocalDateTime updatedAt;
    private EquipmentInfo equipment;
    private FarmerInfo farmer;

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EquipmentInfo {
        private Long _id;
        private Long id;
        private String name;
        private String category;
        private java.util.List<String> images;
        private String location;
        private BigDecimal dailyRate;
        private BigDecimal dailyRent;
        private OwnerInfo owner;
    }

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
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FarmerInfo {
        private Long _id;
        private Long id;
        private String name;
        private String phone;
        private String email;
        private String location;
    }
}

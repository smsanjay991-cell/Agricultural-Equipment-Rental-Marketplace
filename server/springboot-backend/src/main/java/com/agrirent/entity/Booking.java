package com.agrirent.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings",
    indexes = {
        @Index(name = "idx_bookings_equipment", columnList = "equipment_id"),
        @Index(name = "idx_bookings_farmer",    columnList = "farmer_id"),
        @Index(name = "idx_bookings_owner",     columnList = "owner_id"),
        @Index(name = "idx_bookings_booking_status", columnList = "booking_status"),
        @Index(name = "idx_bookings_payment_status", columnList = "payment_status")
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "total_days", nullable = false)
    private Integer totalDays;

    @Builder.Default
    @Column(name = "daily_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRent = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "daily_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "include_driver")
    private Boolean includeDriver = false;

    @Builder.Default
    @Column(name = "driver_cost", precision = 10, scale = 2)
    private BigDecimal driverCost = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "deposit_amount", precision = 10, scale = 2)
    private BigDecimal depositAmount = BigDecimal.ZERO;

    // lowercase enum matching DB: pending, approved, rejected, cancelled, completed
    @Builder.Default
    @Column(name = "booking_status", nullable = false,
        columnDefinition = "ENUM('pending','approved','rejected','cancelled','completed') DEFAULT 'pending'")
    private String bookingStatus = "pending";

    // Capitalized enum matching DB: Pending, Approved, Rejected, Completed, Cancelled
    @Builder.Default
    @Column(name = "status", nullable = false,
        columnDefinition = "ENUM('Pending','Approved','Rejected','Completed','Cancelled') DEFAULT 'Pending'")
    private String status = "Pending";

    @Builder.Default
    @Column(name = "payment_status", nullable = false,
        columnDefinition = "ENUM('pending','paid','refunded') DEFAULT 'pending'")
    private String paymentStatus = "pending";

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

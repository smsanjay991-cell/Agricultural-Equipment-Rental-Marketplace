package com.agrirent.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "equipment",
    indexes = {
        @Index(name = "idx_equipment_owner", columnList = "owner_id"),
        @Index(name = "idx_equipment_category", columnList = "category"),
        @Index(name = "idx_equipment_location", columnList = "location")
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    // Denormalized category string for fast filtering (matches Node.js design)
    @Column(name = "category", nullable = false, length = 50)
    private String categoryName = "General";

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "brand", length = 100)
    private String brand = "";

    @Column(name = "model", length = 100)
    private String model = "";

    @Column(name = "daily_rent", precision = 10, scale = 2)
    private BigDecimal dailyRent = BigDecimal.ZERO;

    @Column(name = "deposit", precision = 10, scale = 2)
    private BigDecimal deposit = BigDecimal.ZERO;

    @Column(name = "availability")
    private Boolean availability = true;

    @Column(name = "daily_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate = BigDecimal.ZERO;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @Builder.Default
    @Column(name = "image", length = 255)
    private String image = "";

    @Builder.Default
    @Column(name = "horsepower")
    private Integer horsepower = 0;

    @Builder.Default
    @Column(name = "fuel_type", length = 50)
    private String fuelType = "Diesel";

    @Builder.Default
    @Column(name = "is_driver_available")
    private Boolean isDriverAvailable = false;

    @Builder.Default
    @Column(name = "driver_rate_per_day", precision = 10, scale = 2)
    private BigDecimal driverRatePerDay = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "is_available")
    private Boolean isAvailable = true;

    // JSON array stored as TEXT – we serialize/deserialize in the service layer
    @Builder.Default
    @Column(name = "images", columnDefinition = "JSON")
    private String images = "[]";

    @Builder.Default
    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "num_reviews")
    private Integer numReviews = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

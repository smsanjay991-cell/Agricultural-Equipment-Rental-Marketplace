package com.agrirent.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments",
    indexes = { @Index(name = "idx_payments_booking", columnList = "booking_id") }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // Capitalized: Pending, Completed, Failed, Refunded
    @Column(name = "payment_status", nullable = false,
        columnDefinition = "ENUM('Pending','Completed','Failed','Refunded') DEFAULT 'Pending'")
    private String paymentStatus = "Pending";

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod = "Cash/Manual";

    @Column(name = "transaction_id", unique = true, length = 100)
    private String transactionId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

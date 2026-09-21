package com.agrirent.repository;

import com.agrirent.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBookingIdOrderByCreatedAtDesc(Long bookingId);
    List<Payment> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Payment> findAllByOrderByCreatedAtDesc();
}

package com.agrirent.repository;

import com.agrirent.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEquipmentIdOrderByCreatedAtDesc(Long equipmentId);
    List<Review> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Review> findAllByOrderByCreatedAtDesc();
    Optional<Review> findByBookingId(Long bookingId);
}

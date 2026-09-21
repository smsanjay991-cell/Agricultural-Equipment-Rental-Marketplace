package com.agrirent.repository;

import com.agrirent.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long>,
        JpaSpecificationExecutor<Equipment> {

    List<Equipment> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    // Update average_rating and num_reviews after a new review is saved
    @Modifying
    @Transactional
    @Query("UPDATE Equipment e SET e.averageRating = :avg, e.numReviews = :count WHERE e.id = :id")
    void updateRatingStats(@Param("id") Long id,
                           @Param("avg") BigDecimal avg,
                           @Param("count") int count);
}

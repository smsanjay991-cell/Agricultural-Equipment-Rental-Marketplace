package com.agrirent.repository;

import com.agrirent.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    List<Booking> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    // Date-overlap conflict check for pending/approved bookings
    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.equipment.id = :equipmentId
          AND b.id <> :excludeId
          AND b.bookingStatus IN ('pending','approved')
          AND b.startDate <= :endDate
          AND b.endDate >= :startDate
        """)
    boolean existsConflict(@Param("equipmentId") Long equipmentId,
                           @Param("startDate") LocalDate startDate,
                           @Param("endDate") LocalDate endDate,
                           @Param("excludeId") Long excludeId);
}

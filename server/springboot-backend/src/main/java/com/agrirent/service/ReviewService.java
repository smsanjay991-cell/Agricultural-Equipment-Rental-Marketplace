package com.agrirent.service;

import com.agrirent.dto.ReviewResponse;
import com.agrirent.entity.Booking;
import com.agrirent.entity.Equipment;
import com.agrirent.entity.Review;
import com.agrirent.entity.User;
import com.agrirent.exception.BadRequestException;
import com.agrirent.exception.ForbiddenException;
import com.agrirent.exception.NotFoundException;
import com.agrirent.repository.BookingRepository;
import com.agrirent.repository.EquipmentRepository;
import com.agrirent.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final EquipmentService equipmentService;

    @Transactional
    public ReviewResponse create(Long equipmentId, Long bookingId, Integer rating, String comment, User farmer) {
        if (rating == null || rating < 1 || rating > 5) throw new BadRequestException("Rating must be an integer between 1 and 5");
        if (comment == null || comment.isBlank()) throw new BadRequestException("Comment is required and cannot be empty");
        if (equipmentId == null) throw new BadRequestException("Equipment ID is required");
        if (bookingId == null) throw new BadRequestException("Booking ID is required");

        Equipment eq = equipmentRepository.findById(equipmentId).orElseThrow(() -> new NotFoundException("Equipment not found"));
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new NotFoundException("Rental booking not found"));

        if (!booking.getFarmer().getId().equals(farmer.getId()))
            throw new ForbiddenException("You can only review equipment from your own rental bookings");
        if (!booking.getEquipment().getId().equals(equipmentId))
            throw new BadRequestException("Booking does not match the specified equipment");
        if (!"completed".equalsIgnoreCase(booking.getBookingStatus()))
            throw new BadRequestException("Reviews can only be submitted after the rental booking is completed");

        reviewRepository.findByBookingId(bookingId).ifPresent(r -> {
            throw new BadRequestException("A review has already been submitted for this rental booking");
        });

        Review review = Review.builder()
                .equipment(eq)
                .farmer(farmer)
                .booking(booking)
                .rating(rating)
                .comment(comment.trim())
                .build();

        review = reviewRepository.save(review);

        // Recalculate average rating
        List<Review> all = reviewRepository.findByEquipmentIdOrderByCreatedAtDesc(equipmentId);
        double avg = all.stream().mapToInt(Review::getRating).average().orElse(0.0);
        equipmentRepository.updateRatingStats(equipmentId, BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP), all.size());

        // Notify owner
        try {
            notificationService.create(eq.getOwner().getId(), "New Equipment Review",
                    farmer.getName() + " submitted a " + rating + "-star review for " + eq.getName() + ".");
        } catch (Exception ignored) {}

        return equipmentService.toReviewResponse(review);
    }

    public List<ReviewResponse> getByEquipment(Long equipmentId) {
        return reviewRepository.findByEquipmentIdOrderByCreatedAtDesc(equipmentId)
                .stream().map(equipmentService::toReviewResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getByFarmer(Long farmerId) {
        return reviewRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId)
                .stream().map(equipmentService::toReviewResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getAll() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(equipmentService::toReviewResponse).collect(Collectors.toList());
    }
}

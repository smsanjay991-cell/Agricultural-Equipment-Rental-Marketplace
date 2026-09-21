package com.agrirent.controller;

import com.agrirent.dto.ReviewResponse;
import com.agrirent.entity.User;
import com.agrirent.exception.ApiResponse;
import com.agrirent.repository.UserRepository;
import com.agrirent.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
    public ResponseEntity<ApiResponse<ReviewResponse>> create(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        Long equipmentId = toLong(body.getOrDefault("equipmentId", body.get("equipment")));
        Long bookingId   = toLong(body.getOrDefault("bookingId", body.get("booking")));
        Integer rating   = body.get("rating") != null ? Integer.parseInt(body.get("rating").toString()) : null;
        String comment   = (String) body.get("comment");
        ReviewResponse resp = reviewService.create(equipmentId, bookingId, rating, comment, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Review submitted successfully", resp));
    }

    // Public
    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getByEquipment(@PathVariable Long equipmentId) {
        List<ReviewResponse> list = reviewService.getByEquipment(equipmentId);
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(@AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        List<ReviewResponse> list = reviewService.getByFarmer(user.getId());
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        List<ReviewResponse> list = reviewService.getAll();
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    private User resolve(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }

    private Long toLong(Object v) {
        if (v == null) return null;
        try { return Long.parseLong(v.toString()); } catch (Exception e) { return null; }
    }
}

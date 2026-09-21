package com.agrirent.controller;

import com.agrirent.dto.BookingResponse;
import com.agrirent.entity.User;
import com.agrirent.exception.ApiResponse;
import com.agrirent.repository.UserRepository;
import com.agrirent.service.BookingService;
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
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    // Named sub-routes BEFORE /:id

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(@AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        List<BookingResponse> list;
        if (user.getRole() == User.Role.owner) {
            list = bookingService.getByOwner(user.getId());
        } else {
            list = bookingService.getByFarmer(user.getId());
        }
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getOwnerBookings(@AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        List<BookingResponse> list = bookingService.getByOwner(user.getId());
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> list = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    // Root route
    @PostMapping
    @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> create(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        BookingResponse resp = bookingService.createBooking(body, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking request created successfully", resp));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookings(@AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        if (user.getRole() == User.Role.admin) {
            List<BookingResponse> list = bookingService.getAllBookings();
            return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
        }
        List<BookingResponse> list = user.getRole() == User.Role.owner
                ? bookingService.getByOwner(user.getId())
                : bookingService.getByFarmer(user.getId());
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    // Parametric action routes
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> approve(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        BookingResponse resp = bookingService.approve(id, resolve(ud));
        return ResponseEntity.ok(ApiResponse.ok("Booking request approved successfully", resp));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> reject(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        BookingResponse resp = bookingService.reject(id, resolve(ud));
        return ResponseEntity.ok(ApiResponse.ok("Booking request rejected successfully", resp));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancel(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        BookingResponse resp = bookingService.cancel(id, resolve(ud));
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", resp));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails ud) {
        String status = body.get("status");
        String paymentStatus = body.getOrDefault("paymentStatus", body.get("payment_status"));
        BookingResponse resp = bookingService.updateStatus(id, status, paymentStatus, resolve(ud));
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated successfully", resp));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getById(id, resolve(ud))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        bookingService.delete(id, resolve(ud));
        return ResponseEntity.ok(ApiResponse.ok("Booking deleted successfully", null));
    }

    private User resolve(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }
}

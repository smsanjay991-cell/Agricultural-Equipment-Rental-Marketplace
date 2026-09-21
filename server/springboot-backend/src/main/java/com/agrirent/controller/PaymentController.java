package com.agrirent.controller;

import com.agrirent.entity.User;
import com.agrirent.exception.ApiResponse;
import com.agrirent.repository.UserRepository;
import com.agrirent.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        Long bookingId = toLong(body.getOrDefault("bookingId", body.get("booking_id")));
        BigDecimal amount = body.get("amount") != null ? new BigDecimal(body.get("amount").toString()) : null;
        String method = (String) body.getOrDefault("paymentMethod", body.getOrDefault("payment_method", "UPI/QR"));
        String txnId  = (String) body.getOrDefault("transactionId", body.get("transaction_id"));
        Map<String, Object> result = paymentService.create(bookingId, amount, method, txnId, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Payment processed and recorded successfully", result));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<Object>> getByBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        Map<String, Object> result = paymentService.getPaymentByBooking(bookingId, user);
        // Mirror Node.js response: {success, data, history}
        return ResponseEntity.ok(ApiResponse.<Object>builder()
                .success(true)
                .data(result.get("data"))
                .history(result.get("history"))
                .build());
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyPayments(@AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        List<Map<String, Object>> list = paymentService.getMyPayments(user.getId());
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAll() {
        List<Map<String, Object>> list = paymentService.getAll();
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails ud) {
        User admin = resolve(ud);
        String status = body.getOrDefault("paymentStatus", body.get("payment_status"));
        Map<String, Object> result = paymentService.updateStatus(id, status, admin);
        return ResponseEntity.ok(ApiResponse.ok("Payment status updated to " + status, result));
    }

    private User resolve(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }

    private Long toLong(Object v) {
        if (v == null) return null;
        try { return Long.parseLong(v.toString()); } catch (Exception e) { return null; }
    }
}

package com.agrirent.controller;

import com.agrirent.entity.User;
import com.agrirent.exception.ApiResponse;
import com.agrirent.repository.UserRepository;
import com.agrirent.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAll(@AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        List<Map<String, Object>> list = notificationService.getByUser(user.getId());
        long unread = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .success(true)
                .count(list.size())
                .unreadCount(unread)
                .data(list)
                .build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Void>> getUnreadCount(@AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        long unread = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .unreadCount(unread)
                .count((int) unread)
                .build());
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Map<String, Object>>> markAsRead(
            @PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        Map<String, Object> n = notificationService.markAsRead(id, user.getId(), user.getRole());
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", n));
    }

    private User resolve(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }
}

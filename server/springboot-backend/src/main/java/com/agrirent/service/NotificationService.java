package com.agrirent.service;

import com.agrirent.entity.Notification;
import com.agrirent.entity.User;
import com.agrirent.exception.ForbiddenException;
import com.agrirent.exception.NotFoundException;
import com.agrirent.repository.NotificationRepository;
import com.agrirent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void create(Long userId, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(n);
    }

    public List<Map<String, Object>> getByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public Map<String, Object> markAsRead(Long id, Long userId, User.Role role) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
        if (!n.getUser().getId().equals(userId) && role != User.Role.admin) {
            throw new ForbiddenException("Not authorized to modify another user's notification");
        }
        n.setIsRead(true);
        n = notificationRepository.save(n);
        return toMap(n);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    private Map<String, Object> toMap(Notification n) {
        return Map.of(
            "_id", n.getId(),
            "id",  n.getId(),
            "userId", n.getUser().getId(),
            "title", n.getTitle(),
            "message", n.getMessage(),
            "isRead", n.getIsRead(),
            "is_read", n.getIsRead(),
            "createdAt", n.getCreatedAt() != null ? n.getCreatedAt().toString() : "",
            "created_at", n.getCreatedAt() != null ? n.getCreatedAt().toString() : ""
        );
    }
}

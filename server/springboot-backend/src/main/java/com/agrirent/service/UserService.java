package com.agrirent.service;

import com.agrirent.dto.AuthResponse;
import com.agrirent.entity.User;
import com.agrirent.exception.BadRequestException;
import com.agrirent.exception.ForbiddenException;
import com.agrirent.exception.NotFoundException;
import com.agrirent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AuthResponse> getAll() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AuthResponse getById(Long id) {
        return toResponse(requireUser(id));
    }

    @Transactional
    public AuthResponse updateUser(Long id, String name, String email, String phone, String role, String location, String avatar) {
        User user = requireUser(id);
        if (name == null || name.isBlank()) throw new BadRequestException("Full name is required");
        if (email == null || email.isBlank()) throw new BadRequestException("Email address is required");

        String trimEmail = email.trim().toLowerCase();
        if (!trimEmail.equals(user.getEmail())) {
            if (userRepository.existsByEmailIgnoreCase(trimEmail)) {
                // check it's not the same user
                userRepository.findByEmailIgnoreCase(trimEmail)
                        .filter(u -> !u.getId().equals(id))
                        .ifPresent(u -> { throw new BadRequestException("Email address is already registered to another account"); });
            }
        }

        User.Role targetRole = user.getRole();
        if (role != null) {
            try { targetRole = User.Role.valueOf(role.toLowerCase()); }
            catch (IllegalArgumentException e) { throw new BadRequestException("Invalid user role specified. Allowed roles: farmer, owner, admin"); }
        }

        user.setName(name.trim());
        user.setEmail(trimEmail);
        if (phone != null) user.setPhone(phone);
        user.setRole(targetRole);
        if (location != null) user.setLocation(location);
        if (avatar != null) user.setAvatar(avatar);

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public AuthResponse updateProfile(Long userId, String name, String email, String phone, String location, String avatar, String password) {
        User user = requireUser(userId);

        if (name != null) user.setName(name);
        if (email != null) user.setEmail(email.toLowerCase());
        if (phone != null) user.setPhone(phone);
        if (location != null) user.setLocation(location);
        if (avatar != null) user.setAvatar(avatar);
        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id, Long currentAdminId) {
        if (id.equals(currentAdminId)) throw new BadRequestException("Administrators cannot delete their own active account");
        User user = requireUser(id);
        userRepository.delete(user);
    }

    private User requireUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User record not found"));
    }

    private AuthResponse toResponse(User u) {
        return AuthResponse.builder()
                ._id(u.getId())
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole().name())
                .location(u.getLocation())
                .avatar(u.getAvatar())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }
}

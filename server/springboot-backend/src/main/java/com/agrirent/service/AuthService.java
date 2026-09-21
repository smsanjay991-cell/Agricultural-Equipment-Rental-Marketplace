package com.agrirent.service;

import com.agrirent.dto.AuthResponse;
import com.agrirent.dto.LoginRequest;
import com.agrirent.dto.RegisterRequest;
import com.agrirent.entity.User;
import com.agrirent.exception.BadRequestException;
import com.agrirent.repository.UserRepository;
import com.agrirent.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        // Email uniqueness check
        if (userRepository.existsByEmailIgnoreCase(req.getEmail())) {
            throw new BadRequestException("User already exists with this email address");
        }

        // Validate and normalize role
        User.Role role = User.Role.farmer;
        if (req.getRole() != null) {
            try {
                role = User.Role.valueOf(req.getRole().toLowerCase());
            } catch (IllegalArgumentException ignored) {
                role = User.Role.farmer;
            }
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(role)
                .location(req.getLocation() != null ? req.getLocation() : "")
                .avatar("")
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmailIgnoreCase(req.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    public AuthResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User profile not found"));
        return buildAuthResponse(user, null);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                ._id(user.getId())
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .location(user.getLocation())
                .avatar(user.getAvatar())
                .token(token)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

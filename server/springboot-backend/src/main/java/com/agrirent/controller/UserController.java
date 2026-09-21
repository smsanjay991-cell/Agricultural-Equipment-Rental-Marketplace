package com.agrirent.controller;

import com.agrirent.dto.AuthResponse;
import com.agrirent.entity.User;
import com.agrirent.exception.ApiResponse;
import com.agrirent.repository.UserRepository;
import com.agrirent.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuthResponse>>> getUsers() {
        List<AuthResponse> users = userService.getAll();
        return ResponseEntity.ok(ApiResponse.okList(users, users.size()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<AuthResponse>> updateProfile(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails ud) {
        User user = resolve(ud);
        AuthResponse resp = userService.updateProfile(user.getId(),
                body.get("name"), body.get("email"), body.get("phone"),
                body.get("location"), body.get("avatar"), body.get("password"));
        return ResponseEntity.ok(ApiResponse.ok(resp));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthResponse>> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        AuthResponse resp = userService.updateUser(id,
                body.get("name"), body.get("email"), body.get("phone"),
                body.get("role"), body.get("location"), body.get("avatar"));
        return ResponseEntity.ok(ApiResponse.ok("User profile and role updated successfully", resp));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails ud) {
        User admin = resolve(ud);
        userService.delete(id, admin.getId());
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }

    private User resolve(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }
}

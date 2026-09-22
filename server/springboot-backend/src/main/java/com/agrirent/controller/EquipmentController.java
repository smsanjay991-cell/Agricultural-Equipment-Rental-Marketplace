package com.agrirent.controller;
import org.springframework.http.MediaType;
import com.agrirent.dto.EquipmentResponse;
import com.agrirent.entity.User;
import com.agrirent.exception.ApiResponse;
import com.agrirent.repository.UserRepository;
import com.agrirent.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final UserRepository userRepository;

    // Public
    @GetMapping
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getAll(@RequestParam Map<String, String> params) {
        List<EquipmentResponse> list = equipmentService.findAll(params);
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    // Protected – Owner/Admin only (before /:id to prevent shadowing)
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getMyEquipment(@AuthenticationPrincipal UserDetails ud) {
        User user = resolveUser(ud);
        List<EquipmentResponse> list = equipmentService.findByOwner(user.getId());
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    // Public
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EquipmentResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(equipmentService.findById(id)));
    }@PostMapping
@PreAuthorize("hasAnyRole('OWNER','ADMIN')")
public ResponseEntity<ApiResponse<EquipmentResponse>> create(
        @RequestParam Map<String, String> body,
        @AuthenticationPrincipal UserDetails ud) {

    User user = resolveUser(ud);

    Map<String, Object> data = new HashMap<>(body);

    EquipmentResponse resp = equipmentService.create(data, user);

    return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Equipment created successfully", resp));
}

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails ud) {
        User user = resolveUser(ud);
        equipmentService.delete(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Equipment listing removed successfully", null));
    }

    private User resolveUser(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }
}

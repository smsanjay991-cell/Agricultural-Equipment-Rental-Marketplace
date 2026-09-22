package com.agrirent.controller;

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
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final UserRepository userRepository;

    // GET /api/equipment  (public)
    @GetMapping
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getAll(
            @RequestParam Map<String, String> params) {

        List<EquipmentResponse> list = equipmentService.findAll(params);
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    // GET /api/equipment/my  (owner/admin)
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getMyEquipment(
            @AuthenticationPrincipal UserDetails ud) {

        User user = resolveUser(ud);
        List<EquipmentResponse> list = equipmentService.findByOwner(user.getId());
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    // GET /api/equipment/{id}  (public)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EquipmentResponse>> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(ApiResponse.ok(equipmentService.findById(id)));
    }

    // POST /api/equipment  (owner/admin)
    // NO consumes restriction — Spring's multipart resolver handles any
    // multipart/form-data regardless of boundary or charset parameters.
    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<EquipmentResponse>> create(
            @RequestParam Map<String, String> fields,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserDetails ud) {

        User user = resolveUser(ud);
        Map<String, Object> data = buildDataMap(fields, imageFile);
        EquipmentResponse resp = equipmentService.create(data, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Equipment created successfully", resp));
    }

    // PUT /api/equipment/{id}  (owner/admin)
    // Same: no consumes restriction.
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<EquipmentResponse>> update(
            @PathVariable Long id,
            @RequestParam Map<String, String> fields,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserDetails ud) {

        User user = resolveUser(ud);
        Map<String, Object> data = buildDataMap(fields, imageFile);
        EquipmentResponse resp = equipmentService.update(id, data, user);

        return ResponseEntity.ok(ApiResponse.ok("Equipment updated successfully", resp));
    }

    // DELETE /api/equipment/{id}  (owner/admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails ud) {

        User user = resolveUser(ud);
        equipmentService.delete(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Equipment listing removed successfully", null));
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private Map<String, Object> buildDataMap(
            Map<String, String> fields,
            MultipartFile imageFile) {

        Map<String, Object> data = new HashMap<>(fields);

        if (imageFile != null && !imageFile.isEmpty()) {
            // Store the file object so the service layer can extend to save it.
            data.put("imageFile", imageFile);
            // Use original filename as fallback image string if none provided.
            data.putIfAbsent("image", imageFile.getOriginalFilename());
        }

        return data;
    }

    private User resolveUser(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }
}

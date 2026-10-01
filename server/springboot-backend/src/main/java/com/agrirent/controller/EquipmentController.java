package com.agrirent.controller;

import com.agrirent.dto.EquipmentResponse;
import com.agrirent.entity.User;
import com.agrirent.exception.ApiResponse;
import com.agrirent.repository.UserRepository;
import com.agrirent.service.EquipmentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${upload.path:uploads}")
    private String uploadDir;

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
    // Exactly ONE create endpoint supporting both multipart/form-data (FormData) and application/json
    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<EquipmentResponse>> create(
            @RequestParam(required = false) Map<String, String> fields,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request,
            @AuthenticationPrincipal UserDetails ud) {

        User user = resolveUser(ud);
        Map<String, Object> data = buildDataMap(fields, imageFile, request);
        EquipmentResponse resp = equipmentService.create(data, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Equipment created successfully", resp));
    }

    // PUT /api/equipment/{id}  (owner/admin)
    // Exactly ONE update endpoint supporting both multipart/form-data (FormData) and application/json
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<EquipmentResponse>> update(
            @PathVariable Long id,
            @RequestParam(required = false) Map<String, String> fields,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request,
            @AuthenticationPrincipal UserDetails ud) {

        User user = resolveUser(ud);
        Map<String, Object> data = buildDataMap(fields, imageFile, request);
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
            MultipartFile imageFile,
            HttpServletRequest request) {

        Map<String, Object> data = new HashMap<>();

        // If JSON payload (e.g. from JSON REST clients/audit scripts)
        String contentType = request.getContentType();
        if (contentType != null && contentType.toLowerCase().contains("application/json")) {
            try {
                Map<String, Object> jsonMap = objectMapper.readValue(request.getInputStream(), Map.class);
                if (jsonMap != null) {
                    data.putAll(jsonMap);
                }
            } catch (Exception ignored) {
            }
        }

        // Add form-data/request parameters
        if (fields != null && !fields.isEmpty()) {
            data.putAll(fields);
        }

        // Process uploaded image file
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                Path equipmentUploadDir = Paths.get(uploadDir, "equipment").toAbsolutePath().normalize();
                Files.createDirectories(equipmentUploadDir);

                String origName = imageFile.getOriginalFilename();
                String ext = "";
                if (origName != null && origName.contains(".")) {
                    ext = origName.substring(origName.lastIndexOf("."));
                }
                String filename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
                Path targetPath = equipmentUploadDir.resolve(filename);
                imageFile.transferTo(targetPath.toFile());

                String imagePath = "/uploads/equipment/" + filename;
                data.put("image", imagePath);
                data.put("images", List.of(imagePath));
            } catch (Exception e) {
                data.putIfAbsent("image", imageFile.getOriginalFilename());
            }
        }

        return data;
    }

    private User resolveUser(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }
}

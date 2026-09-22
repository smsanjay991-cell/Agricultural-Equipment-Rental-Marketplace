package com.agrirent.controller;

import com.agrirent.dto.EquipmentResponse;
import com.agrirent.entity.User;
import com.agrirent.exception.ApiResponse;
import com.agrirent.repository.UserRepository;
import com.agrirent.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    // =========================
    // GET ALL EQUIPMENT (public)
    // =========================
    @GetMapping
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getAll(
            @RequestParam Map<String, String> params) {

        List<EquipmentResponse> list = equipmentService.findAll(params);
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    // =========================
    // GET MY EQUIPMENT (owner/admin)
    // =========================
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getMyEquipment(
            @AuthenticationPrincipal UserDetails ud) {

        User user = resolveUser(ud);
        List<EquipmentResponse> list = equipmentService.findByOwner(user.getId());
        return ResponseEntity.ok(ApiResponse.okList(list, list.size()));
    }

    // =========================
    // GET EQUIPMENT BY ID (public)
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EquipmentResponse>> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(ApiResponse.ok(equipmentService.findById(id)));
    }

    // =========================
    // CREATE EQUIPMENT
    // Accepts multipart/form-data sent by the browser's FormData API.
    // @RequestParam binds each text field; @RequestParam(required=false)
    // MultipartFile binds the optional image file part.
    // consumes = MULTIPART_FORM_DATA_VALUE allows the boundary parameter
    // to be present in the incoming Content-Type (Spring ignores it correctly).
    // =========================
   @PutMapping("/{id}")
@PreAuthorize("hasAnyRole('OWNER','ADMIN')")
public ResponseEntity<ApiResponse<EquipmentResponse>> update(
        @PathVariable Long id,
        @RequestParam Map<String, String> body,
        @AuthenticationPrincipal UserDetails ud) {

    User user = resolveUser(ud);

    Map<String, Object> data = new HashMap<>(body);

    EquipmentResponse resp = equipmentService.update(id, data, user);

    return ResponseEntity.ok(
            ApiResponse.ok("Equipment updated successfully", resp)
    );
}

    // =========================
    // UPDATE EQUIPMENT
    // Same multipart pattern as create.
    // =========================
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
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

    // =========================
    // DELETE EQUIPMENT
    // =========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails ud) {

        User user = resolveUser(ud);
        equipmentService.delete(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Equipment listing removed successfully", null));
    }

    // =========================
    // HELPERS
    // =========================

    /**
     * Build the data map passed to EquipmentService.
     * Text form fields come from @RequestParam Map<String, String>.
     * The image field, when present as a file, is stored under key "imageFile"
     * so EquipmentService can handle it; the imageUrl string (if any) is already
     * in the fields map under "image".
     */
    private Map<String, Object> buildDataMap(
            Map<String, String> fields,
            MultipartFile imageFile) {

        Map<String, Object> data = new HashMap<>(fields);

        // If a real file was uploaded, store it for the service layer to handle.
        // EquipmentService currently stores a URL string; the file is ignored at
        // the service layer unless image-storage is implemented. This keeps the
        // controller contract correct so it can be extended later.
        if (imageFile != null && !imageFile.isEmpty()) {
            data.put("imageFile", imageFile);
            // Keep the original filename as a fallback image string
            data.putIfAbsent("image", imageFile.getOriginalFilename());
        }

        return data;
    }

    private User resolveUser(UserDetails ud) {
        return userRepository.findByEmailIgnoreCase(ud.getUsername()).orElseThrow();
    }
}

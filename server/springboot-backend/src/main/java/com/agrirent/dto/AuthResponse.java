package com.agrirent.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Auth response DTO – mirrors the Node.js login/register response exactly.
 * Both _id and id are set to the user's database ID.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private Long _id;
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String location;
    private String avatar;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

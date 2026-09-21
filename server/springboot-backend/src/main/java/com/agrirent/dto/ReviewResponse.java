package com.agrirent.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewResponse {
    private Long _id;
    private Long id;
    private Long equipment_id;
    private Long equipmentId;
    private Long farmer_id;
    private Long farmerId;
    private Long booking_id;
    private Long bookingId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime created_at;
    private FarmerInfo farmer;

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FarmerInfo {
        private Long _id;
        private Long id;
        private String name;
        private String avatar;
    }
}

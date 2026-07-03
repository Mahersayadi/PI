package com.example.notification.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class NotificationResponseDTO {
    private Long id;
    private Long employeeId;
    private String type;
    private String message;
    private String status;
    private LocalDateTime createdAt;
    private Map<String, Object> details;
}
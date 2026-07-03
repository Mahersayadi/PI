package com.example.notification.dto;

import lombok.Data;

@Data
public class NotificationRequestDTO {
    private Long employeeId;
    private String type;
    private String message;
}
package com.example.notification.service;

import com.example.notification.dto.NotificationRequestDTO;
import com.example.notification.dto.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {
    NotificationResponseDTO createNotification(NotificationRequestDTO request);
    List<NotificationResponseDTO> getNotificationsByEmployee(Long employeeId);
    NotificationResponseDTO markAsRead(Long id);
    void deleteNotification(Long id);

    // ======================================
    // 🔹 MARQUER TOUTES LES NOTIFICATIONS COMME LUES
    // ======================================
    void markAllAsRead(Long employeeId);
}
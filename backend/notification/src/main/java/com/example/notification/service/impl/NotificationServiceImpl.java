package com.example.notification.service.impl;

import com.example.notification.dto.NotificationRequestDTO;
import com.example.notification.dto.NotificationResponseDTO;
import com.example.notification.exception.ResourceNotFoundException;
import com.example.notification.feign.EmployeeServiceClient;
import com.example.notification.feign.CongeServiceClient;
import com.example.notification.feign.PaieServiceClient;
import com.example.notification.model.Notification;
import com.example.notification.repository.NotificationRepository;
import com.example.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmployeeServiceClient employeeServiceClient;
    private final CongeServiceClient congeServiceClient;
    private final PaieServiceClient paieServiceClient;

    // ======================================
    // 🔹 CRÉER UNE NOTIFICATION
    // ======================================
    @Override
    public NotificationResponseDTO createNotification(NotificationRequestDTO request) {
        Notification notification = new Notification();

        notification.setEmployeeId(request.getEmployeeId());
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());
        notification.setStatus("UNREAD");
        notification.setCreatedAt(LocalDateTime.now());

        // 🔹 Vérifie si l’employé existe avant de créer la notification
        try {
            Map<String, Object> employee = employeeServiceClient.getEmployeeById(request.getEmployeeId());
            if (employee == null || employee.isEmpty()) {
                throw new ResourceNotFoundException("Employé introuvable avec l'ID: " + request.getEmployeeId());
            }
        } catch (Exception e) {
            System.err.println("⚠️ Erreur Feign (employee-service) : " + e.getMessage());
        }

        Notification saved = notificationRepository.save(notification);

        NotificationResponseDTO response = new NotificationResponseDTO();
        BeanUtils.copyProperties(saved, response);
        return response;
    }

    // ======================================
    // 🔹 RÉCUPÉRER LES NOTIFICATIONS D’UN EMPLOYÉ
    // ======================================
    @Override
    public List<NotificationResponseDTO> getNotificationsByEmployee(Long employeeId) {
        return notificationRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream()
                .map(notification -> {
                    NotificationResponseDTO dto = new NotificationResponseDTO();
                    BeanUtils.copyProperties(notification, dto);

                    // 🔹 Optionnel : enrichir le message avec les infos réelles
                    try {
                        if ("CONGE".equalsIgnoreCase(notification.getType())) {
                            List<Map<String, Object>> conges = congeServiceClient.getCongesByEmployee(employeeId);
                            dto.setDetails(Map.of("conges", conges));
                        } else if ("PAIE".equalsIgnoreCase(notification.getType())) {
                            Double salaire = paieServiceClient.getSalaireBase(employeeId);
                            dto.setDetails(Map.of("salaireBase", salaire));
                        }
                    } catch (Exception e) {
                        System.err.println("⚠️ Impossible de charger les détails Feign : " + e.getMessage());
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ======================================
    // 🔹 MARQUER UNE NOTIFICATION COMME LUE
    // ======================================
    @Override
    public NotificationResponseDTO markAsRead(Long id) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée avec ID " + id));

        notif.setStatus("READ");
        notif.setUpdatedAt(LocalDateTime.now());

        Notification updated = notificationRepository.save(notif);

        NotificationResponseDTO dto = new NotificationResponseDTO();
        BeanUtils.copyProperties(updated, dto);
        return dto;
    }

    // ======================================
    // 🔹 SUPPRIMER UNE NOTIFICATION
    // ======================================
    @Override
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification non trouvée avec ID " + id);
        }
        notificationRepository.deleteById(id);
    }

    // ======================================
    // 🔹 MARQUER TOUTES LES NOTIFICATIONS COMME LUES
    // ======================================
    @Override
    public void markAllAsRead(Long employeeId) {
        List<Notification> notifications = notificationRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);

        if (notifications.isEmpty()) {
            throw new ResourceNotFoundException("Aucune notification trouvée pour l'employé " + employeeId);
        }

        notifications.forEach(n -> {
            n.setStatus("READ");
            n.setUpdatedAt(LocalDateTime.now());
        });

        notificationRepository.saveAll(notifications);
    }
}

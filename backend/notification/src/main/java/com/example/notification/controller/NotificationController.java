package com.example.notification.controller;

import com.example.notification.dto.NotificationRequestDTO;
import com.example.notification.dto.NotificationResponseDTO;
import com.example.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponseDTO> create(@RequestBody NotificationRequestDTO request) {
        return ResponseEntity.ok(notificationService.createNotification(request));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<NotificationResponseDTO>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(notificationService.getNotificationsByEmployee(employeeId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}

/*package com.example.notification.controller;

import com.example.notification.dto.NotificationRequestDTO;
import com.example.notification.dto.NotificationResponseDTO;
import com.example.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "📬 Notification API", description = "Gestion des notifications employé (lecture, création, suppression...)")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    // ============================================================
    // 🔹 1. Créer une nouvelle notification
    // ============================================================
    @Operation(
            summary = "Créer une notification",
            description = "Permet de créer une notification manuellement ou depuis un autre microservice.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Notification créée avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Erreur interne du serveur", content = @Content)
            }
    )
    @PostMapping
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @RequestBody NotificationRequestDTO request) {
        return ResponseEntity.ok(notificationService.createNotification(request));
    }

    // ============================================================
    // 🔹 2. Récupérer les notifications d’un employé
    // ============================================================
    @Operation(
            summary = "Lister les notifications d’un employé",
            description = "Retourne toutes les notifications triées par date décroissante.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = NotificationResponseDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Aucune notification trouvée", content = @Content)
            }
    )
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<NotificationResponseDTO>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(notificationService.getNotificationsByEmployee(employeeId));
    }

    // ============================================================
    // 🔹 3. Marquer une notification comme lue
    // ============================================================
    @Operation(
            summary = "Marquer une notification comme lue",
            description = "Met à jour le statut d’une notification en 'READ'.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Notification mise à jour"),
                    @ApiResponse(responseCode = "404", description = "Notification non trouvée", content = @Content)
            }
    )
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // ============================================================
    // 🔹 4. Marquer toutes les notifications comme lues
    // ============================================================
    @Operation(
            summary = "Marquer toutes les notifications comme lues",
            description = "Met à jour toutes les notifications d’un employé en 'READ'.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Toutes les notifications marquées comme lues"),
                    @ApiResponse(responseCode = "404", description = "Aucune notification trouvée", content = @Content)
            }
    )
    @PutMapping("/employee/{employeeId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long employeeId) {
        notificationService.markAllAsRead(employeeId);
        return ResponseEntity.ok().build();
    }

    // ============================================================
    // 🔹 5. Supprimer une notification
    // ============================================================
    @Operation(
            summary = "Supprimer une notification",
            description = "Supprime définitivement une notification.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Notification supprimée"),
                    @ApiResponse(responseCode = "404", description = "Notification non trouvée", content = @Content)
            }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
*/
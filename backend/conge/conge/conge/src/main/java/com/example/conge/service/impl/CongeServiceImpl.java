package com.example.conge.service.impl;

import com.example.conge.dto.CongeRequestDTO;
import com.example.conge.dto.CongeResponseDTO;
import com.example.conge.dto.CongeValidationDTO;
import com.example.conge.dto.NotificationRequestDTO;
import com.example.conge.exception.ResourceNotFoundException;
import com.example.conge.feign.EmployeeServiceClient;
import com.example.conge.feign.NotificationClient;
import com.example.conge.model.Conge;
import com.example.conge.repository.CongeRepository;
import com.example.conge.service.CongeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CongeServiceImpl implements CongeService {

    private final CongeRepository congeRepository;
    private final EmployeeServiceClient employeeServiceClient;
    private final NotificationClient notificationClient; // 🔔 Feign vers notification-service

    // ===============================
    // 🟢 DEMANDER UN CONGÉ
    // ===============================
    @Override
    @Transactional
    public CongeResponseDTO demanderConge(CongeRequestDTO congeRequest) {
        // Vérifier que l'employé existe
        Boolean employeeExists = employeeServiceClient.checkEmployeeExists(congeRequest.getEmployeeId());
        if (!employeeExists) {
            throw new ResourceNotFoundException("Employé non trouvé avec l'ID: " + congeRequest.getEmployeeId());
        }

        // Vérifier chevauchement
        boolean chevauchement = congeRepository.existsChevauchementConge(
                congeRequest.getEmployeeId(),
                congeRequest.getDateDebut(),
                congeRequest.getDateFin());

        if (chevauchement) {
            throw new IllegalArgumentException("L'employé a déjà un congé sur cette période.");
        }

        // Vérifier validité des dates
        if (congeRequest.getDateDebut().isAfter(congeRequest.getDateFin())) {
            throw new IllegalArgumentException("La date de début doit être avant la date de fin.");
        }

        // Créer le congé
        Conge conge = new Conge();
        conge.setEmployeeId(congeRequest.getEmployeeId());
        conge.setTypeConge(congeRequest.getTypeConge());
        conge.setDateDebut(congeRequest.getDateDebut());
        conge.setDateFin(congeRequest.getDateFin());
        conge.setMotif(congeRequest.getMotif());
        conge.setStatut(Conge.StatutConge.EN_ATTENTE);

        Conge savedConge = congeRepository.save(conge);

        // 🔔 Envoi automatique d'une notification de demande
        try {
            NotificationRequestDTO notif = new NotificationRequestDTO();
            notif.setEmployeeId(conge.getEmployeeId());
            notif.setType("CONGE");
            notif.setMessage("Votre demande de congé du " + conge.getDateDebut() + " au " + conge.getDateFin() + " a été enregistrée 📝");
            notificationClient.sendNotification(notif);
        } catch (Exception e) {
            System.err.println("⚠️ Erreur lors de l'envoi de la notification : " + e.getMessage());
        }

        return convertToResponseDTO(savedConge);
    }

    // ===============================
    // 🟠 VALIDER OU REJETER UN CONGÉ
    // ===============================
    @Override
    @Transactional
    public CongeResponseDTO validerConge(Long congeId, CongeValidationDTO validationDTO) {
        Conge conge = congeRepository.findById(congeId)
                .orElseThrow(() -> new ResourceNotFoundException("Congé non trouvé avec l'ID: " + congeId));

        // Seuls les congés en attente peuvent être validés/rejetés
        if (conge.getStatut() != Conge.StatutConge.EN_ATTENTE) {
            throw new IllegalArgumentException("Seuls les congés en attente peuvent être validés ou rejetés.");
        }

        conge.setStatut(validationDTO.getStatut());
        conge.setCommentaireResponsable(validationDTO.getCommentaireResponsable());
        Conge updatedConge = congeRepository.save(conge);

        // 🔔 Notification automatique selon le statut
        try {
            NotificationRequestDTO notif = new NotificationRequestDTO();
            notif.setEmployeeId(conge.getEmployeeId());
            notif.setType("CONGE");

            if (validationDTO.getStatut() == Conge.StatutConge.APPROUVE) {
                notif.setMessage("✅ Votre congé du " + conge.getDateDebut() + " au " + conge.getDateFin() + " a été approuvé !");
            } else if (validationDTO.getStatut() == Conge.StatutConge.REFUSE) {
                notif.setMessage("❌ Votre demande de congé du " + conge.getDateDebut() + " au " + conge.getDateFin() + " a été rejetée.");
            }

            notificationClient.sendNotification(notif);
        } catch (Exception e) {
            System.err.println("⚠️ Erreur lors de l'envoi de la notification : " + e.getMessage());
        }

        return convertToResponseDTO(updatedConge);
    }

    // ===============================
    // 🔵 CONSULTER LES CONGÉS D’UN EMPLOYÉ
    // ===============================
    @Override
    public List<CongeResponseDTO> getCongesByEmployeeId(Long employeeId) {
        Boolean employeeExists = employeeServiceClient.checkEmployeeExists(employeeId);
        if (!employeeExists) {
            throw new ResourceNotFoundException("Employé non trouvé avec l'ID: " + employeeId);
        }

        return congeRepository.findByEmployeeIdOrderByDateDebutDesc(employeeId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ===============================
    // 🟣 CONSULTER PAR STATUT
    // ===============================
    @Override
    public List<CongeResponseDTO> getCongesByStatut(String statut) {
        Conge.StatutConge statutEnum = Conge.StatutConge.valueOf(statut.toUpperCase());
        return congeRepository.findByStatutOrderByCreatedAtDesc(statutEnum).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ===============================
    // 🟤 CONSULTER PAR ID
    // ===============================
    @Override
    public CongeResponseDTO getCongeById(Long id) {
        Conge conge = congeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Congé non trouvé avec l'ID: " + id));
        return convertToResponseDTO(conge);
    }

    // ===============================
    // 🔴 SUPPRIMER UN CONGÉ
    // ===============================
    @Override
    @Transactional
    public void supprimerConge(Long id) {
        Conge conge = congeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Congé non trouvé avec l'ID: " + id));

        if (conge.getStatut() != Conge.StatutConge.EN_ATTENTE) {
            throw new IllegalArgumentException("Seuls les congés en attente peuvent être supprimés.");
        }

        congeRepository.delete(conge);
    }

    // ===============================
    // 🧾 OBTENIR TOUS LES CONGÉS
    // ===============================
    @Override
    public List<CongeResponseDTO> getAllConges() {
        return congeRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ===============================
    // 🧠 MÉTHODE UTILITAIRE DE CONVERSION
    // ===============================
    private CongeResponseDTO convertToResponseDTO(Conge conge) {
        CongeResponseDTO dto = new CongeResponseDTO();
        dto.setId(conge.getId());
        dto.setEmployeeId(conge.getEmployeeId());
        dto.setTypeConge(conge.getTypeConge());
        dto.setDateDebut(conge.getDateDebut());
        dto.setDateFin(conge.getDateFin());
        dto.setMotif(conge.getMotif());
        dto.setStatut(conge.getStatut());
        dto.setCommentaireResponsable(conge.getCommentaireResponsable());
        dto.setNombreJours(conge.getNombreJours());
        dto.setCreatedAt(conge.getCreatedAt());
        dto.setUpdatedAt(conge.getUpdatedAt());

        try {
            EmployeeServiceClient.EmployeeInfo employeeInfo =
                    employeeServiceClient.getEmployeeInfo(conge.getEmployeeId());
            dto.setEmployeeNom(employeeInfo.getFullName());
        } catch (Exception e) {
            dto.setEmployeeNom("Employé non trouvé");
        }

        return dto;
    }
}

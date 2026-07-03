package com.example.conge.dto;

import com.example.conge.model.Conge.StatutConge;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CongeResponseDTO {
    private Long id;
    private Long employeeId;
    private String employeeNom; // Récupéré via Feign
    private String typeConge;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String motif;
    private StatutConge statut;
    private String commentaireResponsable;
    private int nombreJours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
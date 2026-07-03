package com.example.conge.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "conges")
@Data
public class Conge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "type_conge", nullable = false)
    private String typeConge; // "ANNUEL", "MALADIE", "EXCEPTIONNEL"

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    private String motif;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutConge statut = StatutConge.EN_ATTENTE;

    @Column(name = "commentaire_responsable")
    private String commentaireResponsable;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum StatutConge {
        EN_ATTENTE,
        APPROUVE,
        REFUSE
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Calcul du nombre de jours de congé
    public int getNombreJours() {
        return (int) java.time.temporal.ChronoUnit.DAYS.between(dateDebut, dateFin) + 1;
    }
}
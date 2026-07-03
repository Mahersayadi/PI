package com.example.conge.repository;

import com.example.conge.model.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CongeRepository extends JpaRepository<Conge, Long> {
    List<Conge> findByEmployeeIdOrderByDateDebutDesc(Long employeeId);
    List<Conge> findByStatutOrderByCreatedAtDesc(Conge.StatutConge statut);

    // ✅ CORRECTION : Méthode avec @Query pour plus de clarté
    @Query("SELECT COUNT(c) > 0 FROM Conge c WHERE " +
            "c.employeeId = :employeeId AND " +
            "c.statut IN (com.example.conge.model.Conge.StatutConge.EN_ATTENTE, com.example.conge.model.Conge.StatutConge.APPROUVE) AND " +
            "((c.dateDebut BETWEEN :dateDebut AND :dateFin) OR " +
            "(c.dateFin BETWEEN :dateDebut AND :dateFin) OR " +
            "(c.dateDebut <= :dateDebut AND c.dateFin >= :dateFin))")
    boolean existsChevauchementConge(
            @Param("employeeId") Long employeeId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin);
}
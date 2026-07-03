package com.example.conge.dto;

import com.example.conge.model.Conge.StatutConge; // ✅ IMPORT IMPORTANT
import lombok.Data;

@Data
public class CongeValidationDTO {
    private StatutConge statut; // ✅ DOIT ÊTRE StatutConge, pas String
    private String commentaireResponsable;
}
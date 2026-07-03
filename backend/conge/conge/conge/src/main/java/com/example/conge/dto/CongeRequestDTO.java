package com.example.conge.dto;

import lombok.Data;
import java.time.LocalDate; // ✅ IMPORT IMPORTANT

@Data
public class CongeRequestDTO {
    private Long employeeId;
    private String typeConge;
    private LocalDate dateDebut; // ✅ LocalDate
    private LocalDate dateFin;   // ✅ LocalDate
    private String motif;
}
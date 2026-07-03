package com.example.paie.service;

import com.example.paie.dto.SalaireDTO;
import com.example.paie.dto.FichePaieRequestDTO;
import com.example.paie.dto.FichePaieResponseDTO;
import java.util.List;

public interface PaieService {
    // Gestion des salaires
    SalaireDTO creerOuModifierSalaire(SalaireDTO salaireDTO);
    SalaireDTO getSalaireByEmployeeId(Long employeeId);
    List<SalaireDTO> getAllSalaires();

    // Gestion des fiches de paie
    FichePaieResponseDTO genererFichePaie(FichePaieRequestDTO request);
    List<FichePaieResponseDTO> getFichesPaieByEmployeeId(Long employeeId);
}
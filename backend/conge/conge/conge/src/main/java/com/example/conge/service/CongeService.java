package com.example.conge.service;

import com.example.conge.dto.CongeRequestDTO;
import com.example.conge.dto.CongeResponseDTO;
import com.example.conge.dto.CongeValidationDTO;
import java.util.List;

public interface CongeService {
    CongeResponseDTO demanderConge(CongeRequestDTO congeRequest);
    CongeResponseDTO validerConge(Long congeId, CongeValidationDTO validationDTO);
    List<CongeResponseDTO> getCongesByEmployeeId(Long employeeId);
    List<CongeResponseDTO> getCongesByStatut(String statut);
    CongeResponseDTO getCongeById(Long id);
    void supprimerConge(Long id);
    List<CongeResponseDTO> getAllConges();
}
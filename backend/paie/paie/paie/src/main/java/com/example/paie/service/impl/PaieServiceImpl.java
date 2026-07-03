package com.example.paie.service.impl;

import com.example.paie.dto.SalaireDTO;
import com.example.paie.dto.FichePaieRequestDTO;
import com.example.paie.dto.FichePaieResponseDTO;
import com.example.paie.exception.ResourceNotFoundException;
import com.example.paie.model.Salaire;
import com.example.paie.model.FichePaie;
import com.example.paie.repository.SalaireRepository;
import com.example.paie.repository.FichePaieRepository;
import com.example.paie.service.PaieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.paie.feign.EmployeeServiceClient;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaieServiceImpl implements PaieService {

    private final SalaireRepository salaireRepository;
    private final FichePaieRepository fichePaieRepository;
    private final EmployeeServiceClient employeeServiceClient;

    @Override
    @Transactional
    public SalaireDTO creerOuModifierSalaire(SalaireDTO salaireDTO) {
        // ✅ AJOUTER cette validation :
        Boolean employeeExists = employeeServiceClient.checkEmployeeExists(salaireDTO.getEmployeeId());
        if (!employeeExists) {
            throw new ResourceNotFoundException("Employé non trouvé avec l'ID: " + salaireDTO.getEmployeeId());
        }
        Salaire salaire = salaireRepository.findByEmployeeId(salaireDTO.getEmployeeId())
                .orElse(new Salaire());

        // Mettre à jour les données
        salaire.setEmployeeId(salaireDTO.getEmployeeId());
        salaire.setSalaireBase(salaireDTO.getSalaireBase());
        salaire.setPrimes(salaireDTO.getPrimes() != null ? salaireDTO.getPrimes() : BigDecimal.ZERO);
        salaire.setDeductions(salaireDTO.getDeductions() != null ? salaireDTO.getDeductions() : BigDecimal.ZERO);

        Salaire savedSalaire = salaireRepository.save(salaire);
        return convertToSalaireDTO(savedSalaire);
    }

    @Override
    public SalaireDTO getSalaireByEmployeeId(Long employeeId) {
        Salaire salaire = salaireRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Salaire non trouvé pour l'employé: " + employeeId));
        return convertToSalaireDTO(salaire);
    }

    @Override
    public List<SalaireDTO> getAllSalaires() {
        return salaireRepository.findAll().stream()
                .map(this::convertToSalaireDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FichePaieResponseDTO genererFichePaie(FichePaieRequestDTO request) {
        // Récupérer le salaire de base de l'employé
        Salaire salaire = salaireRepository.findByEmployeeId(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Salaire non trouvé pour l'employé: " + request.getEmployeeId()));

        // Créer la fiche de paie
        FichePaie fichePaie = new FichePaie();
        fichePaie.setEmployeeId(request.getEmployeeId());
        fichePaie.setPeriodePaie(request.getPeriodePaie());
        fichePaie.setSalaireBase(salaire.getSalaireBase());
        fichePaie.setPrimes(request.getPrimes());
        fichePaie.setDeductions(request.getDeductions());

        FichePaie savedFichePaie = fichePaieRepository.save(fichePaie);
        return convertToFichePaieResponseDTO(savedFichePaie);
    }

    @Override
    public List<FichePaieResponseDTO> getFichesPaieByEmployeeId(Long employeeId) {
        return fichePaieRepository.findByEmployeeIdOrderByPeriodePaieDesc(employeeId).stream()
                .map(this::convertToFichePaieResponseDTO)
                .collect(Collectors.toList());
    }

    // Méthodes de conversion
    private SalaireDTO convertToSalaireDTO(Salaire salaire) {
        SalaireDTO dto = new SalaireDTO();
        dto.setId(salaire.getId());
        dto.setEmployeeId(salaire.getEmployeeId());
        dto.setSalaireBase(salaire.getSalaireBase());
        dto.setPrimes(salaire.getPrimes());
        dto.setDeductions(salaire.getDeductions());
        dto.setSalaireNet(salaire.getSalaireNet());
        return dto;
    }

    private FichePaieResponseDTO convertToFichePaieResponseDTO(FichePaie fichePaie) {
        FichePaieResponseDTO dto = new FichePaieResponseDTO();
        dto.setId(fichePaie.getId());
        dto.setEmployeeId(fichePaie.getEmployeeId());
        dto.setPeriodePaie(fichePaie.getPeriodePaie());
        dto.setSalaireBase(fichePaie.getSalaireBase());
        dto.setPrimes(fichePaie.getPrimes());
        dto.setDeductions(fichePaie.getDeductions());
        dto.setSalaireNet(fichePaie.getSalaireNet());
        return dto;
    }
}
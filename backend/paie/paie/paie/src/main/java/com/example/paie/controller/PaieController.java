package com.example.paie.controller;

import com.example.paie.dto.SalaireDTO;
import com.example.paie.dto.FichePaieRequestDTO;
import com.example.paie.dto.FichePaieResponseDTO;
import com.example.paie.service.PaieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/paie")
@RequiredArgsConstructor
public class PaieController {

    private final PaieService paieService;

    // === GESTION DES SALAIRES ===

    @PostMapping("/salaires")
    public ResponseEntity<SalaireDTO> creerOuModifierSalaire(@RequestBody SalaireDTO salaireDTO) {
        return ResponseEntity.ok(paieService.creerOuModifierSalaire(salaireDTO));
    }

    @GetMapping("/salaires/employee/{employeeId}")
    public ResponseEntity<SalaireDTO> getSalaireByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(paieService.getSalaireByEmployeeId(employeeId));
    }

    @GetMapping("/salaires")
    public ResponseEntity<List<SalaireDTO>> getAllSalaires() {
        return ResponseEntity.ok(paieService.getAllSalaires());
    }

    // Endpoints pour la communication entre microservices
    @GetMapping("/salaires/employee/{employeeId}/salaire-base")
    public ResponseEntity<Double> getSalaireBase(@PathVariable Long employeeId) {
        SalaireDTO salaire = paieService.getSalaireByEmployeeId(employeeId);
        return ResponseEntity.ok(salaire.getSalaireBase().doubleValue());
    }

    @GetMapping("/salaires/employee/{employeeId}/exists")
    public ResponseEntity<Boolean> checkSalaireExists(@PathVariable Long employeeId) {
        try {
            paieService.getSalaireByEmployeeId(employeeId);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    // === GESTION DES FICHES DE PAIE ===

    @PostMapping("/fiches-paie/generer")
    public ResponseEntity<FichePaieResponseDTO> genererFichePaie(@RequestBody FichePaieRequestDTO request) {
        return ResponseEntity.ok(paieService.genererFichePaie(request));
    }

    @GetMapping("/fiches-paie/employee/{employeeId}")
    public ResponseEntity<List<FichePaieResponseDTO>> getFichesPaieByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(paieService.getFichesPaieByEmployeeId(employeeId));
    }

    @GetMapping("/fiches-paie/{fichePaieId}")
    public ResponseEntity<FichePaieResponseDTO> getFichePaieById(@PathVariable Long fichePaieId) {
        // Pour l'instant, retourne une réponse simple
        // Vous pourrez l'implémenter plus tard
        return ResponseEntity.notFound().build();
    }
}
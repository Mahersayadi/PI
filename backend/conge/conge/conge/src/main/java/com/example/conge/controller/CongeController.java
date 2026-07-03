package com.example.conge.controller;

import com.example.conge.dto.CongeRequestDTO;
import com.example.conge.dto.CongeResponseDTO;
import com.example.conge.dto.CongeValidationDTO;
import com.example.conge.service.CongeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conges")
@RequiredArgsConstructor
public class CongeController {

    private final CongeService congeService;

    @PostMapping("/demander")
    public ResponseEntity<CongeResponseDTO> demanderConge(@RequestBody CongeRequestDTO congeRequest) {
        return ResponseEntity.ok(congeService.demanderConge(congeRequest));
    }

    @PutMapping("/{congeId}/valider")
    public ResponseEntity<CongeResponseDTO> validerConge(
            @PathVariable Long congeId,
            @RequestBody CongeValidationDTO validationDTO) {
        return ResponseEntity.ok(congeService.validerConge(congeId, validationDTO));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<CongeResponseDTO>> getCongesByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(congeService.getCongesByEmployeeId(employeeId));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<CongeResponseDTO>> getCongesByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(congeService.getCongesByStatut(statut));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CongeResponseDTO> getCongeById(@PathVariable Long id) {
        return ResponseEntity.ok(congeService.getCongeById(id));
    }

    @GetMapping
    public ResponseEntity<List<CongeResponseDTO>> getAllConges() {
        return ResponseEntity.ok(congeService.getAllConges());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerConge(@PathVariable Long id) {
        congeService.supprimerConge(id);
        return ResponseEntity.noContent().build();
    }
}
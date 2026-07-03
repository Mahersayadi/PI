package com.example.paie.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "fiches_paie")
public class FichePaie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "periode_paie")
    private LocalDate periodePaie;

    @Column(name = "salaire_base")
    private BigDecimal salaireBase;

    private BigDecimal primes = BigDecimal.ZERO;
    private BigDecimal deductions = BigDecimal.ZERO;

    @Column(name = "salaire_net")
    private BigDecimal salaireNet;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
        calculerSalaireNet();
    }

    private void calculerSalaireNet() {
        this.salaireNet = salaireBase.add(primes).subtract(deductions);
    }


}
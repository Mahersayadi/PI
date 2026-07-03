package com.example.paie.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "salaires")
public class Salaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false, unique = true)
    private Long employeeId;

    @Column(name = "salaire_base", nullable = false)
    private BigDecimal salaireBase;

    private BigDecimal primes = BigDecimal.ZERO;
    private BigDecimal deductions = BigDecimal.ZERO;

    @Column(name = "salaire_net")
    private BigDecimal salaireNet;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculerSalaireNet();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculerSalaireNet();
    }

    private void calculerSalaireNet() {
        this.salaireNet = salaireBase.add(primes).subtract(deductions);
    }

}
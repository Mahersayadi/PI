package com.example.paie.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FichePaieResponseDTO {
    private Long id;
    private Long employeeId;
    private LocalDate periodePaie;
    private BigDecimal salaireBase;
    private BigDecimal primes;
    private BigDecimal deductions;
    private BigDecimal salaireNet;


}
package com.example.paie.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FichePaieRequestDTO {
    private Long employeeId;
    private LocalDate periodePaie;
    private BigDecimal primes = BigDecimal.ZERO;
    private BigDecimal deductions = BigDecimal.ZERO;

}
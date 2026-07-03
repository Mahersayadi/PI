package com.example.paie.dto;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalaireDTO {
    private Long id;
    private Long employeeId;
    private BigDecimal salaireBase;
    private BigDecimal primes;
    private BigDecimal deductions;
    private BigDecimal salaireNet;
}
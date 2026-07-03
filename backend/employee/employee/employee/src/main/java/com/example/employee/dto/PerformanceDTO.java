package com.example.employee.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class PerformanceDTO {
    private Long id;
    private Long employeeId;
    private Integer score;
    private String comment;
    private String period;
    private com.example.employee.model.Performance.PerformanceLevel level;
    private Long evaluatedByUserId;
    private LocalDate evaluationDate;
    private LocalDateTime createdAt;
}

package com.example.employee.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "performances")
public class Performance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    private Integer score; // 0-100
    private String comment;
    private String period; // e.g. "2025-Q1"

    @Enumerated(EnumType.STRING)
    private PerformanceLevel level; // EXCELLENT, GOOD, AVERAGE, POOR

    @Column(name = "evaluated_by")
    private Long evaluatedByUserId;

    private LocalDate evaluationDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum PerformanceLevel {
        EXCELLENT,
        GOOD,
        AVERAGE,
        POOR
    }
}

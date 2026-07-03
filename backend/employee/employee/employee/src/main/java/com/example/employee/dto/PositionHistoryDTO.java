package com.example.employee.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PositionHistoryDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String previousPosition;
    private String newPosition;
    private String previousDepartmentName;
    private String newDepartmentName;
    private LocalDate changeDate;
    private String reason;
}
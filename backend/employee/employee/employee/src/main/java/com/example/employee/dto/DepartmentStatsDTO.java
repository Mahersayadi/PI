package com.example.employee.dto;

import lombok.Data;

@Data
public class DepartmentStatsDTO {
    private Long departmentId;
    private String departmentName;
    private Long employeeCount;
}
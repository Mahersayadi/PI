package com.example.employee.dto;

import lombok.Data;
import java.util.Map;

@Data
public class EmployeeStatsDTO {
    private Long totalEmployees;
    private Long totalDepartments;
    private Map<String, Long> employeesPerDepartment;
}
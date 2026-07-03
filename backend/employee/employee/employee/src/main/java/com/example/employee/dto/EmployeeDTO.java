package com.example.employee.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.example.employee.model.EmployeeStatus;

@Data
public class EmployeeDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String position;
    private Long departmentId;
    private String departmentName;
    private LocalDate hireDate;

    private BigDecimal baseSalary;
    private Long userId;
    private String phone;
    private String address;
    private com.example.employee.model.EmployeeStatus status;
    private String photoUrl;
    private boolean hasSalaryRecord;
}
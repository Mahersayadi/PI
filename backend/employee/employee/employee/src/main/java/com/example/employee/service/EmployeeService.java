package com.example.employee.service;

import com.example.employee.dto.*;
import org.springframework.data.domain.Page;
import java.util.List;

public interface EmployeeService {
    // Méthodes existantes
    List<EmployeeDTO> getAllEmployees();
    EmployeeDTO getEmployeeById(Long id);
    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);
    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);
    void deleteEmployee(Long id);
    List<EmployeeDTO> getEmployeesByDepartment(Long departmentId);
    List<EmployeeDTO> searchEmployeesByName(String name);
    EmployeeDTO updateEmployeePosition(Long employeeId, String newPosition, Long newDepartmentId);

    // NOUVELLES MÉTHODES
    Page<EmployeeDTO> getEmployeesPaged(int page, int size, String sortBy);
    List<PositionHistoryDTO> getEmployeePositionHistory(Long employeeId);
    EmployeeStatsDTO getEmployeeStats();
    DepartmentStatsDTO getDepartmentStats(Long departmentId);
    // ✅ AJOUTER cette méthode :
    EmployeeDTO getEmployeeWithSalaryDetails(Long id);
    // ✅ AJOUTER cette méthode :
    boolean existsById(Long id);

}
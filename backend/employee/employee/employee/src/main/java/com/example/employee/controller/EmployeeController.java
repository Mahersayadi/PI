package com.example.employee.controller;

import com.example.employee.dto.*;
import com.example.employee.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<EmployeeDTO>> getEmployeesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastName") String sortBy) {
        return ResponseEntity.ok(employeeService.getEmployeesPaged(page, size, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.createEmployee(employeeDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employeeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartment(departmentId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDTO>> searchEmployees(@RequestParam String name) {
        return ResponseEntity.ok(employeeService.searchEmployeesByName(name));
    }

    @PatchMapping("/{id}/position")
    public ResponseEntity<EmployeeDTO> updatePosition(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        String newPosition = (String) updates.get("newPosition");
        Long newDepartmentId = updates.get("newDepartmentId") != null ?
                Long.valueOf(updates.get("newDepartmentId").toString()) : null;

        return ResponseEntity.ok(employeeService.updateEmployeePosition(id, newPosition, newDepartmentId));
    }

    // NOUVELLES FONCTIONNALITÉS
    @GetMapping("/{id}/position-history")
    public ResponseEntity<List<PositionHistoryDTO>> getEmployeePositionHistory(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeePositionHistory(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<EmployeeStatsDTO> getEmployeeStats() {
        return ResponseEntity.ok(employeeService.getEmployeeStats());
    }

    @GetMapping("/department/{departmentId}/stats")
    public ResponseEntity<DepartmentStatsDTO> getDepartmentStats(@PathVariable Long departmentId) {
        return ResponseEntity.ok(employeeService.getDepartmentStats(departmentId));
    }

    // ✅ CORRIGER ces 2 endpoints :
    @GetMapping("/{id}/with-salary")
    public ResponseEntity<EmployeeDTO> getEmployeeWithSalaryDetails(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeWithSalaryDetails(id));
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkEmployeeExists(@PathVariable Long id) {
        // ✅ UTILISER LE SERVICE au lieu du Repository directement
        boolean exists = employeeService.existsById(id);
        return ResponseEntity.ok(exists);
    }



}
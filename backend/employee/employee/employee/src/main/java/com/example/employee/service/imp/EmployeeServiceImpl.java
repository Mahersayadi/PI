package com.example.employee.service.imp;

import com.example.employee.dto.*;
import com.example.employee.exception.ResourceNotFoundException;
import com.example.employee.feign.PaieServiceClient;
import com.example.employee.model.Department;
import com.example.employee.model.Employee;
import com.example.employee.model.PositionHistory;
import com.example.employee.repository.DepartmentRepository;
import com.example.employee.repository.EmployeeRepository;
import com.example.employee.repository.PositionHistoryRepository;
import com.example.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionHistoryRepository positionHistoryRepository;
    private final PaieServiceClient paieServiceClient;

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<EmployeeDTO> getEmployeesPaged(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return employeeRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return convertToDTO(employee);
    }

    @Override
    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        if (employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + employeeDTO.getEmail());
        }

        Employee employee = convertToEntity(employeeDTO);
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    @Override
    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (!existingEmployee.getEmail().equals(employeeDTO.getEmail()) &&
                employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + employeeDTO.getEmail());
        }

        updateEntityFromDTO(existingEmployee, employeeDTO);
        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        return convertToDTO(updatedEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Override
    public List<EmployeeDTO> getEmployeesByDepartment(Long departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Department not found with id: " + departmentId);
        }
        return employeeRepository.findByDepartmentId(departmentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDTO> searchEmployeesByName(String name) {
        return employeeRepository.findByNameContaining(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmployeeDTO updateEmployeePosition(Long employeeId, String newPosition, Long newDepartmentId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        // Sauvegarder l'historique
        savePositionHistory(employee, newPosition, newDepartmentId);

        // Mettre à jour l'employé
        employee.setPosition(newPosition);
        if (newDepartmentId != null) {
            Department newDepartment = departmentRepository.findById(newDepartmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            employee.setDepartment(newDepartment);
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToDTO(updatedEmployee);
    }

    @Override
    public List<PositionHistoryDTO> getEmployeePositionHistory(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        return positionHistoryRepository.findByEmployeeOrderByChangeDateDesc(employee).stream()
                .map(this::convertPositionHistoryToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeStatsDTO getEmployeeStats() {
        EmployeeStatsDTO stats = new EmployeeStatsDTO();
        stats.setTotalEmployees(employeeRepository.count());
        stats.setTotalDepartments(departmentRepository.count());

        // Statistiques par département
        List<Object[]> deptStats = employeeRepository.countEmployeesByDepartment();
        Map<String, Long> employeesPerDept = deptStats.stream()
                .collect(Collectors.toMap(
                        obj -> (String) obj[0],
                        obj -> (Long) obj[1]
                ));
        stats.setEmployeesPerDepartment(employeesPerDept);

        return stats;
    }

    @Override
    public DepartmentStatsDTO getDepartmentStats(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));

        DepartmentStatsDTO stats = new DepartmentStatsDTO();
        stats.setDepartmentId(departmentId);
        stats.setDepartmentName(department.getName());
        stats.setEmployeeCount(employeeRepository.countByDepartmentId(departmentId));

        return stats;
    }

    // METHODES PRIVEES
    private Employee convertToEntity(EmployeeDTO dto) {
        Employee employee = new Employee();
        updateEntityFromDTO(employee, dto);
        return employee;
    }

    private void updateEntityFromDTO(Employee employee, EmployeeDTO dto) {
        employee.setFirstName(dto.getFirstName());
employee.setLastName(dto.getLastName());
employee.setEmail(dto.getEmail());
employee.setPosition(dto.getPosition());
employee.setHireDate(dto.getHireDate());
employee.setBaseSalary(dto.getBaseSalary());
employee.setUserId(dto.getUserId());
employee.setPhone(dto.getPhone());
employee.setAddress(dto.getAddress());
employee.setStatus(dto.getStatus());
employee.setPhotoUrl(dto.getPhotoUrl());

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            employee.setDepartment(department);
        }
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPosition(employee.getPosition());
        dto.setHireDate(employee.getHireDate());
        // New fields
        dto.setBaseSalary(employee.getBaseSalary());
        dto.setUserId(employee.getUserId());
        dto.setPhone(employee.getPhone());
        dto.setAddress(employee.getAddress());
        dto.setStatus(employee.getStatus());
        dto.setPhotoUrl(employee.getPhotoUrl());
        // hasSalaryRecord is set by getEmployeeWithSalaryDetails
        if (employee.getDepartment() != null) {
            dto.setDepartmentId(employee.getDepartment().getId());
            dto.setDepartmentName(employee.getDepartment().getName());
        }
        return dto;
    }

    private PositionHistoryDTO convertPositionHistoryToDTO(PositionHistory history) {
        PositionHistoryDTO dto = new PositionHistoryDTO();
        dto.setId(history.getId());
        dto.setEmployeeId(history.getEmployee().getId());
        dto.setEmployeeName(history.getEmployee().getFirstName() + " " + history.getEmployee().getLastName());
        dto.setPreviousPosition(history.getPreviousPosition());
        dto.setNewPosition(history.getNewPosition());
        dto.setPreviousDepartmentName(history.getPreviousDepartment() != null ?
                history.getPreviousDepartment().getName() : "N/A");
        dto.setNewDepartmentName(history.getNewDepartment() != null ?
                history.getNewDepartment().getName() : "N/A");
        dto.setChangeDate(history.getChangeDate());
        dto.setReason(history.getReason());
        return dto;
    }

    private void savePositionHistory(Employee employee, String newPosition, Long newDepartmentId) {
        PositionHistory history = new PositionHistory();
        history.setEmployee(employee);
        history.setPreviousPosition(employee.getPosition());
        history.setNewPosition(newPosition);
        history.setPreviousDepartment(employee.getDepartment());
        history.setChangeDate(LocalDate.now());
        history.setReason("Changement de poste");

        if (newDepartmentId != null) {
            Department newDepartment = departmentRepository.findById(newDepartmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            history.setNewDepartment(newDepartment);
        }

        positionHistoryRepository.save(history);
    }

    // ✅ AJOUTER cette méthode :
    @Override
    public EmployeeDTO getEmployeeWithSalaryDetails(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        EmployeeDTO dto = convertToDTO(employee);

        // Appel au service Paie via Feign
        try {
            BigDecimal salaireBase = paieServiceClient.getSalaireBase(id);
            Boolean hasSalaryRecord = paieServiceClient.checkSalaireExists(id);

            dto.setBaseSalary(salaireBase);
            dto.setHasSalaryRecord(hasSalaryRecord);
        } catch (Exception e) {
            log.warn("Impossible de récupérer les données salariales pour l'employé {}: {}", id, e.getMessage());
            dto.setBaseSalary(BigDecimal.ZERO);
            dto.setHasSalaryRecord(false);
        }

        return dto;
    }

    @Override
    public boolean existsById(Long id) {
        return employeeRepository.existsById(id);
    }
}
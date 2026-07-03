package com.example.employee.service;

import com.example.employee.dto.PerformanceDTO;
import java.util.List;

public interface PerformanceService {
    PerformanceDTO createPerformance(PerformanceDTO dto);
    PerformanceDTO getPerformanceById(Long id);
    List<PerformanceDTO> getAllPerformances();
    List<PerformanceDTO> getPerformancesByEmployee(Long employeeId);
    PerformanceDTO updatePerformance(Long id, PerformanceDTO dto);
    void deletePerformance(Long id);
}

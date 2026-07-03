package com.example.employee.repository;

import com.example.employee.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    List<Performance> findByEmployeeIdOrderByEvaluationDateDesc(Long employeeId);
}

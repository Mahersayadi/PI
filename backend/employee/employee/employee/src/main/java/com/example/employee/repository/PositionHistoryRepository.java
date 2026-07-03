package com.example.employee.repository;

import com.example.employee.model.Employee;
import com.example.employee.model.PositionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PositionHistoryRepository extends JpaRepository<PositionHistory, Long> {
    List<PositionHistory> findByEmployeeId(Long employeeId);
    List<PositionHistory> findByEmployeeOrderByChangeDateDesc(Employee employee);
}
// DepartmentRepository.java
package com.example.employee.repository;

import com.example.employee.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByName(String name);
    boolean existsByName(String name);

    @Query("SELECT COUNT(e) FROM Department d JOIN d.employees e WHERE d.id = :departmentId")
    Long countEmployeesByDepartment(Long departmentId);
}
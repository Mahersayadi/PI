package com.example.paie.repository;

import com.example.paie.model.Salaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SalaireRepository extends JpaRepository<Salaire, Long> {
    Optional<Salaire> findByEmployeeId(Long employeeId);
    boolean existsByEmployeeId(Long employeeId);
}
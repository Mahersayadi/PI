package com.example.paie.repository;

import com.example.paie.model.FichePaie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FichePaieRepository extends JpaRepository<FichePaie, Long> {
    List<FichePaie> findByEmployeeIdOrderByPeriodePaieDesc(Long employeeId);
}
package com.example.recruitment.repository;

import com.example.recruitment.model.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByStatus(com.example.recruitment.model.JobStatus status);
    List<JobOffer> findByDepartmentId(Long departmentId);
}

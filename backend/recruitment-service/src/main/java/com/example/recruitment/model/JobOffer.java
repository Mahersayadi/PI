package com.example.recruitment.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "job_offers")
public class JobOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;
    private String contractType; // CDI, CDD, STAGE, FREELANCE

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills; // JSON array as string e.g. ["Java","Spring","SQL"]

    private Integer experienceYears;
    private String salaryRange; // e.g. "30000-40000 TND"

    @Enumerated(EnumType.STRING)
    private JobStatus status = JobStatus.OPEN;

    @Column(name = "created_by_user_id")
    private Long createdByUserId; // RH_MANAGER id

    @Column(name = "department_id")
    private Long departmentId;

    private LocalDate deadline; // application deadline
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

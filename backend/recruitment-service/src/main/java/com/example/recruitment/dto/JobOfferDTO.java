package com.example.recruitment.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * DTO for exposing job offer data via the API.
 */
@Data
public class JobOfferDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String contractType;
    private String requiredSkills;
    private Integer experienceYears;
    private String salaryRange;
    private String status; // JobStatus as String
    private Long createdByUserId;
    private Long departmentId;
    private LocalDate deadline;
    private String createdAt;
    private String updatedAt;
}

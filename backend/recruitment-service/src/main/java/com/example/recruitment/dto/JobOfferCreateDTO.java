package com.example.recruitment.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * DTO used when a client creates a new JobOffer.
 */
@Data
public class JobOfferCreateDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String location;
    private String contractType;
    private String requiredSkills;
    private Integer experienceYears;
    private String salaryRange;
    @NotNull
    private Long createdByUserId;
    @NotNull
    private Long departmentId;
    private LocalDate deadline;
}

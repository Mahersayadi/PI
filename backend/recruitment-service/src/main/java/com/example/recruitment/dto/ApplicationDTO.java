package com.example.recruitment.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for exposing application data via the API.
 */
@Data
public class ApplicationDTO {
    private Long id;
    private Long jobOfferId;
    private Long candidateUserId;
    private String candidateName;
    private String candidateEmail;
    private String cvFilePath;
    private String coverLetter;
    private String status; // ApplicationStatus as String
    private Integer aiScore;
    private String hrComment;
    private LocalDateTime interviewDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

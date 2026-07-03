package com.example.recruitment.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.example.recruitment.model.enums.ApplicationStatus;

@Data
@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_offer_id", nullable = false)
    private Long jobOfferId;

    @Column(name = "candidate_user_id", nullable = false)
    private Long candidateUserId;

    private String candidateName;
    private String candidateEmail;

    // Path to stored CV file
    @Column(name = "cv_file_path")
    private String cvFilePath;

    // Optional cover letter
    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    // AI score (0-100) computed by ai-service
    @Column(name = "ai_score")
    private Integer aiScore;

    // HR comment after review
    @Column(name = "hr_comment", columnDefinition = "TEXT")
    private String hrComment;

    // Interview date if scheduled
    @Column(name = "interview_date")
    private LocalDateTime interviewDate;

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

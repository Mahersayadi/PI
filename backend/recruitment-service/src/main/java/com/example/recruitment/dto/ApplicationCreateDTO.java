package com.example.recruitment.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;

/**
 * DTO used when a candidate creates a new Application (includes CV upload).
 */
@Data
public class ApplicationCreateDTO {
    @NotNull
    private Long jobOfferId;

    @NotNull
    private Long candidateUserId;

    @NotBlank
    private String candidateName;

    @NotBlank
    private String candidateEmail;

    // The CV file will be sent as multipart; not stored in the DTO directly.
    // In the controller we will receive a MultipartFile and pass the path to the service.
    private MultipartFile cvFile;

    private String coverLetter;
}

package com.example.recruitment.service.impl;

import com.example.recruitment.dto.ApplicationCreateDTO;
import com.example.recruitment.dto.ApplicationDTO;
import com.example.recruitment.model.Application;
import com.example.recruitment.model.enums.ApplicationStatus;
import com.example.recruitment.repository.ApplicationRepository;
import com.example.recruitment.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;

    @Override
    public ApplicationDTO createApplication(ApplicationCreateDTO dto, MultipartFile cvFile) {
        Application application = new Application();
        application.setJobOfferId(dto.getJobOfferId());
        application.setCandidateUserId(dto.getCandidateUserId());
        application.setCandidateName(dto.getCandidateName());
        application.setCandidateEmail(dto.getCandidateEmail());
        application.setCoverLetter(dto.getCoverLetter());

        Application saved = applicationRepository.save(application);

        try {
            String cvFilePath = saveCvFile(cvFile, saved.getId());
            saved.setCvFilePath(cvFilePath);
            saved = applicationRepository.save(saved);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement du CV", e);
        }

        return toDto(saved);
    }

    @Override
    public ApplicationDTO getApplication(Long id) {
        return applicationRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Override
    public List<ApplicationDTO> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationDTO updateApplication(Long id, ApplicationCreateDTO dto) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setJobOfferId(dto.getJobOfferId());
        application.setCandidateUserId(dto.getCandidateUserId());
        application.setCandidateName(dto.getCandidateName());
        application.setCandidateEmail(dto.getCandidateEmail());
        application.setCoverLetter(dto.getCoverLetter());

        return toDto(applicationRepository.save(application));
    }

    @Override
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }

    @Override
    public ApplicationDTO patchStatus(Long id, String status, String hrComment) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(ApplicationStatus.valueOf(status));
        if (hrComment != null) {
            application.setHrComment(hrComment);
        }
        return toDto(applicationRepository.save(application));
    }

    @Override
    public ApplicationDTO scheduleInterview(Long id, LocalDateTime interviewDate) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setInterviewDate(interviewDate);
        return toDto(applicationRepository.save(application));
    }

    @Override
    public List<ApplicationDTO> getByJobOffer(Long jobOfferId) {
        return applicationRepository.findByJobOfferId(jobOfferId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDTO> getByCandidate(Long candidateUserId) {
        return applicationRepository.findByCandidateUserId(candidateUserId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private String saveCvFile(MultipartFile file, Long applicationId) throws IOException {
        String uploadDir = "uploads/cv/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String filename = "cv_" + applicationId + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return uploadDir + filename;
    }

    private ApplicationDTO toDto(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(application.getId());
        dto.setJobOfferId(application.getJobOfferId());
        dto.setCandidateUserId(application.getCandidateUserId());
        dto.setCandidateName(application.getCandidateName());
        dto.setCandidateEmail(application.getCandidateEmail());
        dto.setCvFilePath(application.getCvFilePath());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setStatus(application.getStatus() != null ? application.getStatus().name() : null);
        dto.setAiScore(application.getAiScore());
        dto.setHrComment(application.getHrComment());
        dto.setInterviewDate(application.getInterviewDate());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        return dto;
    }
}

package com.example.recruitment.service;

import com.example.recruitment.dto.ApplicationDTO;
import com.example.recruitment.dto.ApplicationCreateDTO;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ApplicationService {
    ApplicationDTO createApplication(ApplicationCreateDTO dto, MultipartFile cvFile);
    ApplicationDTO getApplication(Long id);
    List<ApplicationDTO> getAllApplications();
    ApplicationDTO updateApplication(Long id, ApplicationCreateDTO dto);
    void deleteApplication(Long id);
    ApplicationDTO patchStatus(Long id, String status, String hrComment);
    ApplicationDTO scheduleInterview(Long id, java.time.LocalDateTime interviewDate);
    List<ApplicationDTO> getByJobOffer(Long jobOfferId);
    List<ApplicationDTO> getByCandidate(Long candidateUserId);
}

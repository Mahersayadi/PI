package com.example.recruitment.controller;

import com.example.recruitment.dto.ApplicationCreateDTO;
import com.example.recruitment.dto.ApplicationDTO;
import com.example.recruitment.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationDTO> applyForJob(
            @RequestParam("jobOfferId") Long jobOfferId,
            @RequestParam("candidateUserId") Long candidateUserId,
            @RequestParam("candidateName") String candidateName,
            @RequestParam("candidateEmail") String candidateEmail,
            @RequestParam(value = "coverLetter", required = false) String coverLetter,
            @RequestParam("cvFile") MultipartFile cvFile) {

        ApplicationCreateDTO dto = new ApplicationCreateDTO();
        dto.setJobOfferId(jobOfferId);
        dto.setCandidateUserId(candidateUserId);
        dto.setCandidateName(candidateName);
        dto.setCandidateEmail(candidateEmail);
        dto.setCoverLetter(coverLetter);

        return ResponseEntity.ok(applicationService.createApplication(dto, cvFile));
    }

    @GetMapping
    public ResponseEntity<List<ApplicationDTO>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplication(id));
    }

    @GetMapping("/job/{jobOfferId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJob(@PathVariable Long jobOfferId) {
        return ResponseEntity.ok(applicationService.getByJobOffer(jobOfferId));
    }

    @GetMapping("/candidate/{userId}")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getByCandidate(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationDTO> changeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        String status = (String) body.get("status");
        String hrComment = body.containsKey("hrComment") ? (String) body.get("hrComment") : null;
        return ResponseEntity.ok(applicationService.patchStatus(id, status, hrComment));
    }

    @PatchMapping("/{id}/interview")
    public ResponseEntity<ApplicationDTO> scheduleInterview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        LocalDateTime interviewDate = LocalDateTime.parse(body.get("interviewDate"));
        return ResponseEntity.ok(applicationService.scheduleInterview(id, interviewDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}

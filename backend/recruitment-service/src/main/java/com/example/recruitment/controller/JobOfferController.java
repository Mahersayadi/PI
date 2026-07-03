package com.example.recruitment.controller;

import com.example.recruitment.model.JobOffer;
import com.example.recruitment.model.JobStatus;
import com.example.recruitment.repository.JobOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobOfferController {

    private final JobOfferRepository jobOfferRepository;

    @PostMapping
    public ResponseEntity<JobOffer> createJob(@RequestBody JobOffer jobOffer) {
        return ResponseEntity.ok(jobOfferRepository.save(jobOffer));
    }

    @GetMapping
    public ResponseEntity<List<JobOffer>> getAllJobs() {
        return ResponseEntity.ok(jobOfferRepository.findByStatus(JobStatus.OPEN));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobOffer> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job offer not found")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobOffer> updateJob(@PathVariable Long id, @RequestBody JobOffer jobOffer) {
        JobOffer existing = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job offer not found"));
        jobOffer.setId(id);
        return ResponseEntity.ok(jobOfferRepository.save(jobOffer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobOfferRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobOffer> changeStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job offer not found"));
        jobOffer.setStatus(JobStatus.valueOf(body.get("status")));
        return ResponseEntity.ok(jobOfferRepository.save(jobOffer));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<JobOffer>> getJobsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(jobOfferRepository.findByDepartmentId(departmentId));
    }
}

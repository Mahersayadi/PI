package com.example.ai.controller;

import com.example.ai.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze-cv")
    public ResponseEntity<Map<String, Object>> analyzeCv(@RequestBody Map<String, String> body) {
        String cvText = body.getOrDefault("cvText", "");
        String jobDescription = body.getOrDefault("jobDescription", "");
        return ResponseEntity.ok(aiService.analyzeCv(cvText, jobDescription));
    }

    @PostMapping("/match-score")
    public ResponseEntity<Map<String, Object>> getMatchScore(@RequestBody Map<String, String> body) {
        String cvText = body.getOrDefault("cvText", "");
        String jobRequirements = body.getOrDefault("jobRequirements", "");
        return ResponseEntity.ok(aiService.getMatchScore(cvText, jobRequirements));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "");
        String context = body.getOrDefault("context", "");
        String reply = aiService.chat(message, context);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    @PostMapping("/generate-job")
    public ResponseEntity<Map<String, Object>> generateJob(@RequestBody Map<String, String> body) {
        String title = body.getOrDefault("title", "");
        return ResponseEntity.ok(aiService.generateJob(title));
    }
}

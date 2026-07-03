package com.example.recruitment.feign;

import com.example.recruitment.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "ai-service", configuration = FeignConfig.class)
public interface AiServiceClient {
    @PostMapping("/ai/analyze-cv")
    Map<String, Object> analyzeCv(@RequestBody Map<String, Object> payload);

    @PostMapping("/ai/match-score")
    Map<String, Object> getMatchScore(@RequestBody Map<String, Object> payload);
}

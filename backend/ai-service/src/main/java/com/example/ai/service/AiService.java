package com.example.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiService() {
        this.webClient = WebClient.create();
    }

    private String callOpenAi(String systemPrompt, String userMessage) {
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userMessage)
                ),
                "max_tokens", 1000
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> response = webClient.post()
                .uri(apiUrl + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null) {
            throw new RuntimeException("Réponse OpenAI vide");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("Réponse OpenAI invalide");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    private Map<String, Object> parseJsonResponse(String raw) {
        try {
            String json = raw.trim();
            if (json.startsWith("```")) {
                json = json.replaceAll("^```(?:json)?\\s*", "").replaceAll("\\s*```$", "").trim();
            }
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("raw", raw);
            return fallback;
        }
    }

    public Map<String, Object> analyzeCv(String cvText, String jobDescription) {
        String system = "Tu es un expert RH. Analyse ce CV et retourne UNIQUEMENT un JSON avec: "
                + "skills (liste de compétences), experience_years (nombre), education (niveau), "
                + "languages (langues parlées), summary (résumé en 2 phrases).";
        String result = callOpenAi(system, "CV: " + cvText + "\n\nOffre: " + jobDescription);
        return parseJsonResponse(result);
    }

    public Map<String, Object> getMatchScore(String cvText, String jobRequirements) {
        String system = "Tu es un expert RH. Calcule un score de compatibilité entre 0 et 100. "
                + "Retourne UNIQUEMENT un JSON avec: score (integer 0-100), "
                + "matching_skills (liste), missing_skills (liste), recommendation (string courte).";
        String result = callOpenAi(system, "CV: " + cvText + "\n\nExigences poste: " + jobRequirements);
        return parseJsonResponse(result);
    }

    public String chat(String userMessage, String context) {
        String system = "Tu es un assistant RH intelligent pour la plateforme SmartTalent. "
                + "Tu réponds aux questions sur les congés, les salaires, les procédures RH, "
                + "les offres d'emploi. Sois concis et professionnel. "
                + "Contexte utilisateur: " + (context != null ? context : "");
        return callOpenAi(system, userMessage);
    }

    public Map<String, Object> generateJob(String title) {
        String system = "Tu es un expert RH. Génère une description de poste professionnelle en français. "
                + "Retourne UNIQUEMENT un JSON avec: title, description, required_skills (liste), "
                + "experience_years (nombre), contract_type (CDI/CDD/STAGE), location.";
        String result = callOpenAi(system, "Titre du poste: " + title);
        return parseJsonResponse(result);
    }
}

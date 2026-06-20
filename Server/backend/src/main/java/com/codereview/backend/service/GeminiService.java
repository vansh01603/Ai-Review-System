package com.codereview.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper;

    private String callGroq(String prompt) {
        try {
            WebClient client = WebClient.create();

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.3-70b-versatile");
            body.put("messages", List.of(message));
            body.put("temperature", 0.3);

            String response = client.post()
                    .uri("https://api.groq.com/openai/v1/chat/completions")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            

            JsonNode root = objectMapper.readTree(response);
            return root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            
            return "Error calling Groq API: " + e.getMessage();
        }
    }

    public Map<String, Object> reviewCode(String code, String language) {
        Map<String, Object> result = new HashMap<>();

        String prompt = """
                You are an expert code reviewer. Review the following %s code and respond in EXACTLY this JSON format with no extra text, no markdown, no explanation:
                {
                  "qualityScore": <number 0-100>,
                  "bugDetection": "<detailed bug analysis>",
                  "bestPractices": "<best practices feedback>",
                  "refactoredCode": "<improved version of the code>",
                  "complexityAnalysis": "<time and space complexity in plain English>"
                }
                
                Code to review:
                %s
                """.formatted(language, code);

        try {
            String response = callGroq(prompt);

            

            String cleaned = response
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            JsonNode json = objectMapper.readTree(cleaned);
            result.put("qualityScore", json.path("qualityScore").asInt());
            result.put("bugDetection", json.path("bugDetection").asText());
            result.put("bestPractices", json.path("bestPractices").asText());
            result.put("refactoredCode", json.path("refactoredCode").asText());
            result.put("complexityAnalysis", json.path("complexityAnalysis").asText());
            result.put("success", true);

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Failed to parse AI response");
        }

        return result;
    }
}
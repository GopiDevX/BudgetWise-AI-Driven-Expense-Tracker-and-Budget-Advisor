package com.budgetwise.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class LLMService {

    @Value("${app.openai.api-key}")
    private String apiKey;

    @Value("${app.openai.model}")
    private String model;

    @Value("${app.openai.api-url}")
    private String apiUrl;

    private final RestClient restClient;

    public LLMService() {
        this.restClient = RestClient.create();
    }

    public String getChatResponse(String systemPrompt, String userMessage) {
        if (apiKey == null || apiKey.contains("REPLACE_WITH")) {
            return "Configuration Error: API Key is missing. Please set 'app.openai.api-key' in application.properties.";
        }

        try {
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userMessage)));

            Map<String, Object> response = (Map<String, Object>) restClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                    return (String) message.get("content");
                }
            }
            return "Error: No response from AI.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling AI Service: " + e.getMessage();
        }
    }
}

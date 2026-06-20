package com.codereview.backend.controller;

import com.codereview.backend.dto.ReviewRequest;
import com.codereview.backend.service.RateLimitService;
import com.codereview.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final RateLimitService rateLimitService;

   @PostMapping("/submit")
public ResponseEntity<Map<String, Object>> submitReview(
        @RequestBody ReviewRequest request,
        Authentication authentication) {

    String email = (String) authentication.getPrincipal();

    if (!rateLimitService.tryConsumeReview(email)) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Too many requests. Please wait a moment before submitting again.");
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
    }

    Map<String, Object> response = reviewService.reviewCode(request, email);
    return ResponseEntity.ok(response);
}
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory(
            Authentication authentication) {

        String email = (String) authentication.getPrincipal();
        Map<String, Object> response = reviewService.getHistory(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            Authentication authentication) {

        String email = (String) authentication.getPrincipal();
        Map<String, Object> response = reviewService.getStats(email);
        return ResponseEntity.ok(response);
    }
}
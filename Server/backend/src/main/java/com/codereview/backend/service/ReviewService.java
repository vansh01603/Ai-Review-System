package com.codereview.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.codereview.backend.dto.ReviewRequest;
import com.codereview.backend.model.Review;
import com.codereview.backend.repository.ReviewRepository;
import com.codereview.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    public Map<String, Object> reviewCode(ReviewRequest request, String email) {
        Map<String, Object> response = new HashMap<>();

        // Get user
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Call Gemini
        Map<String, Object> aiResult = geminiService.reviewCode(
                request.getCode(),
                request.getLanguage()
        );

        if (!(Boolean) aiResult.get("success")) {
            response.put("success", false);
            response.put("message", "AI review failed");
            return response;
        }

        // Save review to MongoDB
        Review review = new Review();
        review.setUserId(user.getId());
        review.setCode(request.getCode());
        review.setLanguage(request.getLanguage());
        review.setBugDetection((String) aiResult.get("bugDetection"));
        review.setQualityScore((Integer) aiResult.get("qualityScore"));
        review.setBestPractices((String) aiResult.get("bestPractices"));
        review.setRefactoredCode((String) aiResult.get("refactoredCode"));
        review.setComplexityAnalysis((String) aiResult.get("complexityAnalysis"));

        reviewRepository.save(review);

        // Build response
        response.put("success", true);
        response.put("reviewId", review.getId());
        response.put("qualityScore", review.getQualityScore());
        response.put("bugDetection", review.getBugDetection());
        response.put("bestPractices", review.getBestPractices());
        response.put("refactoredCode", review.getRefactoredCode());
        response.put("complexityAnalysis", review.getComplexityAnalysis());

        return response;
    }

    public Map<String, Object> getHistory(String email) {
        Map<String, Object> response = new HashMap<>();

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Review> reviews = reviewRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId());

        Long totalReviews = reviewRepository.countByUserId(user.getId());

        response.put("success", true);
        response.put("reviews", reviews);
        response.put("totalReviews", totalReviews);

        return response;
    }

    public Map<String, Object> getStats(String email) {
    Map<String, Object> response = new HashMap<>();

    var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<Review> allReviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

    long totalReviews = allReviews.size();

    double avgScore = allReviews.isEmpty() ? 0 :
            allReviews.stream().mapToInt(Review::getQualityScore).average().orElse(0);

    Map<String, Long> languageBreakdown = new HashMap<>();
    for (Review r : allReviews) {
        languageBreakdown.merge(r.getLanguage(), 1L, Long::sum);
    }

    List<Review> recentFive = reviewRepository.findTop5ByUserIdOrderByCreatedAtDesc(user.getId());
    List<Integer> recentScores = recentFive.stream()
            .map(Review::getQualityScore)
            .collect(java.util.stream.Collectors.toList());

    String lastReviewDate = allReviews.isEmpty() ? null :
            allReviews.get(0).getCreatedAt().toString();

    response.put("success", true);
    response.put("totalReviews", totalReviews);
    response.put("averageScore", Math.round(avgScore));
    response.put("languageBreakdown", languageBreakdown);
    response.put("recentScores", recentScores);
    response.put("lastReviewDate", lastReviewDate);

    return response;
}
}
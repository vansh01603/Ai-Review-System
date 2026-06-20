package com.codereview.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String userId;

    private String code;

    private String language;

    private String bugDetection;

    private Integer qualityScore;

    private String bestPractices;

    private String refactoredCode;

    private String complexityAnalysis;

    private LocalDateTime createdAt = LocalDateTime.now();
}
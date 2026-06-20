package com.codereview.backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private String code;
    private String language;
}
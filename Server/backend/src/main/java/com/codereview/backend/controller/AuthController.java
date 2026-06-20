package com.codereview.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codereview.backend.dto.LoginRequest;
import com.codereview.backend.dto.RegisterRequest;
import com.codereview.backend.service.AuthService;
import com.codereview.backend.service.RateLimitService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RateLimitService rateLimitService;

    @PostMapping("/register")
public ResponseEntity<Map<String, Object>> register(
        @RequestBody RegisterRequest request,
        HttpServletRequest httpRequest) {

    String ip = getClientIp(httpRequest);

    if (!rateLimitService.tryConsumeAuth(ip)) {
        return tooManyRequests();
    }

    Map<String, Object> response = authService.register(request);
    return ResponseEntity.ok(response);
}

@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(
        @RequestBody LoginRequest request,
        HttpServletRequest httpRequest) {

    String ip = getClientIp(httpRequest);

    if (!rateLimitService.tryConsumeAuth(ip)) {
        return tooManyRequests();
    }

    Map<String, Object> response = authService.login(request);
    return ResponseEntity.ok(response);
}

    private ResponseEntity<Map<String, Object>> tooManyRequests() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Too many attempts. Please wait a moment and try again.");
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
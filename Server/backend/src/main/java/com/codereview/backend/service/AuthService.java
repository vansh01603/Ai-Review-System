package com.codereview.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.codereview.backend.dto.LoginRequest;
import com.codereview.backend.dto.RegisterRequest;
import com.codereview.backend.model.User;
import com.codereview.backend.repository.UserRepository;
import com.codereview.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> register(RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return response;
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        response.put("success", true);
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        return response;
    }

    public Map<String, Object> login(LoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtUtil.generateToken(user.getEmail());

        response.put("success", true);
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        return response;
    }
}
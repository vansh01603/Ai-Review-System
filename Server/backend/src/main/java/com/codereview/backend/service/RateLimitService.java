package com.codereview.backend.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class RateLimitService {

    private final ConcurrentMap<String, CopyOnWriteArrayList<Instant>> reviewLog = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, CopyOnWriteArrayList<Instant>> authLog = new ConcurrentHashMap<>();

    // 3 requests per 2 hours for code review
    public boolean tryConsumeReview(String key) {
        return tryConsume(reviewLog, key, 3, 2 * 60 * 60);
    }

    // 5 requests per minute for login/register
    public boolean tryConsumeAuth(String key) {
        return tryConsume(authLog, key, 5, 60);
    }

    private boolean tryConsume(ConcurrentMap<String, CopyOnWriteArrayList<Instant>> log,
                                String key, int maxRequests, long windowSeconds) {

        Instant now = Instant.now();
        Instant windowStart = now.minusSeconds(windowSeconds);

        CopyOnWriteArrayList<Instant> timestamps =
                log.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>());

        // Remove timestamps outside the window
        timestamps.removeIf(t -> t.isBefore(windowStart));

        if (timestamps.size() >= maxRequests) {
            return false;
        }

        timestamps.add(now);
        return true;
    }
}
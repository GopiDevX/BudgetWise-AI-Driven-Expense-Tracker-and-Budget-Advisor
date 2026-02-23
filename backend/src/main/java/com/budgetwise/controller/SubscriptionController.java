package com.budgetwise.controller;

import com.budgetwise.dto.SubscriptionRequest;
import com.budgetwise.model.entity.User;
import com.budgetwise.service.SubscriptionService;
import com.budgetwise.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final JwtUtil jwtUtil;

    public SubscriptionController(SubscriptionService subscriptionService, JwtUtil jwtUtil) {
        this.subscriptionService = subscriptionService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/upgrade")
    public ResponseEntity<?> upgrade(@RequestHeader("Authorization") String token,
            @RequestBody SubscriptionRequest request) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                String email = JwtUtil.extractEmail(jwtToken);

                User updatedUser = subscriptionService.upgradeSubscription(email, request);

                // Generate a new token with updated claims (plan, etc.)
                String newToken = jwtUtil.generateToken(updatedUser);

                return ResponseEntity.ok(Map.of(
                        "message", "Subscription upgraded successfully",
                        "plan", updatedUser.getSubscriptionPlan(),
                        "token", newToken));
            }
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

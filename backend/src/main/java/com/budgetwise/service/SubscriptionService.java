package com.budgetwise.service;

import com.budgetwise.dto.SubscriptionRequest;
import com.budgetwise.model.entity.User;
import com.budgetwise.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class SubscriptionService {

    private final UserRepository userRepository;

    public SubscriptionService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User upgradeSubscription(String email, SubscriptionRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setSubscriptionPlan(request.getPlan().toUpperCase());
        user.setSubscriptionPeriod(request.getPeriod().toUpperCase());

        // Handle expiry date
        LocalDateTime expiry = LocalDateTime.now();
        if ("YEARLY".equalsIgnoreCase(request.getPeriod())) {
            expiry = expiry.plusYears(1);
        } else {
            expiry = expiry.plusMonths(1);
        }
        user.setSubscriptionExpiry(expiry);

        return userRepository.save(user);
    }
}

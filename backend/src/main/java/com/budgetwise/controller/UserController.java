package com.budgetwise.controller;

import com.budgetwise.model.dto.UserPreferencesDTO;
import com.budgetwise.model.entity.User;
import com.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/preferences")
    public ResponseEntity<UserPreferencesDTO> getPreferences(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserPreferencesDTO preferences = new UserPreferencesDTO(user.getPreferredCurrency());
        return ResponseEntity.ok(preferences);
    }

    @PutMapping("/preferences")
    public ResponseEntity<UserPreferencesDTO> updatePreferences(
            @RequestBody UserPreferencesDTO preferences,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPreferredCurrency(preferences.getPreferredCurrency());
        userRepository.save(user);

        return ResponseEntity.ok(preferences);
    }
}

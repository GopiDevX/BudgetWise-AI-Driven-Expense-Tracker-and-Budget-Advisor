package com.budgetwise.controller;

import com.budgetwise.dto.*;
import com.budgetwise.service.AuthService;
import com.budgetwise.model.entity.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, UserRepository userRepository,
            PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Use AuthService to handle authentication
            String result = authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

            if (result != null) {
                return ResponseEntity.ok(Map.of("token", result, "message", "Login successful"));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/signup/request-otp")
    public ResponseEntity<Map<String, String>> requestSignupOtp(@RequestBody OtpRequest request) {
        try {
            authService.requestSignupOtp(request);
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signup/verify-otp")
    public ResponseEntity<Map<String, String>> verifySignupOtp(@RequestBody SignupCompleteRequest request) {
        OtpVerification verification = new OtpVerification();
        verification.setEmail(request.getEmail());
        verification.setOtp(request.getOtp());

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(request.getEmail());
        signupRequest.setPassword(request.getPassword());
        signupRequest.setFirstName(request.getFirstName());
        signupRequest.setLastName(request.getLastName());
        signupRequest.setDepartment(request.getDepartment());
        signupRequest.setGender(request.getGender());

        String token = authService.verifySignupOtp(verification, signupRequest);
        return ResponseEntity.ok(Map.of("token", token, "message", "Registration successful"));
    }

    @PostMapping("/login/request-otp")
    public ResponseEntity<Map<String, String>> requestLoginOtp(@RequestBody OtpRequest request) {
        authService.requestLoginOtp(request);
        return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
    }

    @PostMapping("/login/verify-otp")
    public ResponseEntity<Map<String, String>> verifyLoginOtp(@RequestBody OtpVerification verification) {
        String token = authService.verifyLoginOtp(verification);
        return ResponseEntity.ok(Map.of("token", token, "message", "Login successful"));
    }

    @PostMapping("/forgot-password/request-otp")
    public ResponseEntity<Map<String, String>> requestForgotPasswordOtp(@RequestBody OtpRequest request) {
        authService.requestForgotPasswordOtp(request);
        return ResponseEntity.ok(Map.of("message", "Password reset OTP sent to your email"));
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<Map<String, String>> verifyForgotPasswordOtp(@RequestBody OtpVerification verification) {
        String token = authService.verifyForgotPasswordOtp(verification);
        return ResponseEntity.ok(Map.of("token", token, "message", "Password reset successful"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody PasswordReset passwordReset) {
        authService.resetPassword(passwordReset);
        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        try {
            return ResponseEntity.ok(
                    Map.of("status", "Backend is working!", "timestamp", String.valueOf(System.currentTimeMillis())));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, String>> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                if (authService.validateToken(jwtToken)) {
                    return ResponseEntity.ok(Map.of("message", "Token is valid"));
                }
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token validation failed"));
        }
    }

    @PostMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean exists = authService.emailExists(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}

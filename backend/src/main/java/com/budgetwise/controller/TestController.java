package com.budgetwise.controller;

import com.budgetwise.dto.OtpRequest;
import com.budgetwise.dto.SignupCompleteRequest;
import com.budgetwise.dto.SignupRequest;
import com.budgetwise.service.AuthService;
import com.budgetwise.util.OtpUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    private final AuthService authService;

    public TestController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/direct-signup")
    public ResponseEntity<Map<String, String>> directSignup(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            
            // Create signup request
            SignupRequest signupRequest = new SignupRequest();
            signupRequest.setEmail(email);
            signupRequest.setPassword(password);
            signupRequest.setFirstName(firstName);
            signupRequest.setLastName(lastName);
            signupRequest.setDepartment("TEST");
            signupRequest.setGender("OTHER");
            
            // Generate OTP directly
            String otp = OtpUtil.generateOtp();
            
            // Create OTP request
            OtpRequest otpRequest = new OtpRequest();
            otpRequest.setEmail(email);
            
            // Request OTP (this will store it in database)
            authService.requestSignupOtp(otpRequest);
            
            // Complete signup with the generated OTP
            SignupCompleteRequest completeRequest = new SignupCompleteRequest();
            completeRequest.setEmail(email);
            completeRequest.setPassword(password);
            completeRequest.setFirstName(firstName);
            completeRequest.setLastName(lastName);
            completeRequest.setDepartment("TEST");
            completeRequest.setGender("OTHER");
            completeRequest.setOtp(otp);
            
            com.budgetwise.dto.OtpVerification verification = new com.budgetwise.dto.OtpVerification();
            verification.setEmail(email);
            verification.setOtp(otp);
            
            String token = authService.verifySignupOtp(verification, signupRequest);
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Direct signup successful",
                "otp", otp, // Only for testing
                "email", email
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Direct signup failed: " + e.getMessage()
            ));
        }
    }
}

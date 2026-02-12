package com.budgetwise.service;

import com.budgetwise.dto.*;
import com.budgetwise.model.entity.OtpToken;
import com.budgetwise.model.entity.Role;
import com.budgetwise.model.entity.User;
import com.budgetwise.model.entity.UserRole;
import com.budgetwise.repository.OtpTokenRepository;
import com.budgetwise.repository.RoleRepository;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.repository.UserRoleRepository;
import com.budgetwise.util.JwtUtil;
import com.budgetwise.util.OtpUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
            UserRoleRepository userRoleRepository, OtpTokenRepository otpTokenRepository,
            EmailService emailService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.otpTokenRepository = otpTokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String loginUser(String email, String password) {
        try {
            // Find user by email
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // Verify password
                if (passwordEncoder.matches(password, user.getPassword())) {
                    // Generate JWT token
                    return jwtUtil.generateToken(user.getEmail());
                } else {
                    return null; // Invalid password
                }
            } else {
                return null; // User not found
            }
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while logging in", e);
        }
    }

    public void requestSignupOtp(OtpRequest request) {
        // Generate OTP using new OTP generator
        String otp = com.budgetwise.util.OtpGenerator.generateOtp();

        // Store OTP in database
        OtpToken otpToken = new OtpToken();
        otpToken.setEmail(request.getEmail());
        otpToken.setOtp(otp);
        otpToken.setPurpose(OtpToken.OtpPurpose.SIGNUP);
        otpToken.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpToken.setVerified(false);
        otpTokenRepository.save(otpToken);

        // Send OTP email asynchronously (returns immediately)
        emailService.sendOtpEmailAsync(request.getEmail(), otp, "SIGNUP");
    }

    public String verifySignupOtp(OtpVerification verification, SignupRequest signupRequest) {
        // Verify OTP
        OtpToken otpToken = verifyOtpToken(verification.getEmail(), verification.getOtp(), OtpToken.OtpPurpose.SIGNUP);

        // Mark OTP as verified
        otpToken.setVerified(true);
        otpTokenRepository.save(otpToken);

        // Create new user
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        // Assign USER role
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("USER role not found"));

        UserRole userRoleEntity = new UserRole();
        userRoleEntity.setUser(savedUser);
        userRoleEntity.setRole(userRole);

        userRoleRepository.save(userRoleEntity);

        // Generate JWT token
        return jwtUtil.generateToken(savedUser.getEmail());
    }

    public void requestLoginOtp(OtpRequest request) {
        String email = request.getEmail();

        // Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Clean up any existing unverified OTPs for this email and purpose
        otpTokenRepository.deleteByEmailAndPurpose(email, OtpToken.OtpPurpose.LOGIN);

        // Generate and save new OTP
        String otp = OtpUtil.generateOtp();
        OtpToken otpToken = new OtpToken();
        otpToken.setEmail(email);
        otpToken.setOtp(otp);
        otpToken.setExpiryTime(OtpUtil.calculateExpiryTime());
        otpToken.setPurpose(OtpToken.OtpPurpose.LOGIN);
        otpToken.setVerified(false);

        otpTokenRepository.save(otpToken);

        // Send OTP email asynchronously (returns immediately)
        emailService.sendOtpEmailAsync(email, otp, "LOGIN");
    }

    public String verifyLoginOtp(OtpVerification verification) {
        // Verify OTP
        OtpToken otpToken = verifyOtpToken(verification.getEmail(), verification.getOtp(), OtpToken.OtpPurpose.LOGIN);

        // Mark OTP as verified
        otpToken.setVerified(true);
        otpTokenRepository.save(otpToken);

        // Generate JWT token
        return jwtUtil.generateToken(verification.getEmail());
    }

    public void requestForgotPasswordOtp(OtpRequest request) {
        String email = request.getEmail();

        // Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Clean up any existing unverified OTPs for this email and purpose
        otpTokenRepository.deleteByEmailAndPurpose(email, OtpToken.OtpPurpose.RESET_PASSWORD);

        // Generate and save new OTP
        String otp = OtpUtil.generateOtp();
        OtpToken otpToken = new OtpToken();
        otpToken.setEmail(email);
        otpToken.setOtp(otp);
        otpToken.setExpiryTime(OtpUtil.calculateExpiryTime());
        otpToken.setPurpose(OtpToken.OtpPurpose.RESET_PASSWORD);
        otpToken.setVerified(false);

        otpTokenRepository.save(otpToken);

        // Send OTP email asynchronously (returns immediately)
        emailService.sendOtpEmailAsync(email, otp, "RESET_PASSWORD");
    }

    public String verifyForgotPasswordOtp(OtpVerification verification) {
        // Verify OTP
        OtpToken otpToken = verifyOtpToken(verification.getEmail(), verification.getOtp(),
                OtpToken.OtpPurpose.RESET_PASSWORD);

        // Mark OTP as verified
        otpToken.setVerified(true);
        otpTokenRepository.save(otpToken);

        // Return a temporary token for password reset
        return jwtUtil.generateToken(verification.getEmail());
    }

    public void resetPassword(PasswordReset passwordReset) {
        String email = passwordReset.getEmail();

        // Check if there's a verified OTP for password reset
        Optional<OtpToken> otpTokenOpt = otpTokenRepository.findByEmailAndPurposeAndVerifiedTrue(email,
                OtpToken.OtpPurpose.RESET_PASSWORD);
        if (otpTokenOpt.isEmpty()) {
            throw new RuntimeException("No valid password reset request found");
        }

        // Update user password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(passwordReset.getNewPassword()));
        userRepository.save(user);

        // Clean up OTP tokens for this user
        otpTokenRepository.deleteByEmailAndPurpose(email, OtpToken.OtpPurpose.RESET_PASSWORD);
    }

    private OtpToken verifyOtpToken(String email, String otp, OtpToken.OtpPurpose purpose) {
        Optional<OtpToken> otpTokenOpt = otpTokenRepository.findValidOtp(email, otp, purpose, LocalDateTime.now());

        if (otpTokenOpt.isEmpty()) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        return otpTokenOpt.get();
    }

    public boolean validateToken(String token) {
        try {
            String email = JwtUtil.extractEmail(token);
            if (email == null) {
                return false;
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return false;
            }

            return JwtUtil.validateToken(token, email);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}

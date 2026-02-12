package com.budgetwise.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.context.event.EventListener;
import org.springframework.context.annotation.Lazy;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.budgetwise.util.OtpGenerator;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // self reference to call async methods via proxy (avoid self-invocation issue)
    @Autowired
    @Lazy
    private EmailService self;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    public void sendOtpEmail(String to, String otp, String purpose) {
        String subject = getSubject(purpose);
        String htmlContent = buildOtpEmailHtml(otp, purpose);
        
        // Log OTP for debugging purposes
        System.out.println("==========================================");
        System.out.println("OTP EMAIL BEING SENT:");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("OTP: " + otp);
        System.out.println("Purpose: " + purpose);
        System.out.println("==========================================");
        
        // Send actual email
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom("BudgetWise <noreply@budgetwise.com>");
            
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send OTP email to " + to + ": " + e.getMessage());
            // Provide a friendly error message without exposing stack trace
            if (e.getMessage() != null && e.getMessage().contains("SocketTimeoutException")) {
                throw new RuntimeException("Mail server is temporarily slow. Please try again in a few moments.");
            }
            throw new RuntimeException("We're having trouble sending the OTP. Please check your internet and try again.");
        }
    }

    /**
     * Async variant to avoid blocking API during mail send.
     * Call via proxy (self) to ensure @Async takes effect.
     */
    @Async("taskExecutor")
    public void sendOtpEmailAsync(String to, String otp, String purpose) {
        sendOtpEmail(to, otp, purpose);
    }

    public void generateAndSendOtp(String to, String purpose) {
        String otp = OtpGenerator.generateOtp();
        // send asynchronously to avoid blocking callers
        try {
            self.sendOtpEmailAsync(to, otp, purpose);
        } catch (Exception e) {
            // fallback to synchronous send if async proxy isn't available
            sendOtpEmail(to, otp, purpose);
        }
    }

    /**
     * Send a lightweight test/warmup email at application startup to warm SMTP connection.
     * Uses async send so startup isn't significantly delayed.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void warmupSmtpAtStartup() {
        if (!mailEnabled) return;
        try {
            String admin = "" + (mailSender != null ? "" : "");
            // send a warmup email to configured username (if available)
            String to = System.getProperty("spring.mail.username");
            if (to == null || to.isBlank()) {
                // fall back to configured from-address
                to = "budgetwise.noreply@gmail.com";
            }
            String otp = "000000"; // dummy content for warmup
            // call async variant via proxy
            self.sendOtpEmailAsync(to, otp, "WARMUP");
            System.out.println("SMTP warmup triggered (async).");
        } catch (Exception e) {
            System.err.println("SMTP warmup failed: " + e.getMessage());
        }
    }

    private String getSubject(String purpose) {
        switch (purpose.toUpperCase()) {
            case "SIGNUP":
                return "BudgetWise - Verify Your Email for Registration";
            case "LOGIN":
                return "BudgetWise - Your Login OTP";
            case "RESET":
                return "BudgetWise - Password Reset Request";
            default:
                return "BudgetWise - Verification Code";
        }
    }

    private String buildOtpEmailHtml(String otp, String purpose) {
        String messageText = getDescription(purpose);
        
        return String.format("""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                <h2 style="color: #333;">%s</h2>
                <p style="font-size: 16px; color: #555;">%s</p>
                <div style="display: inline-block; margin: 20px 0; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #fff; background-color: #007bff; border-radius: 5px; letter-spacing: 3px;">%s</div>
                <p style="font-size: 14px; color: #777;">This code will expire in 5 minutes.</p>
                <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply.</p>
            </div>
            """, getTitle(purpose), messageText, otp);
    }

    private String getTitle(String purpose) {
        switch (purpose.toUpperCase()) {
            case "SIGNUP":
                return "BudgetWise - Verify Your Email for Registration";
            case "LOGIN":
                return "BudgetWise - Your Login OTP";
            case "RESET":
                return "BudgetWise - Password Reset Request";
            default:
                return "BudgetWise - Verification Code";
        }
    }

    private String getDescription(String purpose) {
        switch (purpose.toUpperCase()) {
            case "SIGNUP":
                return "Thank you for signing up with BudgetWise! Please use the verification code below to complete your registration.";
            case "LOGIN":
                return "Please use the verification code below to sign in to your BudgetWise account.";
            case "RESET":
                return "Please use the verification code below to reset your BudgetWise account password.";
            default:
                return "Please use the verification code below for your request.";
        }
    }
}

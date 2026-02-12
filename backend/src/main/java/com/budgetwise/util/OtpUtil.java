package com.budgetwise.util;

import java.security.SecureRandom;
import java.time.LocalDateTime;

public class OtpUtil {

    private static final SecureRandom random = new SecureRandom();
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 15;

    public static String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public static LocalDateTime calculateExpiryTime() {
        return LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
    }

    public static boolean isOtpExpired(LocalDateTime expiryTime) {
        return LocalDateTime.now().isAfter(expiryTime);
    }
}

package com.budgetwise.util;

import java.security.SecureRandom;
import java.util.Random;

public class OtpGenerator {
    
    private static final int OTP_LENGTH = 6;
    private static final String OTP_CHARS = "0123456789";
    
    public static String generateOtp() {
        StringBuilder otp = new StringBuilder(OTP_LENGTH);
        Random random = new SecureRandom();
        
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(OTP_CHARS.charAt(random.nextInt(OTP_CHARS.length())));
        }
        
        return otp.toString();
    }
    
    public static boolean validateOtp(String inputOtp, String storedOtp) {
        return inputOtp != null && inputOtp.equals(storedOtp);
    }
}

package com.budgetwise.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class OtpRequest {
    
    private String email;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

package com.budgetwise.model.dto;

public class UserPreferencesDTO {
    private String preferredCurrency;

    public UserPreferencesDTO() {
    }

    public UserPreferencesDTO(String preferredCurrency) {
        this.preferredCurrency = preferredCurrency;
    }

    public String getPreferredCurrency() {
        return preferredCurrency;
    }

    public void setPreferredCurrency(String preferredCurrency) {
        this.preferredCurrency = preferredCurrency;
    }
}

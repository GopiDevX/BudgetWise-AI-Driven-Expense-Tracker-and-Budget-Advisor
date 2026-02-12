package com.budgetwise.model.dto;

import java.math.BigDecimal;

public class AccountCreateDTO {
    private String accountName;
    private String accountType;
    private BigDecimal balance;
    private String currency;

    public AccountCreateDTO() {
    }

    public AccountCreateDTO(String accountName, String accountType, BigDecimal balance, String currency) {
        this.accountName = accountName;
        this.accountType = accountType;
        this.balance = balance;
        this.currency = currency;
    }

    // Getters and Setters
    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}

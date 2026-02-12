package com.budgetwise.model.dto;

import com.budgetwise.model.entity.Account;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountDTO {
    private Long id;
    private String accountName;
    private String accountType;
    private BigDecimal balance;
    private String currency;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AccountDTO() {
    }

    public AccountDTO(Account account) {
        this.id = account.getId();
        this.accountName = account.getAccountName();
        this.accountType = account.getAccountType().name();
        this.balance = account.getBalance();
        this.currency = account.getCurrency();
        this.isActive = account.getIsActive();
        this.createdAt = account.getCreatedAt();
        this.updatedAt = account.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

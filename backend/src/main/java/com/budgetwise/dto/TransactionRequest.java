package com.budgetwise.dto;

import com.budgetwise.model.entity.Transaction;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class TransactionRequest {

    private String description;
    private BigDecimal amount;
    private Transaction.TransactionType type;
    private Long categoryId;
    private String transactionDate; // Format: "YYYY-MM-DD"

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    @NotBlank(message = "Description is required")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    @NotNull(message = "Type is required")
    public Transaction.TransactionType getType() {
        return type;
    }

    public void setType(Transaction.TransactionType type) {
        this.type = type;
    }

    @NotNull(message = "Category ID is required")
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}

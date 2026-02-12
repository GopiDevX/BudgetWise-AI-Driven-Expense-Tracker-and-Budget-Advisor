package com.budgetwise.model.dto;

import java.math.BigDecimal;

public class AccountSummaryDTO {
    private BigDecimal totalAssets;
    private BigDecimal totalLiabilities;
    private BigDecimal netWorth;

    public AccountSummaryDTO() {
    }

    public AccountSummaryDTO(BigDecimal totalAssets, BigDecimal totalLiabilities, BigDecimal netWorth) {
        this.totalAssets = totalAssets;
        this.totalLiabilities = totalLiabilities;
        this.netWorth = netWorth;
    }

    // Getters and Setters
    public BigDecimal getTotalAssets() {
        return totalAssets;
    }

    public void setTotalAssets(BigDecimal totalAssets) {
        this.totalAssets = totalAssets;
    }

    public BigDecimal getTotalLiabilities() {
        return totalLiabilities;
    }

    public void setTotalLiabilities(BigDecimal totalLiabilities) {
        this.totalLiabilities = totalLiabilities;
    }

    public BigDecimal getNetWorth() {
        return netWorth;
    }

    public void setNetWorth(BigDecimal netWorth) {
        this.netWorth = netWorth;
    }
}

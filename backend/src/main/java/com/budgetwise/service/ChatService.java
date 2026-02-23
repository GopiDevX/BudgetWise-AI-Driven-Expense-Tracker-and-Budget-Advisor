package com.budgetwise.service;

import com.budgetwise.model.entity.Transaction;
import com.budgetwise.model.entity.User;
import com.budgetwise.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final TransactionService transactionService;
    private final BudgetService budgetService;
    private final UserRepository userRepository;
    private final LLMService llmService;

    public ChatService(TransactionService transactionService, BudgetService budgetService,
            UserRepository userRepository, LLMService llmService) {
        this.transactionService = transactionService;
        this.budgetService = budgetService;
        this.userRepository = userRepository;
        this.llmService = llmService;
    }

    public String processMessage(String message, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();

        // Route: financial query → rich Java visualization + AI suggestions
        // casual message → AI conversational reply
        if (isFinancialQuery(message)) {
            return buildSpendingVisualization(userId, email);
        }

        // Casual / general question — let AI answer naturally
        String financialContext = buildFinancialContext(userId, email);
        String systemPrompt = "You are BudgetWise AI, a friendly financial assistant. "
                + "Answer the user's question naturally and briefly (1-3 sentences). "
                + "Only use the financial data below if directly relevant.\n\n"
                + "User Financial Data:\n" + financialContext;

        String aiResponse = llmService.getChatResponse(systemPrompt, message);
        if (aiResponse.startsWith("Error") || aiResponse.contains("Configuration Error")) {
            return processMessageFallback(message, userId, email);
        }
        return aiResponse;
    }

    /** Returns true if the message is asking about finances / spending. */
    private boolean isFinancialQuery(String msg) {
        String m = msg.toLowerCase();
        return m.contains("spend") || m.contains("budget") || m.contains("income")
                || m.contains("expense") || m.contains("saving") || m.contains("analys")
                || m.contains("financ") || m.contains("money") || m.contains("balance")
                || m.contains("transaction") || m.contains("invest") || m.contains("summary")
                || m.contains("breakdown") || m.contains("report") || m.contains("how much")
                || m.contains("overview") || m.contains("spend") || m.contains("tip")
                || m.contains("suggestion") || m.contains("advice") || m.contains("₹")
                || m.contains("rs.") || m.contains("rupee");
    }

    /** Builds the full rich visualization card from real financial data. */
    private String buildSpendingVisualization(Long userId, String email) {
        BigDecimal income = transactionService.getTotalIncome(userId);
        BigDecimal expenses = transactionService.getTotalExpenses(userId);
        income = income != null ? income : BigDecimal.ZERO;
        expenses = expenses != null ? expenses : BigDecimal.ZERO;
        BigDecimal savings = income.subtract(expenses);

        double savingsRate = income.compareTo(BigDecimal.ZERO) > 0
                ? savings.divide(income, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;

        String healthEmoji, healthLabel;
        if (savingsRate >= 50) {
            healthEmoji = "\uD83D\uDFE2";
            healthLabel = "Excellent";
        } else if (savingsRate >= 20) {
            healthEmoji = "\uD83D\uDFE1";
            healthLabel = "Moderate";
        } else {
            healthEmoji = "\uD83D\uDD34";
            healthLabel = "At Risk";
        }

        NumberFormat nf = NumberFormat.getNumberInstance(new Locale("en", "IN"));
        nf.setMaximumFractionDigits(0);

        // Spending breakdown by category
        List<Transaction> txs = transactionService.getUserTransactions(userId);
        Map<String, BigDecimal> catSpend = new LinkedHashMap<>();
        for (Transaction tx : txs) {
            if ("EXPENSE".equalsIgnoreCase(tx.getType().name())) {
                String cat = tx.getCategory() != null ? tx.getCategory().getName() : tx.getDescription();
                catSpend.merge(cat, tx.getAmount(), BigDecimal::add);
            }
        }
        // Sort descending by amount
        List<Map.Entry<String, BigDecimal>> sorted = catSpend.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .collect(Collectors.toList());

        // Build response
        StringBuilder sb = new StringBuilder();
        sb.append("----------------------------------\n");
        sb.append(healthEmoji).append(" Financial Health: ").append(healthLabel).append("\n");
        sb.append("----------------------------------\n");
        sb.append("\n");
        sb.append("\uD83D\uDCB0 Income:   \u20B9").append(nf.format(income)).append("\n");
        sb.append("\uD83D\uDCB8 Expenses: \u20B9").append(nf.format(expenses)).append("\n");
        sb.append("\uD83D\uDCB5 Savings:  \u20B9").append(nf.format(savings))
                .append("  (").append(String.format("%.0f", savingsRate)).append("%)\n");

        if (!sorted.isEmpty()) {
            sb.append("\n");
            sb.append("\uD83D\uDCCA Spending Breakdown\n");
            int maxNameLen = sorted.stream().mapToInt(e -> e.getKey().length()).max().orElse(10);
            for (Map.Entry<String, BigDecimal> e : sorted) {
                double pct = expenses.compareTo(BigDecimal.ZERO) > 0
                        ? e.getValue().divide(expenses, 4, RoundingMode.HALF_UP).doubleValue() * 100
                        : 0;
                int bars = (int) Math.round(pct / 5.0); // each █ = 5%
                String bar = "\u2588".repeat(Math.max(1, bars));
                String name = String.format("%-" + maxNameLen + "s", e.getKey());
                sb.append(name).append("  ").append(bar)
                        .append(" ").append(String.format("%.0f", pct)).append("%\n");
            }
        }

        // Budget alerts
        List<Map<String, Object>> budgets = budgetService.getBudgetStatus(email);
        List<String> alerts = new ArrayList<>();
        for (Map<String, Object> b : budgets) {
            if ("over".equalsIgnoreCase(String.valueOf(b.get("status")))) {
                alerts.add(b.get("categoryName") + " budget exceeded");
            }
        }
        sb.append("\n");
        sb.append("\u26A0\uFE0F Alerts\n");
        if (alerts.isEmpty()) {
            sb.append("No budget alerts — you're on track!\n");
        } else {
            alerts.forEach(a -> sb.append("• ").append(a).append("\n"));
        }

        // AI suggestions (short, focused)
        String suggestionPrompt = "You are a concise financial advisor. Give exactly 3 short bullet suggestions "
                + "(starting with •) based on this data. No headers, no greetings, just 3 bullets:\n"
                + "Income: ₹" + nf.format(income) + ", Expenses: ₹" + nf.format(expenses)
                + ", Savings rate: " + String.format("%.0f", savingsRate) + "%\n"
                + "Top spending: "
                + (sorted.isEmpty() ? "none" : sorted.get(0).getKey() + " ₹" + nf.format(sorted.get(0).getValue()));

        sb.append("\n");
        sb.append("\uD83C\uDFAF AI Suggestions\n");
        try {
            String suggestions = llmService.getChatResponse(suggestionPrompt, "Give 3 bullet suggestions.");
            if (!suggestions.startsWith("Error")) {
                // Normalize bullets
                suggestions = suggestions.replaceAll("(?m)^[-*]\\s", "• ");
                sb.append(suggestions.trim()).append("\n");
            } else {
                sb.append("• Automate your savings each month\n");
                sb.append("• Review subscriptions for unused services\n");
                sb.append("• Build a 3-month emergency fund\n");
            }
        } catch (Exception e) {
            sb.append("• Automate your savings each month\n");
        }

        return sb.toString();
    }

    /** Builds a bar string: each █ block represents ~5% */
    @SuppressWarnings("unused")
    private String buildBar(double pct, int maxLen) {
        int filled = (int) Math.round(pct / 100.0 * maxLen);
        return "\u2588".repeat(filled) + "\u2591".repeat(maxLen - filled);
    }

    public String generateInsights(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();

        String financialContext = buildFinancialContext(userId, email);

        String systemPrompt = "You are an AI financial analyst. Analyze the user's financial data below and provide 4-6 short, actionable insights. "
                +
                "Return the response strictly as a valid JSON array of objects. Do not include markdown formatting. " +
                "Each object must have the following fields:\n" +
                "- type: One of ['Spending Alert', 'Savings Opportunity', 'Positive Trend', 'Investment Tip', 'Goal Progress', 'Smart Suggestion']\n"
                +
                "- title: A short, catchy title (max 5 words)\n" +
                "- description: A clear 1-2 sentence explanation\n" +
                "- sentiment: One of ['positive', 'negative', 'neutral'] (used for UI coloring)\n\n" +
                "User Data:\n" + financialContext;

        String response = llmService.getChatResponse(systemPrompt, "Generate financial insights JSON.");

        // Clean up markdown code blocks if present
        if (response.startsWith("```json")) {
            response = response.replace("```json", "").replace("```", "");
        } else if (response.startsWith("```")) {
            response = response.replace("```", "");
        }

        return response.trim();
    }

    private String buildFinancialContext(Long userId, String email) {
        BigDecimal income = transactionService.getTotalIncome(userId);
        BigDecimal expenses = transactionService.getTotalExpenses(userId);
        income = income != null ? income : BigDecimal.ZERO;
        expenses = expenses != null ? expenses : BigDecimal.ZERO;
        BigDecimal balance = income.subtract(expenses);

        StringBuilder sb = new StringBuilder();
        sb.append("- Total Income: ").append(income).append("\n");
        sb.append("- Total Expenses: ").append(expenses).append("\n");
        sb.append("- Current Balance: ").append(balance).append("\n");

        // Add Budgets
        List<Map<String, Object>> budgets = budgetService.getBudgetStatus(email);
        if (!budgets.isEmpty()) {
            sb.append("- Budgets:\n");
            for (Map<String, Object> b : budgets) {
                sb.append("  * ").append(b.get("categoryName")).append(": ")
                        .append(b.get("spent")).append("/").append(b.get("limitAmount"))
                        .append(" (Status: ").append(b.get("status")).append(")\n");
            }
        } else {
            sb.append("- Budgets: None set for this month.\n");
        }

        // Add Recent Transactions (last 5)
        List<Transaction> transactions = transactionService.getUserTransactions(userId);
        if (!transactions.isEmpty()) {
            sb.append("- Recent Transactions:\n");
            transactions.stream().limit(5).forEach(tx -> {
                sb.append("  * ").append(tx.getTransactionDate().toLocalDate()).append(": ")
                        .append(tx.getDescription()).append(" - ").append(tx.getAmount())
                        .append(" (").append(tx.getType()).append(")\n");
            });
        }

        return sb.toString();
    }

    // Original rule-based logic as fallback
    private String processMessageFallback(String message, Long userId, String email) {
        String lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.contains("balance")) {
            BigDecimal income = transactionService.getTotalIncome(userId);
            BigDecimal expenses = transactionService.getTotalExpenses(userId);
            income = income != null ? income : BigDecimal.ZERO;
            expenses = expenses != null ? expenses : BigDecimal.ZERO;
            return "Your current balance is " + income.subtract(expenses);
        }
        // ... (simplified fallback)
        return "I'm having trouble connecting to my brain right now. Please check your API key.";
    }

    /**
     * Inserts newlines before every recognised emoji marker so the frontend
     * can render structured sections even when the AI returns a flat response.
     * Java String.replace() handles Unicode/emoji correctly.
     */
    private String normalizeAiResponse(String response) {
        if (response == null)
            return "";

        String[] breakBefore = {
                "\uD83D\uDFE2", "\uD83D\uDFE1", "\uD83D\uDD34", // 🟢 🟡 🔴
                "\uD83E\uDDE0", // 🧠
                "\uD83D\uDCCA", // 📊
                "\u26A0\uFE0F", // ⚠️
                "\uD83C\uDFAF", // 🎯
                "\uD83D\uDCA1", // 💡
                "\uD83D\uDCCC", // 📌
                "\uD83D\uDD0D", // 🔍
                "\u2705", // ✅
                "\uD83D\uDCB0", // 💰
                "\uD83D\uDCB8", // 💸
                "\uD83D\uDCB3", // 💳
                "\uD83D\uDCBC", // 💼
                "\uD83D\uDCB9", // 💹
                "\uD83D\uDCC8", // 📈
                "\uD83D\uDCC9", // 📉
        };

        String result = response;
        for (String sym : breakBefore) {
            result = result.replace(sym, "\n" + sym);
        }
        result = result.replace(" \u2022", "\n\u2022"); // • → \n•
        result = result.replace("\t\u2022", "\n\u2022");
        result = result.replaceAll("[ \t]+\n", "\n"); // trailing spaces before \n
        result = result.replaceAll("\n{3,}", "\n\n"); // collapse 3+ blank lines to 2
        return result.trim();
    }
}

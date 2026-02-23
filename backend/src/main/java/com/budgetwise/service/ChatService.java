package com.budgetwise.service;

import com.budgetwise.model.entity.Transaction;
import com.budgetwise.model.entity.User;
import com.budgetwise.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
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

        // 1. Build Context
        String financialContext = buildFinancialContext(userId, email);

        // 2. Construct System Prompt
        String systemPrompt = "You are BudgetWise AI, a premium financial advisor chatbot.\n" +
                "You have access to the user's financial data below.\n" +
                "Answer based ONLY on this data. Be concise — keep responses under 15 lines.\n\n" +
                "STRICT FORMAT RULES:\n" +
                "1. Start EVERY response with a health status on its own line:\n" +
                "   🟢 Financial Health: Excellent   (savings rate > 50%)\n" +
                "   🟡 Financial Health: Moderate    (savings rate 20-50%)\n" +
                "   🔴 Financial Health: At Risk     (savings rate < 20%)\n\n" +
                "2. Use emoji section headers on their own line, e.g:\n" +
                "   🧠 Budget Summary\n" +
                "   📊 Where Your Money Went\n" +
                "   ⚠️ Things to Improve\n" +
                "   🎯 Smart Suggestions\n\n" +
                "3. Use key-value rows for numbers (emoji + label + colon + value):\n" +
                "   💰 Income: ₹100,000\n" +
                "   💸 Expenses: ₹2,750\n\n" +
                "4. Use bullet rows starting with • for lists:\n" +
                "   • 🛒 Groceries — ₹1,750\n\n" +
                "5. NEVER use ##, **, --, ---, *, or any markdown symbols.\n" +
                "6. Leave a blank line between sections.\n" +
                "7. Bold nothing — use emojis and position for emphasis instead.\n\n" +
                "User Financial Data:\n" + financialContext;

        // 3. Call LLM
        String aiResponse = llmService.getChatResponse(systemPrompt, message);

        // 4. Fallback if AI fails (e.g. invalid key)
        if (aiResponse.startsWith("Error") || aiResponse.contains("Configuration Error")) {
            return processMessageFallback(message, userId, email) + "\n\n(AI Request Failed: " + aiResponse + ")";
        }

        // 5. Ensure response is properly line-separated (AI often ignores newline
        // instructions)
        return normalizeAiResponse(aiResponse);
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

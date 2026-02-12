package com.budgetwise.service;

import com.budgetwise.dto.BudgetRequest;
import com.budgetwise.model.entity.Budget;
import com.budgetwise.model.entity.Category;
import com.budgetwise.model.entity.Transaction;
import com.budgetwise.model.entity.User;
import com.budgetwise.repository.BudgetRepository;
import com.budgetwise.repository.CategoryRepository;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, CategoryRepository categoryRepository,
            TransactionRepository transactionRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public List<Budget> getBudgetsForMonth(String email, Integer month, Integer year) {
        User user = getUserByEmail(email);
        return budgetRepository.findByUserAndMonthAndYear(user, month, year);
    }

    public Budget createOrUpdateBudget(String email, BudgetRequest request) {
        User user = getUserByEmail(email);
        Category category = null;

        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        // Check if budget already exists for this user/category/month/year
        Optional<Budget> existingBudget;
        if (category != null) {
            existingBudget = budgetRepository.findByUserAndCategoryAndMonthAndYear(
                    user, category, request.getMonth(), request.getYear());
        } else {
            existingBudget = budgetRepository.findByUserAndCategoryIsNullAndMonthAndYear(
                    user, request.getMonth(), request.getYear());
        }

        Budget budget;
        if (existingBudget.isPresent()) {
            budget = existingBudget.get();
            budget.setLimitAmount(request.getLimitAmount());
        } else {
            budget = new Budget();
            budget.setUser(user);
            budget.setCategory(category);
            budget.setLimitAmount(request.getLimitAmount());
            budget.setMonth(request.getMonth());
            budget.setYear(request.getYear());
        }

        return budgetRepository.save(budget);
    }

    public void deleteBudget(String email, Long budgetId) {
        User user = getUserByEmail(email);
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this budget");
        }

        budgetRepository.delete(budget);
    }

    /**
     * Returns budget status with spending amounts for the current month
     */
    public List<Map<String, Object>> getBudgetStatus(String email) {
        User user = getUserByEmail(email);
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(user, month, year);
        List<Transaction> transactions = transactionRepository.findByUser(user);

        // Filter transactions for current month expenses only
        List<Transaction> monthlyExpenses = transactions.stream()
                .filter(tx -> {
                    if (tx.getTransactionDate() == null)
                        return false;
                    LocalDate txDate = tx.getTransactionDate().toLocalDate();
                    return txDate.getMonthValue() == month &&
                            txDate.getYear() == year &&
                            "EXPENSE".equals(tx.getType().name());
                })
                .toList();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Budget budget : budgets) {
            Map<String, Object> status = new HashMap<>();
            status.put("id", budget.getId());
            status.put("limitAmount", budget.getLimitAmount());
            status.put("month", budget.getMonth());
            status.put("year", budget.getYear());

            BigDecimal spent;
            if (budget.getCategory() != null) {
                // Category-specific budget
                status.put("categoryId", budget.getCategory().getId());
                status.put("categoryName", budget.getCategory().getName());

                spent = monthlyExpenses.stream()
                        .filter(tx -> tx.getCategory() != null &&
                                tx.getCategory().getId().equals(budget.getCategory().getId()))
                        .map(Transaction::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            } else {
                // Total budget
                status.put("categoryId", null);
                status.put("categoryName", "Total");

                spent = monthlyExpenses.stream()
                        .map(Transaction::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }

            status.put("spent", spent);
            status.put("remaining", budget.getLimitAmount().subtract(spent));

            // Calculate percentage
            BigDecimal percentage = BigDecimal.ZERO;
            if (budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0) {
                percentage = spent.multiply(BigDecimal.valueOf(100))
                        .divide(budget.getLimitAmount(), 2, RoundingMode.HALF_UP);
            }
            status.put("percentage", percentage);

            // Status: under (green), warning (yellow > 80%), over (red > 100%)
            String statusLevel;
            if (percentage.compareTo(BigDecimal.valueOf(100)) > 0) {
                statusLevel = "over";
            } else if (percentage.compareTo(BigDecimal.valueOf(80)) >= 0) {
                statusLevel = "warning";
            } else {
                statusLevel = "under";
            }
            status.put("status", statusLevel);

            result.add(status);
        }

        return result;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

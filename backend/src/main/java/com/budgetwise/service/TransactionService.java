package com.budgetwise.service;

import com.budgetwise.dto.TransactionRequest;
import com.budgetwise.model.entity.Category;
import com.budgetwise.model.entity.Transaction;
import com.budgetwise.model.entity.User;
import com.budgetwise.repository.CategoryRepository;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository,
            CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Transaction> getUserTransactions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
    }

    public List<Transaction> getUserTransactionsByDateRange(Long userId, LocalDateTime startDate,
            LocalDateTime endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    public List<Transaction> getUserTransactionsByType(Long userId, Transaction.TransactionType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUserIdAndType(userId, type);
    }

    public Transaction createTransaction(Long userId, TransactionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Parse transaction date or use current time
        LocalDateTime transactionDate;
        if (request.getTransactionDate() != null && !request.getTransactionDate().isEmpty()) {
            LocalDate date = LocalDate.parse(request.getTransactionDate(), DateTimeFormatter.ISO_LOCAL_DATE);
            transactionDate = date.atStartOfDay();
        } else {
            transactionDate = LocalDateTime.now();
        }

        // Business Logic: Expenses cannot be added for future dates
        LocalDate today = LocalDate.now();
        LocalDate txDate = transactionDate.toLocalDate();

        if (request.getType() == Transaction.TransactionType.EXPENSE && txDate.isAfter(today)) {
            throw new RuntimeException("Expenses cannot be added for future dates");
        }

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setTransactionDate(transactionDate);

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long transactionId, TransactionRequest request, Long userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Verify ownership
        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Parse transaction date
        LocalDateTime transactionDate;
        if (request.getTransactionDate() != null && !request.getTransactionDate().isEmpty()) {
            LocalDate date = LocalDate.parse(request.getTransactionDate(), DateTimeFormatter.ISO_LOCAL_DATE);
            transactionDate = date.atStartOfDay();
        } else {
            transactionDate = transaction.getTransactionDate(); // Keep existing date if not provided
        }

        // Business Logic: Expenses cannot be added for future dates
        LocalDate today = LocalDate.now();
        LocalDate txDate = transactionDate.toLocalDate();

        if (request.getType() == Transaction.TransactionType.EXPENSE && txDate.isAfter(today)) {
            throw new RuntimeException("Expenses cannot be added for future dates");
        }

        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(category);
        transaction.setTransactionDate(transactionDate);

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long transactionId, Long userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Verify ownership
        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        transactionRepository.delete(transaction);
    }

    public BigDecimal getTotalExpenses(Long userId) {
        List<Transaction> expenses = getUserTransactionsByType(userId, Transaction.TransactionType.EXPENSE);
        return expenses.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalIncome(Long userId) {
        List<Transaction> incomes = getUserTransactionsByType(userId, Transaction.TransactionType.INCOME);
        return incomes.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

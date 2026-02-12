package com.budgetwise.controller;

import com.budgetwise.dto.TransactionRequest;
import com.budgetwise.model.entity.Transaction;
import com.budgetwise.service.TransactionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3002" })
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getUserTransactions(Authentication authentication) {
        Long userId = ((com.budgetwise.model.entity.User) authentication.getPrincipal()).getId();
        List<Transaction> transactions = transactionService.getUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Transaction>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication) {
        Long userId = ((com.budgetwise.model.entity.User) authentication.getPrincipal()).getId();
        List<Transaction> transactions = transactionService.getUserTransactionsByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(
            @PathVariable Transaction.TransactionType type,
            Authentication authentication) {
        Long userId = ((com.budgetwise.model.entity.User) authentication.getPrincipal()).getId();
        List<Transaction> transactions = transactionService.getUserTransactionsByType(userId, type);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getTransactionSummary(Authentication authentication) {
        Long userId = ((com.budgetwise.model.entity.User) authentication.getPrincipal()).getId();
        BigDecimal totalIncome = transactionService.getTotalIncome(userId);
        BigDecimal totalExpenses = transactionService.getTotalExpenses(userId);

        return ResponseEntity.ok(Map.of(
                "totalIncome", totalIncome,
                "totalExpenses", totalExpenses,
                "balance", totalIncome.subtract(totalExpenses)));
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody TransactionRequest request,
            Authentication authentication) {
        Long userId = ((com.budgetwise.model.entity.User) authentication.getPrincipal()).getId();
        Transaction transaction = transactionService.createTransaction(userId, request);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionRequest request,
            Authentication authentication) {
        Long userId = ((com.budgetwise.model.entity.User) authentication.getPrincipal()).getId();
        Transaction transaction = transactionService.updateTransaction(id, request, userId);
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = ((com.budgetwise.model.entity.User) authentication.getPrincipal()).getId();
        transactionService.deleteTransaction(id, userId);
        return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
    }
}

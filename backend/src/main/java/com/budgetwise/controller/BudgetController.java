package com.budgetwise.controller;

import com.budgetwise.dto.BudgetRequest;
import com.budgetwise.model.entity.Budget;
import com.budgetwise.service.BudgetService;
import com.budgetwise.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3002" })
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<?> getBudgets(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        try {
            String email = extractEmailFromToken(authHeader);
            List<Budget> budgets = budgetService.getBudgetsForMonth(email, month, year);
            return ResponseEntity.ok(budgets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getBudgetStatus(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmailFromToken(authHeader);
            List<Map<String, Object>> status = budgetService.getBudgetStatus(email);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateBudget(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody BudgetRequest request) {
        try {
            String email = extractEmailFromToken(authHeader);
            Budget budget = budgetService.createOrUpdateBudget(email, request);

            Map<String, Object> response = new HashMap<>();
            response.put("id", budget.getId());
            response.put("categoryId", budget.getCategory() != null ? budget.getCategory().getId() : null);
            response.put("categoryName", budget.getCategory() != null ? budget.getCategory().getName() : "Total");
            response.put("limitAmount", budget.getLimitAmount());
            response.put("month", budget.getMonth());
            response.put("year", budget.getYear());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            String email = extractEmailFromToken(authHeader);
            budgetService.deleteBudget(email, id);
            return ResponseEntity.ok(Map.of("message", "Budget deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private String extractEmailFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        String token = authHeader.substring(7);
        return JwtUtil.extractEmail(token);
    }
}

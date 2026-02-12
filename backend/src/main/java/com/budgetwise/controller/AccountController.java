package com.budgetwise.controller;

import com.budgetwise.model.dto.AccountCreateDTO;
import com.budgetwise.model.dto.AccountDTO;
import com.budgetwise.model.dto.AccountSummaryDTO;
import com.budgetwise.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAccounts(Authentication authentication) {
        String email = authentication.getName();
        List<AccountDTO> accounts = accountService.getUserAccounts(email);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(
            @RequestBody AccountCreateDTO createDTO,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            AccountDTO account = accountService.createAccount(email, createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(account);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> updateAccount(
            @PathVariable Long id,
            @RequestBody AccountCreateDTO updateDTO,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            AccountDTO account = accountService.updateAccount(email, id, updateDTO);
            return ResponseEntity.ok(account);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            accountService.deleteAccount(email, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<AccountSummaryDTO> getAccountSummary(Authentication authentication) {
        String email = authentication.getName();
        AccountSummaryDTO summary = accountService.getAccountSummary(email);
        return ResponseEntity.ok(summary);
    }
}

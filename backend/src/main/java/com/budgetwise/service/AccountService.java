package com.budgetwise.service;

import com.budgetwise.model.dto.AccountCreateDTO;
import com.budgetwise.model.dto.AccountDTO;
import com.budgetwise.model.dto.AccountSummaryDTO;
import com.budgetwise.model.entity.Account;
import com.budgetwise.model.entity.User;
import com.budgetwise.repository.AccountRepository;
import com.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AccountDTO> getUserAccounts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUserIdAndIsActive(user.getId(), true)
                .stream()
                .map(AccountDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public AccountDTO createAccount(String userEmail, AccountCreateDTO createDTO) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate account data
        validateAccountData(createDTO);

        Account account = new Account();
        account.setUser(user);
        account.setAccountName(createDTO.getAccountName());
        account.setAccountType(Account.AccountType.valueOf(createDTO.getAccountType().toUpperCase()));
        account.setBalance(createDTO.getBalance() != null ? createDTO.getBalance() : BigDecimal.ZERO);
        account.setCurrency(createDTO.getCurrency() != null ? createDTO.getCurrency() : "INR");

        Account savedAccount = accountRepository.save(account);
        return new AccountDTO(savedAccount);
    }

    @Transactional
    public AccountDTO updateAccount(String userEmail, Long accountId, AccountCreateDTO updateDTO) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Verify account belongs to user
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to account");
        }

        // Validate account data
        validateAccountData(updateDTO);

        account.setAccountName(updateDTO.getAccountName());
        account.setAccountType(Account.AccountType.valueOf(updateDTO.getAccountType().toUpperCase()));
        account.setBalance(updateDTO.getBalance() != null ? updateDTO.getBalance() : BigDecimal.ZERO);
        account.setCurrency(updateDTO.getCurrency() != null ? updateDTO.getCurrency() : account.getCurrency());

        Account updatedAccount = accountRepository.save(account);
        return new AccountDTO(updatedAccount);
    }

    @Transactional
    public void deleteAccount(String userEmail, Long accountId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Verify account belongs to user
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to account");
        }

        // Soft delete
        account.setIsActive(false);
        accountRepository.save(account);
    }

    @Transactional(readOnly = true)
    public AccountSummaryDTO getAccountSummary(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Account> accounts = accountRepository.findByUserIdAndIsActive(user.getId(), true);

        BigDecimal totalAssets = BigDecimal.ZERO;
        BigDecimal totalLiabilities = BigDecimal.ZERO;

        for (Account account : accounts) {
            BigDecimal balance = account.getBalance();

            // Credit accounts are liabilities (negative balance means debt)
            if (account.getAccountType() == Account.AccountType.CREDIT) {
                totalLiabilities = totalLiabilities.add(balance.abs());
            } else {
                // Savings, Current, Cash, Debit are assets
                totalAssets = totalAssets.add(balance);
            }
        }

        BigDecimal netWorth = totalAssets.subtract(totalLiabilities);

        return new AccountSummaryDTO(totalAssets, totalLiabilities, netWorth);
    }

    private void validateAccountData(AccountCreateDTO dto) {
        if (dto.getAccountName() == null || dto.getAccountName().trim().isEmpty()) {
            throw new IllegalArgumentException("Account name is required");
        }

        if (dto.getAccountType() == null || dto.getAccountType().trim().isEmpty()) {
            throw new IllegalArgumentException("Account type is required");
        }

        try {
            Account.AccountType.valueOf(dto.getAccountType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid account type. Must be one of: SAVINGS, CURRENT, CASH, CREDIT, DEBIT");
        }

        if (dto.getBalance() != null && dto.getBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }
    }
}

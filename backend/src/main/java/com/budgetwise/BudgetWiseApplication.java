package com.budgetwise;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BudgetWiseApplication {

    public static void main(String[] args) {
        // Load .env BEFORE Spring resolves ${...} placeholders
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
        } catch (Exception ignored) {
        }

        SpringApplication.run(BudgetWiseApplication.class, args);
    }
}

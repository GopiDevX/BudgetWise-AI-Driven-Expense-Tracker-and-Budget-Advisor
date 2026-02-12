package com.budgetwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BudgetWiseApplication {

    public static void main(String[] args) {
        SpringApplication.run(BudgetWiseApplication.class, args);
    }
}

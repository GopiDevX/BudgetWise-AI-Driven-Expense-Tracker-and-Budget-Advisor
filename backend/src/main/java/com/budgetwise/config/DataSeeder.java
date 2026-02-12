package com.budgetwise.config;

import com.budgetwise.model.entity.Category;
import com.budgetwise.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public DataSeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (categoryRepository.findByName("Food").isEmpty()) {
            seedCategories();
        } else {
            System.out.println("Categories already seeded.");
        }
    }

    private void seedCategories() {
        List<Category> categories = Arrays.asList(
                createCategory("Food", "#FF6B6B"),
                createCategory("Shopping", "#4ECDC4"),
                createCategory("Transportation", "#45B7D1"),
                createCategory("Housing", "#96CEB4"),
                createCategory("Entertainment", "#FFEEAD"),
                createCategory("Healthcare", "#D4A5A5"),
                createCategory("Education", "#9B59B6"),
                createCategory("Salary", "#2ECC71"),
                createCategory("Other Income", "#3498DB"),
                createCategory("Other Expense", "#95A5A6"));

        categoryRepository.saveAll(categories);
        System.out.println("Default categories seeded successfully.");
    }

    private Category createCategory(String name, String color) {
        Category category = new Category();
        category.setName(name);
        category.setColor(color);
        return category;
    }
}

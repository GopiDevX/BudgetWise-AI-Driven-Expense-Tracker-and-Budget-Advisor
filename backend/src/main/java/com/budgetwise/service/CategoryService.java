package com.budgetwise.service;

import com.budgetwise.dto.CategoryRequest;
import com.budgetwise.model.entity.Category;
import com.budgetwise.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> searchCategories(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name);
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category createCategory(CategoryRequest request) {
        // Check if category already exists
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Category with this name already exists");
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setColor(request.getColor() != null ? request.getColor() : "#2563eb");

        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryById(id);

        // Check if another category with the same name exists
        Optional<Category> existingCategory = categoryRepository.findByName(request.getName());
        if (existingCategory.isPresent() && !existingCategory.get().getId().equals(id)) {
            throw new RuntimeException("Category with this name already exists");
        }

        category.setName(request.getName());
        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}

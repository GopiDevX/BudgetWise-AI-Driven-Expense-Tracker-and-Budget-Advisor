package com.budgetwise.controller;

import com.budgetwise.dto.CategoryRequest;
import com.budgetwise.model.entity.Category;
import com.budgetwise.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3002" })
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Category>> searchCategories(@RequestParam String name) {
        List<Category> categories = categoryService.searchCategories(name);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CategoryRequest request) {
        Category category = categoryService.createCategory(request);
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request) {
        Category category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
    }
}

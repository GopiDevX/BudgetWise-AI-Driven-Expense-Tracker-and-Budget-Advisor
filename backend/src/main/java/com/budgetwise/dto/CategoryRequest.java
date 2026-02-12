package com.budgetwise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CategoryRequest {
    
    private String name;
    private String color;

    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Category name must contain only letters and spaces")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @NotBlank(message = "Color is required")
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Color must be a valid hex color code")
    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}

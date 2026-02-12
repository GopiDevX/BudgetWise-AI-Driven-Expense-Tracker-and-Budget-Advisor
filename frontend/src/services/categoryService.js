// Category API service for BudgetWise
import authService from './authService';

const API_BASE_URL = 'http://localhost:8081/api/categories';

class CategoryService {
    // Get auth headers
    getHeaders() {
        const token = authService.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Get all categories
    async getCategories() {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to fetch categories');
            }

            return await response.json();
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    }

    // Create a new category
    async createCategory(categoryData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to create category');
            }

            return await response.json();
        } catch (error) {
            console.error('Create category error:', error);
            throw error;
        }
    }

    // Get default/fallback categories (for when API fails)
    getDefaultCategories() {
        return [
            { id: 1, name: 'Food' },
            { id: 2, name: 'Shopping' },
            { id: 3, name: 'Transportation' },
            { id: 4, name: 'Housing' },
            { id: 5, name: 'Entertainment' },
            { id: 6, name: 'Healthcare' },
            { id: 7, name: 'Education' },
            { id: 8, name: 'Salary' },
            { id: 9, name: 'Other Income' },
            { id: 10, name: 'Other Expense' }
        ];
    }
}

const categoryService = new CategoryService();
export default categoryService;

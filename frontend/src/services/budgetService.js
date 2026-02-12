import authService from './authService';

const API_BASE_URL = 'http://localhost:8081/api/budgets';

const budgetService = {
    /**
     * Get budget status for current month (with spending amounts)
     */
    async getBudgetStatus() {
        const token = authService.getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/status`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch budget status');
        }

        return response.json();
    },

    /**
     * Get budgets for a specific month/year
     */
    async getBudgets(month, year) {
        const token = authService.getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}?month=${month}&year=${year}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch budgets');
        }

        return response.json();
    },

    /**
     * Create or update a budget
     */
    async saveBudget(budgetData) {
        const token = authService.getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(budgetData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save budget');
        }

        return response.json();
    },

    /**
     * Delete a budget
     */
    async deleteBudget(budgetId) {
        const token = authService.getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/${budgetId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete budget');
        }

        return response.json();
    },

    /**
     * Get status color based on percentage
     */
    getStatusColor(status) {
        switch (status) {
            case 'over':
                return '#ef4444'; // red
            case 'warning':
                return '#f59e0b'; // yellow
            default:
                return '#10b981'; // green
        }
    },

    /**
     * Get status icon based on percentage
     */
    getStatusIcon(status) {
        switch (status) {
            case 'over':
                return '🔴';
            case 'warning':
                return '⚠️';
            default:
                return '✅';
        }
    }
};

export default budgetService;

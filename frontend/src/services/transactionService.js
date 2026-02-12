// Transaction API service for BudgetWise
import authService from './authService';

const API_BASE_URL = 'http://localhost:8081/api/transactions';

class TransactionService {
    // Get auth headers
    getHeaders() {
        const token = authService.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Transform backend transaction to frontend format
    transformFromBackend(tx) {
        return {
            id: tx.id.toString(),
            description: tx.description,
            amount: tx.type === 'EXPENSE' ? -Math.abs(tx.amount) : Math.abs(tx.amount),
            type: tx.type.toLowerCase(),
            category: tx.category?.name || 'Other',
            categoryId: tx.category?.id,
            date: tx.transactionDate ? tx.transactionDate.split('T')[0] : new Date().toISOString().split('T')[0]
        };
    }

    // Transform frontend transaction to backend format
    transformToBackend(tx) {
        return {
            description: tx.description,
            amount: Math.abs(parseFloat(tx.amount)),
            type: tx.type.toUpperCase(),
            categoryId: tx.categoryId,
            transactionDate: tx.date || new Date().toISOString().split('T')[0]
        };
    }

    // Get all transactions for current user
    async getTransactions() {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: this.getHeaders(),
                cache: 'no-store'
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to fetch transactions');
            }

            const transactions = await response.json();
            return transactions.map(tx => this.transformFromBackend(tx));
        } catch (error) {
            console.error('Get transactions error:', error);
            throw error;
        }
    }

    // Create a new transaction
    async createTransaction(transactionData) {
        try {
            const backendData = this.transformToBackend(transactionData);

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(backendData)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to create transaction');
            }

            const transaction = await response.json();
            return this.transformFromBackend(transaction);
        } catch (error) {
            console.error('Create transaction error:', error);
            throw error;
        }
    }

    // Update an existing transaction
    async updateTransaction(id, transactionData) {
        try {
            const backendData = this.transformToBackend(transactionData);

            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(backendData)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to update transaction');
            }

            const transaction = await response.json();
            return this.transformFromBackend(transaction);
        } catch (error) {
            console.error('Update transaction error:', error);
            throw error;
        }
    }

    // Delete a transaction
    async deleteTransaction(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to delete transaction');
            }

            return await response.json();
        } catch (error) {
            console.error('Delete transaction error:', error);
            throw error;
        }
    }

    // Get transaction summary (totals)
    async getSummary() {
        try {
            const response = await fetch(`${API_BASE_URL}/summary`, {
                method: 'GET',
                headers: this.getHeaders(),
                cache: 'no-store'
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to fetch summary');
            }

            return await response.json();
        } catch (error) {
            console.error('Get summary error:', error);
            throw error;
        }
    }

    // Get transactions by date range
    async getTransactionsByDateRange(startDate, endDate) {
        try {
            const params = new URLSearchParams({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });

            const response = await fetch(`${API_BASE_URL}/date-range?${params}`, {
                method: 'GET',
                headers: this.getHeaders(),
                cache: 'no-store'
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to fetch transactions');
            }

            const transactions = await response.json();
            return transactions.map(tx => this.transformFromBackend(tx));
        } catch (error) {
            console.error('Get transactions by date range error:', error);
            throw error;
        }
    }
}

const transactionService = new TransactionService();
export default transactionService;

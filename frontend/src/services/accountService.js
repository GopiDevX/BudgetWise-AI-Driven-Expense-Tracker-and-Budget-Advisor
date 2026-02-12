const API_BASE_URL = 'http://localhost:8081/api/accounts';

class AccountService {
    getAuthHeaders() {
        const token = localStorage.getItem('budgetwise_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    async getAccounts() {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch accounts');
            }

            return await response.json();
        } catch (error) {
            console.error('Get accounts error:', error);
            throw error;
        }
    }

    async createAccount(accountData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(accountData)
            });

            if (!response.ok) {
                throw new Error('Failed to create account');
            }

            return await response.json();
        } catch (error) {
            console.error('Create account error:', error);
            throw error;
        }
    }

    async updateAccount(id, accountData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(accountData)
            });

            if (!response.ok) {
                throw new Error('Failed to update account');
            }

            return await response.json();
        } catch (error) {
            console.error('Update account error:', error);
            throw error;
        }
    }

    async deleteAccount(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            return true;
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    }

    async getAccountSummary() {
        try {
            const response = await fetch(`${API_BASE_URL}/summary`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch account summary');
            }

            return await response.json();
        } catch (error) {
            console.error('Get account summary error:', error);
            throw error;
        }
    }
}

const accountService = new AccountService();

export default accountService;

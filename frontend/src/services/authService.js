// Real API service for authentication with OTP
const API_BASE_URL = 'http://localhost:8081/api/auth';

class AuthService {

  // Request OTP for signup
  async requestSignupOtp(email) {
    try {
      console.log('Sending OTP request to:', `${API_BASE_URL}/signup/request-otp`);
      console.log('Request data:', { email });

      const response = await fetch(`${API_BASE_URL}/signup/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            throw new Error(errorJson.error);
          }
        } catch (e) {
          // ignore json parse error
        }
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Failed to send OTP');
      }

      const result = await response.json();
      console.log('Success response:', result);
      return result;
    } catch (error) {
      console.error('Request signup OTP error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  // Complete signup with OTP
  async completeSignup(signupData) {
    try {
      console.log('Completing signup with data:', signupData);
      console.log('Sending to:', `${API_BASE_URL}/signup/verify-otp`);

      const response = await fetch(`${API_BASE_URL}/signup/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      console.log('Complete signup response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Complete signup error response:', errorText);
        throw new Error(errorText || 'Signup failed');
      }

      const result = await response.json();
      console.log('Complete signup success:', result);

      // Store token and user data
      localStorage.setItem('budgetwise_token', result.token);

      // Extract user info from JWT token (simple decode)
      const user = this.decodeJWT(result.token);
      localStorage.setItem('budgetwise_user', JSON.stringify(user));

      return result;
    } catch (error) {
      console.error('Complete signup error:', error);
      console.error('Complete signup error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  // Request OTP for login
  async requestLoginOtp(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to send OTP');
      }

      return await response.json();
    } catch (error) {
      console.error('Request login OTP error:', error);
      throw error;
    }
  }

  // Verify user credentials (password) and return login response
  async loginUser(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
      }

      const result = await response.json();

      // Store token and user data
      localStorage.setItem('budgetwise_token', result.token);

      // Extract user info from JWT token
      const user = this.decodeJWT(result.token);
      localStorage.setItem('budgetwise_user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Login user error:', error);
      throw error;
    }
  }

  // Authenticate with Google token
  async authenticateWithGoogle(googleToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Google authentication failed');
      }

      const result = await response.json();

      // Store token and user data
      localStorage.setItem('budgetwise_token', result.token);

      // Extract user info from JWT token
      const user = this.decodeJWT(result.token);
      localStorage.setItem('budgetwise_user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Complete Google authentication error:', error);
      throw error;
    }
  }

  // Complete login with OTP
  async completeLogin(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
      }

      const result = await response.json();

      // Store token and user data
      localStorage.setItem('budgetwise_token', result.token);

      // Extract user info from JWT token (simple decode)
      const user = this.decodeJWT(result.token);
      localStorage.setItem('budgetwise_user', JSON.stringify(user));

      return result;
    } catch (error) {
      console.error('Complete login error:', error);
      throw error;
    }
  }

  // Verify login OTP and return backend response (contains token)
  async verifyLoginOtp(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'OTP verification failed');
      }

      const result = await response.json();
      // backend returns { token, message }
      return result;
    } catch (error) {
      console.error('Verify login OTP error:', error);
      throw error;
    }
  }

  // Request OTP for password reset
  async requestPasswordResetOtp(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to send password reset OTP');
      }

      return await response.json();
    } catch (error) {
      console.error('Request password reset OTP error:', error);
      throw error;
    }
  }

  // Complete password reset with OTP
  async completePasswordReset(email, otp, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Password reset failed');
      }

      const result = await response.json();

      // Update stored password if user is logged in
      const user = this.getCurrentUser();
      if (user && user.email === email) {
        localStorage.setItem('budgetwise_token', result.token);
        const updatedUser = this.decodeJWT(result.token);
        localStorage.setItem('budgetwise_user', JSON.stringify(updatedUser));
      }

      return result;
    } catch (error) {
      console.error('Complete password reset error:', error);
      throw error;
    }
  }

  // Verify password-reset OTP (returns a temporary token)
  async verifyPasswordResetOtp(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'OTP verification failed');
      }

      const result = await response.json();
      return result; // { token, message }
    } catch (error) {
      console.error('Verify password reset OTP error:', error);
      throw error;
    }
  }

  // Submit new password to reset endpoint
  async resetPasswordRequest(email, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Password reset failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Reset password request error:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('budgetwise_token');
    localStorage.removeItem('budgetwise_user');
    localStorage.removeItem('budgetwise_transactions');
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('budgetwise_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('budgetwise_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Validate token with backend
  async validateToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Simple JWT decode (for demo purposes - in production, use proper JWT library)
  decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      return {
        id: decoded.sub,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        department: decoded.department,
        gender: decoded.gender,
        subscriptionPlan: decoded.subscriptionPlan,
        subscriptionPeriod: decoded.subscriptionPeriod
      };
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  }

  // Helper method for API calls with authentication
  async authenticatedFetch(url, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }

  // Check if email already exists
  async checkEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to check email');
      }

      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Check email error:', error);
      // Default to false to avoid blocking user if service is down, or throw?
      // Let's return false but log it. Logic in component can decide handling.
      return false;
    }
  }
}

const authService = new AuthService();

export default authService;

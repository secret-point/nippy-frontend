import api from '../config/api';

// Registration types
export interface ClientRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessType: string;
}

export interface FreelancerRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  skills?: string[];
  hourlyRate?: number;
  bio?: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'freelancer' | 'admin';
  status: 'active' | 'pending_verification' | 'suspended' | 'deactivated';
  avatar?: string;
  requiresVerification?: boolean;
}

// Backend response structure
export interface LoginResponse {
  success: boolean;
  message: string;
  warning?: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

// Frontend return structure (simplified)
export interface AuthResponse {
  user: AuthUser;
  token: string;
  requiresVerification?: boolean;
}

class AuthService {
  // Login for both clients and freelancers
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('AuthService.login called with:', { email: typeof email, password: typeof password })
      console.log('Email value:', email)
      console.log('Password defined:', !!password)
      
      const requestData = { email, password }
      console.log('Request data:', requestData)
      
      const response = await api.post<LoginResponse>('/auth/login', requestData);
      const { success, message, warning, data } = response.data;

      if (!success) {
        throw new Error(message || 'Login failed');
      }

      // Store token and user in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show warning if email verification is required
      if (warning) {
        console.warn(warning);
      }

      return {
        user: data.user,
        token: data.token,
        requiresVerification: data.user.requiresVerification
      };
    } catch (error: any) {
      console.error('Login error details:', error.response?.data)
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Register client
  async registerClient(data: ClientRegistrationData): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/register', { ...data, role: 'client' });
      const { success, message, data: responseData } = response.data;

      if (!success) {
        throw new Error(message || 'Registration failed');
      }

      // Store token and user in localStorage
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));

      return {
        user: responseData.user,
        token: responseData.token
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Client registration failed');
    }
  }

  // Register freelancer
  async registerFreelancer(data: FreelancerRegistrationData): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/register', { ...data, role: 'freelancer' });
      const { success, message, data: responseData } = response.data;

      if (!success) {
        throw new Error(message || 'Registration failed');
      }

      // Store token and user in localStorage
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));

      return {
        user: responseData.user,
        token: responseData.token
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Freelancer registration failed');
    }
  }

  // Google Sign In
  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/google', { token: googleToken });
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google sign in failed');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/auth/logout', { token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Get current user from localStorage
  getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user is client
  isClient(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'client';
  }

  // Check if user is freelancer
  isFreelancer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'freelancer';
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  }

  // Reset password (for ResetPassword.tsx compatibility)
  async resetPassword(emailOrToken: string, newPassword?: string): Promise<void> {
    try {
      if (newPassword) {
        // This is the actual reset password with token
        await api.post('/auth/reset-password', { token: emailOrToken, newPassword });
      } else {
        // This is forgot password (email only) - for compatibility
        await this.forgotPassword(emailOrToken);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }
}

const authService = new AuthService();

// Export as both named and default for compatibility
export const authAPI = authService;
export default authService;

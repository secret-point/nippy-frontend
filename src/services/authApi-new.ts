import api from '../config/api';

// Auth types matching backend response
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'freelancer' | 'admin';
  status: 'pending_verification' | 'active' | 'suspended';
  avatar?: string;
  requiresVerification?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  warning?: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

class AuthService {
  // Login matching backend API
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        // Store token and user in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Set token in axios default headers for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Logout
  logout(): void {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove token from axios default headers
    delete api.defaults.headers.common['Authorization'];
    
    // Redirect to login page
    window.location.href = '/login';
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

  // Get current token
  getToken(): string | null {
    return localStorage.getItem('token');
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

  // Initialize auth state (call on app start)
  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      // Set token in axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;

// Named export for compatibility
export { authService };

// Example of how to use the clean login module
import { authAPI } from '../services/authApi';

export async function loginExample() {
  try {
    // Simple login with email and password
    const result = await authAPI.login('user@example.com', 'password123');
    
    console.log('Login successful:', result);
    console.log('User:', result.user);
    console.log('Token:', result.token);
    
    // Check if email verification is required
    if (result.requiresVerification) {
      console.log('Email verification required');
    }
    
    // Check user authentication status
    const isAuthenticated = authAPI.isAuthenticated();
    console.log('Is authenticated:', isAuthenticated);
    
    // Get current user
    const currentUser = authAPI.getCurrentUser();
    console.log('Current user:', currentUser);
    
    // Check user role
    const isClient = authAPI.isClient();
    const isFreelancer = authAPI.isFreelancer();
    console.log('Is client:', isClient);
    console.log('Is freelancer:', isFreelancer);
    
    // Get token for API requests
    const token = authAPI.getToken();
    console.log('Token for API requests:', token);
    
  } catch (error: any) {
    console.error('Login failed:', error.message);
  }
}

export async function logoutExample() {
  try {
    await authAPI.logout();
    console.log('Logout successful');
  } catch (error: any) {
    console.error('Logout failed:', error.message);
  }
}

export async function registerClientExample() {
  try {
    const clientData = {
      email: 'client@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      businessType: 'cafe'
    };
    
    const result = await authAPI.registerClient(clientData);
    console.log('Client registration successful:', result);
    
  } catch (error: any) {
    console.error('Client registration failed:', error.message);
  }
}

export async function registerFreelancerExample() {
  try {
    const freelancerData = {
      email: 'freelancer@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      skills: ['design', 'development'],
      hourlyRate: 50,
      bio: 'Experienced designer and developer'
    };
    
    const result = await authAPI.registerFreelancer(freelancerData);
    console.log('Freelancer registration successful:', result);
    
  } catch (error: any) {
    console.error('Freelancer registration failed:', error.message);
  }
}

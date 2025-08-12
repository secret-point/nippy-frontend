import { httpClient } from '../utils/httpClient'
import { API_ENDPOINTS } from '../config/api'
import { NotificationSettings, User } from '../types'

export const usersAPI = {
  // PUT /users/profile/location (update location & language)
  async updateLocation(data: { country: string; city: string; timezone: string; language: string }): Promise<any> {
    try {
      const response = await httpClient.put('/users/profile/location', data);
      return response;
    } catch (error) {
      console.error('Failed to update location/language:', error);
      throw error;
    }
  },
  // GET /api/users
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    userType?: string
    status?: string
  }): Promise<{ data: User[], total: number, page: number, limit: number }> {
    try {
      const response = await httpClient.get<{
        data: { data: User[], total: number, page: number, limit: number }
      }>(API_ENDPOINTS.USERS.LIST, params)
      return response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  },

  // GET /users/profile/me (returns full profile including location/language)
  async getProfile(): Promise<User> {
    try {
      const response = await httpClient.get<{ data: User }>('/users/profile/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  // GET /api/users/:id
  async getUser(id: string): Promise<User> {
    try {
      const response = await httpClient.get<{ data: User }>(API_ENDPOINTS.USERS.DETAIL(id))
      return response.data
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    }
  },

  // POST /api/users
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await httpClient.post<{ data: User }>(API_ENDPOINTS.USERS.CREATE, userData)
      return response.data
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  },

  // PUT /api/users/profile/basic/:id
  async updateUserBasic(id: string, userData: { firstName: string; lastName: string; phoneNumber: string; businessType: string }): Promise<any> {
    try {
      // Map phoneNumber to phone for backend compatibility
      const { phoneNumber, ...rest } = userData;
      const payload = { ...rest, phone: phoneNumber };
  const response = await httpClient.put<any>(API_ENDPOINTS.USERS.BASIC_UPDATE(id), payload);
  return response.data;
    } catch (error) {
      console.error('Failed to update basic user profile:', error);
      throw error;
    }
  },

  // DELETE /api/users/:id
  async deleteUser(id: string): Promise<void> {
    try {
      await httpClient.delete(API_ENDPOINTS.USERS.DELETE(id))
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw error
    }
  },

  // POST /api/users/:id/suspend
  async suspendUser(id: string, reason?: string): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.USERS.SUSPEND(id), { reason })
    } catch (error) {
      console.error('Failed to suspend user:', error)
      throw error
    }
  },

  // POST /api/users/:id/activate
  async activateUser(id: string): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.USERS.ACTIVATE(id))
    } catch (error) {
      console.error('Failed to activate user:', error)
      throw error
    }
  },

  // PUT /users/profile/email_notifications (update email notification settings)
  async updateNotifications(data: any): Promise<any> {
    try {
      const response = await httpClient.put('/users/profile/email_notifications', data);
      return response;
    } catch (error) {
      console.error('Failed to update email notifications:', error);
      throw error;
    }
  },

  // GET /users/notifications (fetch notification settings)
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await httpClient.get<NotificationSettings>("/users/notifications");
      return response;
    } catch (error) {
      console.error("Failed to fetch notification settings:", error);
      throw error;
    }
  },
}

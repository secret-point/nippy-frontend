const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Conversation types
export interface Conversation {
  id: string;
  clientId: string;
  freelancerId: string;
  jobId?: string;
  projectTitle?: string;
  status: 'not-hired' | 'hired' | 'closed';
  lastMessageAt?: Date;
  lastMessage?: string;
  clientUnread: boolean;
  freelancerUnread: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Populated fields
  otherParticipant?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  unreadCount?: number;
  unread?: boolean;
  timestamp?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'text' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read';
  readAt?: Date;
  fileData?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  };
  createdAt: Date;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

class MessageAPI {
  // Get all conversations for the current user
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: 'GET',
        headers: createHeaders(),
      });

      const result: ApiResponse<Conversation[]> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch conversations');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  // Get a specific conversation with messages
  async getConversation(conversationId: string, page: number = 1, limit: number = 50): Promise<{
    conversation: Conversation;
    messages: Message[];
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/conversations/${conversationId}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: createHeaders(),
        }
      );

      const result: ApiResponse<{ conversation: Conversation; messages: Message[] }> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch conversation');
      }

      return result.data!;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  // Create a new conversation
  async createConversation(freelancerId: string, jobId?: string, projectTitle?: string): Promise<Conversation> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ freelancerId, jobId, projectTitle }),
      });

      const result: ApiResponse<Conversation> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create conversation');
      }

      return result.data!;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(conversationId: string, content: string, type: 'text' | 'file' = 'text', fileData?: any): Promise<Message> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ content, type, fileData }),
      });

      const result: ApiResponse<Message> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      return result.data!;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markAsRead(conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/mark-read`, {
        method: 'PUT',
        headers: createHeaders(),
      });

      const result: ApiResponse<void> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to mark messages as read');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Hire freelancer
  async hireFreelancer(conversationId: string): Promise<Conversation> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/hire`, {
        method: 'PUT',
        headers: createHeaders(),
      });

      const result: ApiResponse<Conversation> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to hire freelancer');
      }

      return result.data!;
    } catch (error) {
      console.error('Error hiring freelancer:', error);
      throw error;
    }
  }

  // Mark project as complete (freelancer action)
  async markProjectComplete(conversationId: string): Promise<Message> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/complete`, {
        method: 'PUT',
        headers: createHeaders(),
      });

      const result: ApiResponse<Message> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to mark project as complete');
      }

      return result.data!;
    } catch (error) {
      console.error('Error marking project as complete:', error);
      throw error;
    }
  }

  // Request revisions (client action)
  async requestRevisions(conversationId: string, revisionNotes: string): Promise<Message> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/revisions`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify({ revisionNotes }),
      });

      const result: ApiResponse<Message> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to request revisions');
      }

      return result.data!;
    } catch (error) {
      console.error('Error requesting revisions:', error);
      throw error;
    }
  }

  // Approve project and complete payment (client action)
  async approveProject(conversationId: string): Promise<Conversation> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/approve`, {
        method: 'PUT',
        headers: createHeaders(),
      });

      const result: ApiResponse<Conversation> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve project');
      }

      return result.data!;
    } catch (error) {
      console.error('Error approving project:', error);
      throw error;
    }
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });

      const result: ApiResponse<void> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
}

export const messageAPI = new MessageAPI();

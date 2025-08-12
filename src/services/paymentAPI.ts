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

// Payment types
export interface Payment {
  id: string;
  orderId: string;
  clientId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  method: 'stripe' | 'paypal' | 'bank_transfer';
  description?: string;
  metadata?: Record<string, any>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Populated fields
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  order?: {
    id: string;
    totalAmount: number;
    status: string;
  };
  freelancerName: string;
  projectTitle: string;
  freelancerAvatar: string;
}

export interface PaymentStats {
  totalRevenue: number;
  totalPayouts: number;
  totalRefunds: number;
  totalCommissions: number;
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;
  recentTransactions: Payment[];
}

export interface CreatePaymentData {
  orderId: string;
  amount: number;
  currency: string;
  method?: 'stripe' | 'paypal' | 'bank_transfer';
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentFilters {
  status?: string;
  method?: string;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PaymentsResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface Transaction {
  id: string;
  type: 'Payment' | 'Payout' | 'Refund' | 'Commission';
  user: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Flagged';
  date: string;
  description?: string;
  flags?: string[];
  disputeText?: string;
}

class PaymentAPI {
  // Create a new payment
  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(paymentData),
      });

      const result: ApiResponse<Payment> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment');
      }

      return result.data!;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Get all payments with filters
  async getPayments(filters: PaymentFilters = {}): Promise<PaymentsResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/payments?${params.toString()}`, {
        method: 'GET',
        headers: createHeaders(),
      });

      const result: ApiResponse<PaymentsResponse> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch payments');
      }

      return result.data!;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  // Get payment by ID
  async getPaymentById(id: string): Promise<Payment> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'GET',
        headers: createHeaders(),
      });

      const result: ApiResponse<Payment> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch payment');
      }

      return result.data!;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Update payment status (admin only)
  async updatePaymentStatus(id: string, status: string, metadata?: Record<string, any>): Promise<Payment> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}/status`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify({ status, metadata }),
      });

      const result: ApiResponse<Payment> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update payment status');
      }

      return result.data!;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Process refund (admin only)
  async processRefund(id: string, refundAmount?: number, reason?: string): Promise<Payment> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}/refund`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ refundAmount, reason }),
      });

      const result: ApiResponse<Payment> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process refund');
      }

      return result.data!;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Get payment statistics
  async getPaymentStats(clientId?: string): Promise<PaymentStats> {
    try {
      const params = new URLSearchParams();
      if (clientId) {
        params.append('clientId', clientId);
      }

      const response = await fetch(`${API_BASE_URL}/payments/stats?${params.toString()}`, {
        method: 'GET',
        headers: createHeaders(),
      });

      const result: ApiResponse<PaymentStats> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch payment statistics');
      }

      return result.data!;
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw error;
    }
  }

  // Get client's own payments
  async getClientPayments(page: number = 1, limit: number = 10): Promise<PaymentsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/payments/client?${params.toString()}`, {
        method: 'GET',
        headers: createHeaders(),
      });

      const result: ApiResponse<PaymentsResponse> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch client payments');
      }

      return result.data!;
    } catch (error) {
      console.error('Error fetching client payments:', error);
      throw error;
    }
  }

  // Simulate payment processing (for demo)
  async simulatePayment(id: string, shouldSucceed: boolean = true): Promise<Payment> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}/simulate`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ shouldSucceed }),
      });

      const result: ApiResponse<Payment> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to simulate payment');
      }

      return result.data!;
    } catch (error) {
      console.error('Error simulating payment:', error);
      throw error;
    }
  }

  // Convert Payment to Transaction format for UI compatibility
  static paymentToTransaction(payment: Payment): Transaction {
    const getTransactionType = (payment: Payment): Transaction['type'] => {
      if (payment.amount < 0) return 'Refund';
      if (payment.description?.includes('commission')) return 'Commission';
      return 'Payment';
    };

    const formatAmount = (amount: number, currency: string = 'USD'): string => {
      const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
      return `${symbol}${Math.abs(amount).toFixed(2)}`;
    };

    const formatStatus = (status: string): Transaction['status'] => {
      switch (status) {
        case 'completed': return 'Completed';
        case 'pending': return 'Pending';
        case 'failed': return 'Failed';
        case 'refunded': return 'Flagged';
        default: return 'Pending';
      }
    };

    const formatDate = (date: Date): string => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    return {
      id: `#${payment.id.slice(-6).toUpperCase()}`,
      type: getTransactionType(payment),
      user: payment.client ? `${payment.client.firstName} ${payment.client.lastName}` : 'Unknown User',
      amount: formatAmount(payment.amount, payment.currency),
      status: formatStatus(payment.status),
      date: formatDate(payment.createdAt),
      description: payment.description,
      flags: payment.status === 'refunded' ? ['Flagged'] : undefined,
      disputeText: payment.status === 'refunded' ? 'Payment refunded' : undefined
    };
  }

  // Convert multiple payments to transactions
  static paymentsToTransactions(payments: Payment[]): Transaction[] {
    return payments.map(payment => this.paymentToTransaction(payment));
  }
}

export const paymentAPI = new PaymentAPI();
export default paymentAPI;

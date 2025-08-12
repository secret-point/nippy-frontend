// Payments Management API
import { httpClient } from '../utils/httpClient'
import { API_ENDPOINTS } from '../config/api'
import { Payment } from '../types'

interface PaymentDetails extends Payment {
  userId: string
  userName: string
  jobId: string
  jobTitle: string
  clientId: string
  clientName: string
  freelancerId: string
  freelancerName: string
  transactionId: string
  paymentMethod: string
}

interface PendingPayout {
  id: string
  freelancerId: string
  freelancerName: string
  amount: number
  jobId: string
  jobTitle: string
  requestedDate: string
  dueDate: string
}

interface RefundRequest {
  id: string
  clientId: string
  clientName: string
  amount: number
  jobId: string
  jobTitle: string
  reason: string
  requestedDate: string
  status: 'pending' | 'approved' | 'rejected'
}

interface PaymentDispute {
  id: string
  clientId: string
  clientName: string
  freelancerId: string
  freelancerName: string
  amount: number
  jobId: string
  jobTitle: string
  disputeReason: string
  disputeDate: string
  status: 'open' | 'resolved' | 'escalated'
}

export const paymentsAPI = {
  // GET /api/payments
  async getPayments(params?: {
    page?: number
    limit?: number
    status?: string
    userId?: string
    jobId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<{ data: PaymentDetails[], total: number, page: number, limit: number }> {
    try {
      const response = await httpClient.get<{
        data: { data: PaymentDetails[], total: number, page: number, limit: number }
      }>(API_ENDPOINTS.PAYMENTS.LIST, params)
      return response.data
    } catch (error) {
      console.error('Failed to fetch payments:', error)
      throw error
    }
  },

  // GET /api/payments/:id
  async getPayment(id: string): Promise<PaymentDetails> {
    try {
      const response = await httpClient.get<{ data: PaymentDetails }>(API_ENDPOINTS.PAYMENTS.DETAIL(id))
      return response.data
    } catch (error) {
      console.error('Failed to fetch payment:', error)
      throw error
    }
  },

  // GET /api/payments/pending-payouts
  async getPendingPayouts(params?: {
    page?: number
    limit?: number
  }): Promise<{ data: PendingPayout[], total: number, page: number, limit: number }> {
    try {
      const response = await httpClient.get<{
        data: { data: PendingPayout[], total: number, page: number, limit: number }
      }>(API_ENDPOINTS.PAYMENTS.PENDING_PAYOUTS, params)
      return response.data
    } catch (error) {
      console.error('Failed to fetch pending payouts:', error)
      throw error
    }
  },

  // GET /api/payments/refund-requests
  async getRefundRequests(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<{ data: RefundRequest[], total: number, page: number, limit: number }> {
    try {
      const response = await httpClient.get<{
        data: { data: RefundRequest[], total: number, page: number, limit: number }
      }>(API_ENDPOINTS.PAYMENTS.REFUND_REQUESTS, params)
      return response.data
    } catch (error) {
      console.error('Failed to fetch refund requests:', error)
      throw error
    }
  },

  // GET /api/payments/disputes
  async getPaymentDisputes(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<{ data: PaymentDispute[], total: number, page: number, limit: number }> {
    try {
      const response = await httpClient.get<{
        data: { data: PaymentDispute[], total: number, page: number, limit: number }
      }>(API_ENDPOINTS.PAYMENTS.DISPUTES, params)
      return response.data
    } catch (error) {
      console.error('Failed to fetch payment disputes:', error)
      throw error
    }
  },

  // POST /api/payments/:id/process-payout
  async processPayout(id: string, data?: {
    note?: string
    paymentMethod?: string
  }): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.PAYMENTS.PROCESS_PAYOUT(id), data)
    } catch (error) {
      console.error('Failed to process payout:', error)
      throw error
    }
  },

  // POST /api/payments/:id/process-refund
  async processRefund(id: string, data?: {
    note?: string
    approved: boolean
  }): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.PAYMENTS.PROCESS_REFUND(id), data)
    } catch (error) {
      console.error('Failed to process refund:', error)
      throw error
    }
  }
}

import api from '../config/api';
import { 
  DashboardMetrics, 
  ActionItem, 
  ChartData, 
  RecentActivity
} from '../types';

// Dashboard API endpoints
export const dashboardAPI = {
  // GET /api/dashboard/metrics
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await api.get('/dashboard/metrics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      // Return mock data as fallback
      return {
        activeUsers: 12493,
        activeUsersTrend: 12,
        openJobs: 1284,
        openJobsTrend: 8,
        revenue: 89452,
        revenueTrend: 23,
        activeDisputes: 37,
        activeDisputesTrend: -5
      };
    }
  },

  // GET /api/dashboard/action-items
  async getActionItems(): Promise<ActionItem[]> {
    try {
      const response = await api.get('/dashboard/action-items');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch action items:', error);
      // Return mock data as fallback
      return [
        {
          id: '1',
          type: 'pending-payouts',
          count: 5,
          description: 'Pending payouts require approval'
        },
        {
          id: '2',
          type: 'refund-requests',
          count: 2,
          description: 'Refund requests need review'
        },
        {
          id: '3',
          type: 'payment-disputes',
          count: 3,
          description: 'Disputes with payment issues'
        },
        {
          id: '4',
          type: 'payment-discrepancies',
          count: 4,
          description: 'Jobs flagged for payment discrepancies'
        }
      ];
    }
  },

  // GET /api/dashboard/charts/jobs-posted
  async getJobsPostedChart(): Promise<ChartData> {
    try {
      const response = await api.get('/dashboard/charts/jobs-posted');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch jobs posted chart:', error);
      // Return mock data as fallback
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [85, 70, 65, 75, 80, 45, 85]
      };
    }
  },

  // GET /api/dashboard/charts/revenue
  async getRevenueChart(): Promise<ChartData> {
    try {
      const response = await api.get('/dashboard/charts/revenue');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch revenue chart:', error);
      // Return mock data as fallback
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [65, 95, 17, 13, 30, 43, 31]
      };
    }
  },

  // GET /api/dashboard/recent-signups
  async getRecentSignups(): Promise<RecentActivity[]> {
    try {
      const response = await api.get('/dashboard/recent-signups');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent signups:', error);
      // Return mock data as fallback
      return [
        { id: '1', title: 'User #1', subtitle: 'Joined today', timestamp: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'User #2', subtitle: 'Joined today', timestamp: '2024-01-15T11:00:00Z' },
        { id: '3', title: 'User #3', subtitle: 'Joined today', timestamp: '2024-01-15T12:00:00Z' },
        { id: '4', title: 'User #4', subtitle: 'Joined today', timestamp: '2024-01-15T13:00:00Z' }
      ];
    }
  },

  // GET /api/dashboard/recent-jobs
  async getRecentJobs(): Promise<RecentActivity[]> {
    try {
      const response = await api.get('/dashboard/recent-jobs');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent jobs:', error);
      // Return mock data as fallback
      return [
        { id: '1', title: 'Job #1', subtitle: 'Posted today', timestamp: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'Job #2', subtitle: 'Posted today', timestamp: '2024-01-15T11:00:00Z' },
        { id: '3', title: 'Job #3', subtitle: 'Posted today', timestamp: '2024-01-15T12:00:00Z' },
        { id: '4', title: 'Job #4', subtitle: 'Posted today', timestamp: '2024-01-15T13:00:00Z' }
      ];
    }
  },

  // GET /api/dashboard/recent-disputes
  async getRecentDisputes(): Promise<RecentActivity[]> {
    try {
      const response = await api.get('/dashboard/recent-disputes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent disputes:', error);
      // Return mock data as fallback
      return [
        { id: '1', title: 'Dispute #1', subtitle: 'Opened today', timestamp: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'Dispute #2', subtitle: 'Opened today', timestamp: '2024-01-15T11:00:00Z' },
        { id: '3', title: 'Dispute #3', subtitle: 'Opened today', timestamp: '2024-01-15T12:00:00Z' },
        { id: '4', title: 'Dispute #4', subtitle: 'Opened today', timestamp: '2024-01-15T13:00:00Z' }
      ];
    }
  }
};

export default dashboardAPI;

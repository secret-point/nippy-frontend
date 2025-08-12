// Jobs Management API
import api from '../config/api'

// Backend response structure
export interface JobResponse {
  success: boolean;
  message: string;
  data: {
    job: Job;
  };
}

export interface JobListResponse {
  success: boolean;
  data: {
    jobs: Job[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Job creation data structure to match backend validation
export interface CreateJobData {
  title: string;
  description: string;
  requirements?: string;
  jobType: 'fixed' | 'hourly';
  budget?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  estimatedHours?: number;
  duration?: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  skillsRequired?: string[];
  categoryId?: string;
  deadline?: string;
}

// Frontend Job interface
export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  jobType: 'fixed' | 'hourly';
  budget?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  estimatedHours?: number;
  duration?: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  skillsRequired: string[];
  deadline?: string;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  };
  files?: JobFile[];
}

export interface JobFile {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  type: 'image' | 'document' | 'other';
  description?: string;
  createdAt: string;
}

export const jobsAPI = {
  // GET /api/jobs
  async getJobs(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    category?: string
    clientId?: string
    freelancerId?: string
  }): Promise<JobListResponse> {
    try {
      const response = await api.get<JobListResponse>('/jobs', { params })
      return response.data
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      throw error
    }
  },

  // GET /api/jobs/:id
  async getJob(id: string): Promise<Job> {
    try {
      const response = await api.get<JobResponse>(`/jobs/${id}`)
      return response.data.data.job
    } catch (error) {
      console.error('Failed to fetch job:', error)
      throw error
    }
  },

  // POST /api/jobs - Create a new job
  async createJob(userId: string, jobData: CreateJobData): Promise<Job> {
    try {
      const requestData = {
        userid: userId,
        newjob: jobData
      }
      
      const response = await api.post<JobResponse>('/jobs', requestData)
      return response.data.data.job
    } catch (error: any) {
      console.error('Failed to create job:', error)
      throw new Error(error.response?.data?.message || 'Failed to create job')
    }
  },

  // POST /api/jobs/draft - Create a draft job
  async createDraft(userId: string, jobData: Partial<CreateJobData>): Promise<Job> {
    try {
      const requestData = {
        userid: userId,
        newjob: {
          ...jobData,
          status: 'draft'
        }
      }
      
      const response = await api.post<JobResponse>('/jobs/draft', requestData)
      return response.data.data.job
    } catch (error: any) {
      console.error('Failed to create draft:', error)
      throw new Error(error.response?.data?.message || 'Failed to create draft')
    }
  },

  // GET /api/jobs/drafts - Get user's draft jobs
  async getDraftJobs(): Promise<Job[]> {
    try {
      const response = await api.get<{ success: boolean; data: { jobs: Job[] } }>('/jobs/drafts')
      return response.data.data.jobs
    } catch (error: any) {
      console.error('Failed to get draft jobs:', error)
      throw new Error(error.response?.data?.message || 'Failed to get draft jobs')
    }
  },

  // PUT /api/jobs/:id
  async updateJob(id: string, jobData: Partial<CreateJobData>): Promise<Job> {
    try {
      const response = await api.put<JobResponse>(`/jobs/${id}`, jobData)
      return response.data.data.job
    } catch (error: any) {
      console.error('Failed to update job:', error)
      throw new Error(error.response?.data?.message || 'Failed to update job')
    }
  },

  // DELETE /api/jobs/:id
  async deleteJob(id: string): Promise<void> {
    try {
      await api.delete(`/jobs/${id}`)
    } catch (error: any) {
      console.error('Failed to delete job:', error)
      throw new Error(error.response?.data?.message || 'Failed to delete job')
    }
  },

  // POST /api/jobs/:id/flag
  async flagJob(id: string, flagData: {
    reason: string
    description?: string
    flaggedBy: string
  }): Promise<void> {
    try {
      await api.post(`/jobs/${id}/flag`, flagData)
    } catch (error: any) {
      console.error('Failed to flag job:', error)
      throw new Error(error.response?.data?.message || 'Failed to flag job')
    }
  },

  // POST /api/jobs/:id/takedown
  async takedownJob(id: string, reason?: string): Promise<void> {
    try {
      await api.post(`/jobs/${id}/takedown`, { reason })
    } catch (error: any) {
      console.error('Failed to takedown job:', error)
      throw new Error(error.response?.data?.message || 'Failed to takedown job')
    }
  },

  // PUT /api/jobs/:id - Publish a draft job by updating its status to 'open'
  async publishDraft(id: string): Promise<Job> {
    try {
      const response = await api.put(`/jobs/${id}`, {
        status: 'open'
      })
      return response.data.data.job
    } catch (error: any) {
      console.error('Failed to publish draft:', error)
      throw new Error(error.response?.data?.message || 'Failed to publish draft')
    }
  }
}

// Freelancers API
import { httpClient } from '../utils/httpClient'
import { API_ENDPOINTS } from '../config/api'
import { User, Review } from '../types'

interface FreelancerProfile extends User {
  skills: string[]
  portfolio: {
    id: string
    title: string
    description: string
    images: string[]
    technologies: string[]
  }[]
  hourlyRate: number
  availability: 'Available' | 'Busy' | 'Not Available'
  completedJobs: number
  totalEarnings: number
}

export const freelancersAPI = {
  // GET /api/freelancers
  async getFreelancers(params?: {
    page?: number
    limit?: number
    search?: string
    skills?: string[]
    minRating?: number
    availability?: string
    minHourlyRate?: number
    maxHourlyRate?: number
  }): Promise<{ data: FreelancerProfile[], total: number, page: number, limit: number }> {
    try {
      const response = await httpClient.get<{
        data: { data: FreelancerProfile[], total: number, page: number, limit: number }
      }>(API_ENDPOINTS.FREELANCERS.LIST, params)
      return response.data
    } catch (error) {
      console.error('Failed to fetch freelancers:', error)
      throw error
    }
  },

  // GET /api/freelancers/:id
  async getFreelancer(id: string): Promise<FreelancerProfile> {
    try {
      const response = await httpClient.get<{ data: FreelancerProfile }>(API_ENDPOINTS.FREELANCERS.DETAIL(id))
      return response.data
    } catch (error) {
      console.error('Failed to fetch freelancer:', error)
      throw error
    }
  },

  // GET /api/freelancers/:id/reviews
  async getFreelancerReviews(id: string, params?: {
    page?: number
    limit?: number
  }): Promise<{ data: Review[], total: number, page: number, limit: number }> {
    try {
      const response = await httpClient.get<{
        data: { data: Review[], total: number, page: number, limit: number }
      }>(API_ENDPOINTS.FREELANCERS.REVIEWS(id), params)
      return response.data
    } catch (error) {
      console.error('Failed to fetch freelancer reviews:', error)
      throw error
    }
  }
}

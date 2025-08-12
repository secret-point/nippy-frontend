/**
 * Backend Job Posting API - Implementation Guide
 * 
 * This file demonstrates how to use the job posting API that connects
 * the frontend PostJob form to the backend job creation endpoint.
 */

import { jobsAPI, CreateJobData } from '../services/jobsAPI'
import { authAPI } from '../services/authApi'

// Example: Post a new job
export async function postJobExample() {
  try {
    // 1. Get the current authenticated user
    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) {
      throw new Error('User must be logged in to post a job')
    }

    // 2. Create job data matching backend requirements
    const jobData: CreateJobData = {
      title: 'Video Editor for Social Media Content',
      description: 'Looking for a skilled video editor to create engaging social media content for our brand. Need someone who can work with motion graphics and create eye-catching visuals.',
      jobType: 'fixed', // or 'hourly'
      experienceLevel: 'intermediate', // 'entry', 'intermediate', or 'expert'
      budget: 500, // For fixed projects
      // For hourly projects, use:
      // hourlyRateMin: 25,
      // hourlyRateMax: 50,
      duration: '1-2 weeks',
      requirements: 'Must have experience with Adobe After Effects and Premiere Pro',
      skillsRequired: ['Video Editing', 'Motion Graphics', 'Adobe Premiere'],
      // Optional fields:
      // categoryId: 'some-uuid', // If you have specific category
      // deadline: '2025-08-20T00:00:00Z', // ISO date string
      // estimatedHours: 20, // For hourly jobs
    }

    // 3. Call the API to create the job
    const createdJob = await jobsAPI.createJob(currentUser.id, jobData)
    
    console.log('✅ Job posted successfully:', {
      id: createdJob.id,
      title: createdJob.title,
      status: createdJob.status
    })

    return createdJob

  } catch (error: any) {
    console.error('❌ Error posting job:', error.message)
    throw error
  }
}

// Example: Get all jobs
export async function getAllJobsExample() {
  try {
    const response = await jobsAPI.getJobs({
      page: 1,
      limit: 10,
      // Optional filters:
      // category: 'video-animation',
      // status: 'open',
    })

    console.log('📋 Jobs retrieved:', {
      total: response.data.pagination.total,
      jobs: response.data.jobs.length
    })

    return response.data.jobs

  } catch (error: any) {
    console.error('❌ Error fetching jobs:', error.message)
    throw error
  }
}

// Example: Get a specific job
export async function getJobExample(jobId: string) {
  try {
    const job = await jobsAPI.getJob(jobId)
    
    console.log('📄 Job details:', {
      id: job.id,
      title: job.title,
      client: job.client.firstName + ' ' + job.client.lastName,
      budget: job.budget
    })

    return job

  } catch (error: any) {
    console.error('❌ Error fetching job:', error.message)
    throw error
  }
}

// Example: Update a job
export async function updateJobExample(jobId: string) {
  try {
    const updatedJob = await jobsAPI.updateJob(jobId, {
      title: 'Updated Video Editor Position',
      description: 'Updated description with more details...',
      budget: 750
    })

    console.log('✏️ Job updated successfully:', updatedJob.title)

    return updatedJob

  } catch (error: any) {
    console.error('❌ Error updating job:', error.message)
    throw error
  }
}

// Example: Delete a job
export async function deleteJobExample(jobId: string) {
  try {
    await jobsAPI.deleteJob(jobId)
    console.log('🗑️ Job deleted successfully')

  } catch (error: any) {
    console.error('❌ Error deleting job:', error.message)
    throw error
  }
}

/**
 * Backend API Structure Summary:
 * 
 * POST /api/jobs
 * - Creates a new job
 * - Requires authentication
 * - Request format: { userid: string, newjob: CreateJobData }
 * - Response: { success: boolean, message: string, data: { job: Job } }
 * 
 * GET /api/jobs
 * - Lists all jobs with pagination and filters
 * - Requires authentication
 * - Query params: page, limit, category, type, experience
 * - Response: { success: boolean, data: { jobs: Job[], pagination: {...} } }
 * 
 * GET /api/jobs/:id
 * - Gets a specific job by ID
 * - Requires authentication
 * - Response: { success: boolean, data: { job: Job } }
 * 
 * PUT /api/jobs/:id
 * - Updates a job (owner only)
 * - Requires authentication
 * - Request: Partial<CreateJobData>
 * - Response: { success: boolean, data: { job: Job } }
 * 
 * DELETE /api/jobs/:id
 * - Deletes/cancels a job (owner only)
 * - Requires authentication
 * - Response: { success: boolean, message: string }
 */

// Usage in React components (example implementation):
export const createJobApiExamples = () => {
  const handlePostJob = async () => {
    try {
      const job = await postJobExample()
      alert(`Job "${job.title}" posted successfully!`)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleGetJobs = async () => {
    try {
      const jobs = await getAllJobsExample()
      console.log(`Found ${jobs.length} jobs`)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  return {
    handlePostJob,
    handleGetJobs
  }
}

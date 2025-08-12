import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { jobsAPI, Job, JobFile } from '../services/jobsAPI'
import { fileAPI, UploadedFile } from '../services/fileAPI'

interface ApplicantData {
  id: string
  name: string
  avatar?: string
  rating: number
  reviews: number
  price: number
  deliveryTime: string
  description: string
}

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [filesLoading, setFilesLoading] = useState(false)

  // Fetch job details when component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) {
        setError('Job ID not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const jobData = await jobsAPI.getJob(id)
        setJob(jobData)
        
        // Fetch user's uploaded files after job is loaded
        await fetchUserFiles()
      } catch (err: any) {
        console.error('Failed to fetch job details:', err)
        setError('Failed to load job details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [id])

  // Fetch user's uploaded files (attachments)
  const fetchUserFiles = async () => {
    try {
      setFilesLoading(true)
      const files = await fileAPI.getFilesByType('attachment')
      setUploadedFiles(files)
    } catch (err: any) {
      console.error('Failed to fetch user files:', err)
      // Don't show error for files, just log it
    } finally {
      setFilesLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading job details...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error || 'Job not found'}</div>
              <button
                onClick={() => navigate('/jobs')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mock data - in real app this would come from API based on id
  const jobData = {
    title: job.title,
    status: job.status === 'open' ? 'Open' : job.status === 'in_progress' ? 'In Progress' : job.status === 'completed' ? 'Completed' : 'Cancelled',
    postedDate: `Posted ${new Date(job.createdAt).toLocaleDateString()}`,
    views: 0, // This would come from analytics API
    urgent: false, // This would need to be added to the Job interface
    description: job.description,
    creativeBrief: job.requirements || "No additional requirements specified.",
    objectives: job.skillsRequired?.length > 0 ? job.skillsRequired.map(skill => `Expertise in ${skill}`) : [
      "Complete the project according to specifications",
      "Deliver high-quality work on time",
      "Maintain professional communication throughout"
    ],
    skills: job.skillsRequired || [],
    uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles.map(file => ({
      id: file.id,
      originalName: file.originalName,
      filename: file.filename,
      url: file.url,
      mimetype: file.mimetype,
      size: file.size,
      type: file.mimetype.startsWith('image/') ? 'image' as const : 
            file.mimetype.includes('pdf') || file.mimetype.includes('doc') || file.mimetype.includes('text') ? 'document' as const : 'other' as const,
      description: file.description,
      createdAt: file.createdAt
    })) : [],
    budget: job.jobType === 'fixed' ? job.budget : null,
    hourlyRate: job.jobType === 'hourly' ? { min: job.hourlyRateMin, max: job.hourlyRateMax } : null,
    estimatedHours: job.estimatedHours,
    experienceLevel: job.experienceLevel,
    deadline: job.deadline ? new Date(job.deadline).toLocaleDateString() : null,
    clientInfo: {
      name: `${job.client.firstName} ${job.client.lastName}`,
      email: job.client.email
    },
    category: job.category.name,
    applicants: [
      // Mock applicants - this would come from proposals/applications API
      {
        id: "1",
        name: "Emma Wilson",
        rating: 4.5,
        reviews: 56,
        price: 120,
        deliveryTime: "4 days delivery",
        description: "Working with Sarah was a dream! She designed our e-commerce website and the results exceeded all expectations. Her eye for detail and understanding of user experience is remarkable. She was incredibly responsive to feedback and made revisions quickly. Our conversion rate has increased by 35% since launching the new design. Sarah is now our go-to designer for all projects."
      },
      {
        id: "2",
        name: "Alex Chen",
        rating: 4.5,
        reviews: 56,
        price: 150,
        deliveryTime: "4 days delivery",
        description: "Electronic music festival posters are my specialty! I've designed for major events including Soundcloud Sessions and Beat Drop. I can create a unique visual identity that will make your event stand out."
      },
      {
        id: "3",
        name: "Miguel Santos",
        rating: 4.5,
        reviews: 56,
        price: 120,
        deliveryTime: "4 days delivery",
        description: "I bring a unique blend of illustration and graphic design to my poster work. My style incorporates sound wave visualizations that would be perfect for your electronic music festival."
      }
    ]
  }

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Helper function to get file type from mimetype
  const getFileType = (mimetype: string): 'image' | 'document' | 'other' => {
    if (mimetype.startsWith('image/')) return 'image'
    if (mimetype.includes('pdf') || mimetype.includes('doc') || mimetype.includes('text')) return 'document'
    return 'other'
  }

  // FileCard component for displaying uploaded files
  const FileCard = ({ file }: { file: JobFile }) => {
    const fileType = getFileType(file.mimetype)
    const isImage = fileType === 'image'

    return (
      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
        <div className="flex-shrink-0">
          {isImage ? (
            <img 
              src={file.url} 
              alt={file.originalName}
              className="w-12 h-12 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center ${isImage ? 'hidden' : ''}`}>
            {fileType === 'document' ? (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate font-poppins">
            {file.originalName}
          </p>
          <p className="text-xs text-gray-500 font-poppins">
            {formatFileSize(file.size)}
          </p>
          {file.description && (
            <p className="text-xs text-gray-600 mt-1 truncate font-poppins">
              {file.description}
            </p>
          )}
        </div>
        <button 
          onClick={() => window.open(file.url, '_blank')}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Download file"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
    )
  }

  const handleBack = () => {
    navigate('/jobs')
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-[18px] h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 18 17"
        >
          <path d="M9.90645 1.0625C9.74083 0.71875 9.39083 0.5 9.00645 0.5C8.62208 0.5 8.2752 0.71875 8.10645 1.0625L6.09708 5.19688L1.60958 5.85938C1.23458 5.91563 0.922076 6.17812 0.806451 6.5375C0.690826 6.89687 0.784576 7.29375 1.05333 7.55937L4.30958 10.7812L3.54083 15.3344C3.47833 15.7094 3.63458 16.0906 3.94395 16.3125C4.25333 16.5344 4.6627 16.5625 5.0002 16.3844L9.00958 14.2437L13.019 16.3844C13.3565 16.5625 13.7658 16.5375 14.0752 16.3125C14.3846 16.0875 14.5408 15.7094 14.4783 15.3344L13.7065 10.7812L16.9627 7.55937C17.2315 7.29375 17.3283 6.89687 17.2096 6.5375C17.0908 6.17812 16.7815 5.91563 16.4065 5.85938L11.9158 5.19688L9.90645 1.0625Z" />
        </svg>
      ))}
    </div>
  )

  const ApplicantCard = ({ applicant }: { applicant: ApplicantData }) => (
    <div className="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-start gap-3 flex-1 min-w-[300px]">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex flex-col">
            <h3 className="font-poppins font-semibold text-gray-800 text-base leading-6">
              {applicant.name}
            </h3>
            <div className="flex items-center gap-1">
              <StarRating rating={applicant.rating} />
              <span className="text-gray-600 text-sm font-poppins ml-1">
                {applicant.rating} ({applicant.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-lg font-medium text-black font-poppins">
            ${applicant.price}
          </span>
          <span className="text-sm text-gray-500 font-poppins">
            {applicant.deliveryTime}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 text-base font-poppins leading-6">
        {applicant.description}
      </p>
      
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" className="font-poppins">
          View Profile
        </Button>
        <Button variant="primary" className="bg-[#5F42A1] hover:bg-[#4a336b] font-poppins flex items-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M9.9974 19.0077C9.4224 19.0077 8.88073 18.716 8.4974 18.2077L7.2474 16.541C7.2224 16.5077 7.1224 16.466 7.08073 16.4577H6.66406C3.18906 16.4577 1.03906 15.516 1.03906 10.8327V6.66602C1.03906 2.98268 2.98073 1.04102 6.66406 1.04102H13.3307C17.0141 1.04102 18.9557 2.98268 18.9557 6.66602V10.8327C18.9557 14.516 17.0141 16.4577 13.3307 16.4577H12.9141C12.8474 16.4577 12.7891 16.491 12.7474 16.541L11.4974 18.2077C11.1141 18.716 10.5724 19.0077 9.9974 19.0077ZM6.66406 2.29102C3.68073 2.29102 2.28906 3.68268 2.28906 6.66602V10.8327C2.28906 14.5993 3.58073 15.2077 6.66406 15.2077H7.08073C7.50573 15.2077 7.98906 15.4494 8.2474 15.791L9.4974 17.4577C9.78906 17.841 10.2057 17.841 10.4974 17.4577L11.7474 15.791C12.0224 15.4244 12.4557 15.2077 12.9141 15.2077H13.3307C16.3141 15.2077 17.7057 13.816 17.7057 10.8327V6.66602C17.7057 3.68268 16.3141 2.29102 13.3307 2.29102H6.66406Z" fill="white"/>
            <path d="M14.1693 7.29102H5.83594C5.49427 7.29102 5.21094 7.00768 5.21094 6.66602C5.21094 6.32435 5.49427 6.04102 5.83594 6.04102H14.1693C14.5109 6.04102 14.7943 6.32435 14.7943 6.66602C14.7943 7.00768 14.5109 7.29102 14.1693 7.29102Z" fill="white"/>
            <path d="M10.8359 11.459H5.83594C5.49427 11.459 5.21094 11.1757 5.21094 10.834C5.21094 10.4923 5.49427 10.209 5.83594 10.209H10.8359C11.1776 10.209 11.4609 10.4923 11.4609 10.834C11.4609 11.1757 11.1776 11.459 10.8359 11.459Z" fill="white"/>
          </svg>
          Message
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-8 mb-12">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 px-6 py-2.5 bg-black bg-opacity-5 rounded-xl border border-black border-opacity-5 hover:bg-opacity-10 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M9.06705 20L10.8163 18.0922L4.74247 11.3934H20V8.60665H4.74247L10.8163 1.91854L9.06705 0L0 10L9.06705 20Z" fill="black"/>
            </svg>
            <span className="font-poppins text-base font-medium">Back</span>
          </button>
        </div>

        {/* Job Header */}
        <div className="flex flex-col gap-6 p-8 border-b border-gray-200 mb-8">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex flex-col gap-4 flex-1 min-w-[300px]">
              <div className="flex items-center gap-6 flex-wrap">
                <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-sm font-poppins">
                  {jobData.status}
                </span>
                <span className="text-gray-500 text-sm font-poppins">
                  {jobData.postedDate}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 font-manrope leading-tight tracking-tight">
                {jobData.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-100 rounded-full">
                  <svg className="w-4 h-4 text-black" viewBox="0 0 16 17" fill="none">
                    <path d="M8.00385 11.3866C6.41052 11.3866 5.11719 10.0933 5.11719 8.49995C5.11719 6.90661 6.41052 5.61328 8.00385 5.61328C9.59719 5.61328 10.8905 6.90661 10.8905 8.49995C10.8905 10.0933 9.59719 11.3866 8.00385 11.3866ZM8.00385 6.61328C6.96385 6.61328 6.11719 7.45995 6.11719 8.49995C6.11719 9.53995 6.96385 10.3866 8.00385 10.3866C9.04385 10.3866 9.89052 9.53995 9.89052 8.49995C9.89052 7.45995 9.04385 6.61328 8.00385 6.61328Z" fill="currentColor"/>
                    <path d="M7.99875 14.513C5.49208 14.513 3.12542 13.0463 1.49875 10.4997C0.792083 9.39966 0.792083 7.60633 1.49875 6.49966C3.13208 3.95299 5.49875 2.48633 7.99875 2.48633C10.4988 2.48633 12.8654 3.95299 14.4921 6.49966C15.1988 7.59966 15.1988 9.393 14.4921 10.4997C12.8654 13.0463 10.4988 14.513 7.99875 14.513ZM7.99875 3.48633C5.84542 3.48633 3.78542 4.77966 2.34542 7.03966C1.84542 7.81966 1.84542 9.17966 2.34542 9.95966C3.78542 12.2197 5.84542 13.513 7.99875 13.513C10.1521 13.513 12.2121 12.2197 13.6521 9.95966C14.1521 9.17966 14.1521 7.81966 13.6521 7.03966C12.2121 4.77966 10.1521 3.48633 7.99875 3.48633Z" fill="currentColor"/>
                  </svg>
                  <span className="text-sm text-black font-poppins">{jobData.views} Views</span>
                </div>
                {jobData.urgent && (
                  <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-sm font-poppins">
                    Urgent
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Button variant="outline" className="font-poppins">
                Share Profile
              </Button>
              <Button variant="outline" className="font-poppins flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <path d="M12.4974 18.9577H7.4974C2.9724 18.9577 1.03906 17.0243 1.03906 12.4993V7.49935C1.03906 2.97435 2.9724 1.04102 7.4974 1.04102H9.16406C9.50573 1.04102 9.78906 1.32435 9.78906 1.66602C9.78906 2.00768 9.50573 2.29102 9.16406 2.29102H7.4974C3.65573 2.29102 2.28906 3.65768 2.28906 7.49935V12.4993C2.28906 16.341 3.65573 17.7077 7.4974 17.7077H12.4974C16.3391 17.7077 17.7057 16.341 17.7057 12.4993V10.8327C17.7057 10.491 17.9891 10.2077 18.3307 10.2077C18.6724 10.2077 18.9557 10.491 18.9557 10.8327V12.4993C18.9557 17.0243 17.0224 18.9577 12.4974 18.9577Z" fill="black"/>
                  <path d="M7.08214 14.7424C6.5738 14.7424 6.10714 14.5591 5.76547 14.2258C5.35714 13.8174 5.18214 13.2258 5.2738 12.6008L5.63214 10.0924C5.69881 9.60911 6.01547 8.98411 6.35714 8.64245L12.9238 2.07578C14.5821 0.417448 16.2655 0.417448 17.9238 2.07578C18.8321 2.98411 19.2405 3.90911 19.1571 4.83411C19.0821 5.58411 18.6821 6.31745 17.9238 7.06745L11.3571 13.6341C11.0155 13.9758 10.3905 14.2924 9.90714 14.3591L7.3988 14.7174C7.29047 14.7424 7.18214 14.7424 7.08214 14.7424ZM13.8071 2.95911L7.24047 9.52578C7.08214 9.68411 6.8988 10.0508 6.86547 10.2674L6.50714 12.7758C6.4738 13.0174 6.5238 13.2174 6.6488 13.3424C6.7738 13.4674 6.9738 13.5174 7.21547 13.4841L9.7238 13.1258C9.94047 13.0924 10.3155 12.9091 10.4655 12.7508L17.0321 6.18411C17.5738 5.64245 17.8571 5.15911 17.8988 4.70911C17.9488 4.16745 17.6655 3.59245 17.0321 2.95078C15.6988 1.61745 14.7821 1.99245 13.8071 2.95911Z" fill="black"/>
                  <path d="M16.5442 8.19124C16.4859 8.19124 16.4276 8.18291 16.3776 8.16624C14.1859 7.54957 12.4442 5.80791 11.8276 3.61624C11.7359 3.28291 11.9276 2.94124 12.2609 2.84124C12.5942 2.74957 12.9359 2.94124 13.0276 3.27457C13.5276 5.04957 14.9359 6.45791 16.7109 6.95791C17.0442 7.04957 17.2359 7.39957 17.1442 7.73291C17.0692 8.01624 16.8192 8.19124 16.5442 8.19124Z" fill="black"/>
                </svg>
                Edit Job
              </Button>
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg mb-8">
          {/* Budget/Hourly Rate */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600 font-poppins">Budget</h3>
            {jobData.budget ? (
              <p className="text-lg font-semibold text-gray-800 font-poppins">
                £{jobData.budget.toLocaleString()}
              </p>
            ) : jobData.hourlyRate ? (
              <p className="text-lg font-semibold text-gray-800 font-poppins">
                £{jobData.hourlyRate.min}-£{jobData.hourlyRate.max}/hour
              </p>
            ) : (
              <p className="text-lg font-semibold text-gray-800 font-poppins">
                Budget to be discussed
              </p>
            )}
            <p className="text-sm text-gray-500 font-poppins">
              {job.jobType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
            </p>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600 font-poppins">Experience Level</h3>
            <p className="text-lg font-semibold text-gray-800 font-poppins capitalize">
              {jobData.experienceLevel}
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600 font-poppins">Category</h3>
            <p className="text-lg font-semibold text-gray-800 font-poppins">
              {jobData.category}
            </p>
          </div>

          {/* Estimated Hours */}
          {jobData.estimatedHours && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 font-poppins">Estimated Hours</h3>
              <p className="text-lg font-semibold text-gray-800 font-poppins">
                {jobData.estimatedHours} hours
              </p>
            </div>
          )}

          {/* Deadline */}
          {jobData.deadline && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 font-poppins">Deadline</h3>
              <p className="text-lg font-semibold text-gray-800 font-poppins">
                {jobData.deadline}
              </p>
            </div>
          )}

          {/* Client Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600 font-poppins">Client</h3>
            <p className="text-lg font-semibold text-gray-800 font-poppins">
              {jobData.clientInfo.name}
            </p>
          </div>
        </div>

        {/* Job Content */}
        <div className="space-y-12">
          {/* Job Description */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-black font-poppins">
              Job Description
            </h2>
            <p className="text-gray-700 text-base font-poppins leading-6">
              {jobData.description}
            </p>
          </div>

          {/* Creative Brief */}
          <div className="space-y-2">
            <h3 className="text-base font-medium text-gray-800 font-poppins">
              Creative Brief:
            </h3>
            <p className="text-gray-700 text-base font-poppins leading-6">
              {jobData.creativeBrief}
            </p>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <h3 className="text-base font-medium text-gray-800 font-poppins">
              Objectives:
            </h3>
            <div className="space-y-1">
              {jobData.objectives.map((objective, index) => (
                <p key={index} className="text-gray-700 text-base font-poppins leading-6">
                  • {objective}
                </p>
              ))}
            </div>
          </div>

          {/* Skills and Files Section */}
          <div className="border-t border-gray-200 pt-8 space-y-8">
            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 font-poppins">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {jobData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-poppins"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Uploaded Files */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 font-poppins">
                Uploaded Files ({filesLoading ? '...' : jobData.uploadedFiles.length})
              </h3>
              {filesLoading ? (
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 font-poppins">
                    Loading files...
                  </p>
                </div>
              ) : jobData.uploadedFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobData.uploadedFiles.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 font-poppins">
                    No files uploaded for this job
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Applicants Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-medium text-black font-poppins flex-1 min-w-[200px] max-w-[800px]">
                Applicants ({jobData.applicants.length})
              </h2>
              <button className="flex items-center gap-3 px-4 py-1 text-purple-600 hover:text-purple-700 transition-colors">
                <span className="text-sm font-poppins">View All Applicants</span>
                <svg className="w-5 h-5" viewBox="0 0 20 21" fill="none">
                  <path d="M7.4276 17.7253C7.26927 17.7253 7.11094 17.6669 6.98594 17.5419C6.74427 17.3003 6.74427 16.9003 6.98594 16.6586L12.4193 11.2253C12.8193 10.8253 12.8193 10.1753 12.4193 9.77526L6.98594 4.34193C6.74427 4.10026 6.74427 3.70026 6.98594 3.45859C7.2276 3.21693 7.6276 3.21693 7.86927 3.45859L13.3026 8.89193C13.7276 9.31693 13.9693 9.89193 13.9693 10.5003C13.9693 11.1086 13.7359 11.6836 13.3026 12.1086L7.86927 17.5419C7.74427 17.6586 7.58594 17.7253 7.4276 17.7253Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-8">
              {jobData.applicants.map((applicant) => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

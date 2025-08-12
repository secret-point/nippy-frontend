import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { jobsAPI, Job } from '../services/jobsAPI'
import { authAPI } from '../services/authApi'

// JobCardData interface to match frontend display needs
interface JobCardData {
  id: string
  title: string
  description: string
  status: 'live' | 'draft'
  date: string
  proposals: number
  views: number
  lastUpdated?: string
  progress?: number
  progressText?: string
  showApplicants?: boolean
  freelancerProposals?: FreelancerProposal[]
  createdAt?: string // Add for sorting
}

interface FreelancerProposal {
  id: string
  name: string
  title: string
  description: string
  price: string
  skills: string[]
  saved: boolean
}

export const Jobs = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)
  const [jobs, setJobs] = useState<JobCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [publishingJobId, setPublishingJobId] = useState<string | null>(null)
  const navigate = useNavigate()

  // Function to transform API Job data to JobCardData
  const transformJobToJobCardData = (job: Job): JobCardData => {
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      status: job.status === 'open' ? 'live' : job.status === 'draft' ? 'draft' : 'live',
      date: `Posted ${new Date(job.createdAt).toLocaleDateString()}`,
      proposals: 0, // This would need to come from proposals/applications API
      views: 0, // This would need to come from analytics API
      lastUpdated: job.updatedAt !== job.createdAt ? `Updated ${new Date(job.updatedAt).toLocaleDateString()}` : undefined,
      showApplicants: job.status === 'open',
      freelancerProposals: [], // This would come from proposals API
      createdAt: job.createdAt // Add this for sorting
    }
  }

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get current user
        const currentUser = authAPI.getCurrentUser()
        if (!currentUser) {
          setError('Please log in to view your jobs.')
          setLoading(false)
          return
        }
        
        // Fetch both regular jobs and draft jobs
        const [regularJobsResponse, draftJobs] = await Promise.all([
          jobsAPI.getJobs({
            page: 1,
            limit: 50,
            clientId: currentUser.id
          }),
          jobsAPI.getDraftJobs().catch(() => []) // Handle error gracefully
        ])
        
        // Combine and transform all jobs
        const allJobs = [...regularJobsResponse.data.jobs, ...draftJobs]
        const transformedJobs = allJobs.map(transformJobToJobCardData)
        
        // Sort by creation date (newest first)
        transformedJobs.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date)
          const dateB = new Date(b.createdAt || b.date)
          return dateB.getTime() - dateA.getTime()
        })
        
        setJobs(transformedJobs)
      } catch (err: any) {
        console.error('Failed to fetch jobs:', err)
        setError('Failed to load jobs. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    const checkAuthAndFetchJobs = () => {
      // Check if user has a token (is authenticated)
      const token = localStorage.getItem('token')
      if (token) {
        fetchJobs()
      } else {
        setLoading(false)
        setError('Please log in to view your jobs.')
      }
    }

    checkAuthAndFetchJobs()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuthAndFetchJobs()
      }
    }

    // Listen for window focus (when user comes back from login page)
    const handleWindowFocus = () => {
      const token = localStorage.getItem('token')
      if (token && error === 'Please log in to view your jobs.') {
        checkAuthAndFetchJobs()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleWindowFocus)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [])

  // Filter jobs based on active filter
  const filteredJobs = jobs.filter(job => {
    switch (activeFilter) {
      case 'active':
        return job.status === 'live'
      case 'drafts':
        return job.status === 'draft'
      case 'completed':
        return false // Would need to add completed status
      default:
        return true
    }
  })

  const filterCounts = {
    all: jobs.length,
    active: jobs.filter(job => job.status === 'live').length,
    drafts: jobs.filter(job => job.status === 'draft').length,
    completed: 0
  }

  const toggleProposals = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId)
  }

  const handleFinishPosting = async (jobId: string) => {
    try {
      setPublishingJobId(jobId)
      setError(null) // Clear any previous errors
      
      // Publish the draft job
      await jobsAPI.publishDraft(jobId)
      
      // Update the job in the local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { ...job, status: 'live' as const, date: `Posted ${new Date().toLocaleDateString()}` }
            : job
        )
      )
      
      // Show success message
      setSuccessMessage('Job published successfully!')
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
      
    } catch (err: any) {
      console.error('Failed to publish job:', err)
      setError('Failed to publish job. Please try again.')
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setPublishingJobId(null)
    }
  }

  const FreelancerCard = ({ freelancer }: { freelancer: FreelancerProposal }) => (
    <div className="flex flex-col gap-10 p-5 border border-gray-200 rounded-lg bg-white w-[300px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex flex-col">
              <div className="text-gray-800 font-medium text-base font-poppins">
                {freelancer.name}
              </div>
              <div className="text-gray-500 text-sm font-poppins">
                {freelancer.title}
              </div>
            </div>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-90">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill={freelancer.saved ? "#EF4444" : "#374151"}>
              <path d="M2.30156 9.07747L7.24258 13.701C7.44766 13.8928 7.71836 13.9997 8 13.9997C8.28164 13.9997 8.55234 13.8928 8.75742 13.701L13.6984 9.07747C14.5297 8.30186 15 7.21381 15 6.07644V5.91748C15 4.00175 13.6191 2.36831 11.7352 2.05313C10.4883 1.84484 9.21953 2.2532 8.32812 3.14666L8 3.47554L7.67188 3.14666C6.78047 2.2532 5.51172 1.84484 4.26484 2.05313C2.38086 2.36831 1 4.00175 1 5.91748V6.07644C1 7.21381 1.47031 8.30186 2.30156 9.07747Z"/>
            </svg>
          </button>
        </div>
        <p className="text-gray-600 text-sm font-poppins leading-relaxed">
          {freelancer.description}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-gray-800 font-medium text-base font-poppins">
            Starting from: {freelancer.price}
          </div>
          <div className="flex flex-wrap gap-2">
            {freelancer.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-poppins"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-2 bg-black bg-opacity-5 hover:bg-opacity-10 rounded-xl border border-black border-opacity-5 text-black font-medium text-base transition-colors font-poppins">
            View Profile
          </button>
          <button className="px-5 py-2 bg-[#5F42A1] hover:bg-[#4a336b] text-white rounded-xl font-medium text-base transition-colors font-poppins">
            Message
          </button>
        </div>
      </div>
    </div>
  )

  const JobCard = ({ job }: { job: JobCardData }) => (
    <div className="flex flex-col gap-6 p-6 border border-gray-200 rounded-3xl shadow-sm bg-white">
      <div className="flex flex-col gap-0">
        {/* Job Header Row */}
        <div className="flex items-start justify-between gap-5 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className={`px-2 py-1 rounded-full text-sm font-normal ${
              job.status === 'live'
                ? 'bg-teal-50 text-teal-600'
                : 'bg-yellow-50 text-yellow-500'
            }`}>
              {job.status === 'live' ? 'Live' : 'Draft'}
            </div>
            <span className="text-gray-500 text-sm font-normal flex-1">{job.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-7 h-10 flex items-center justify-center rounded-full hover:bg-gray-50">
              <svg className="w-3 h-4" viewBox="0 0 12 16" fill="none">
                <path d="M0 1.5C0 0.671875 0.671875 0 1.5 0V1.5V13.7937L5.56563 10.8906C5.825 10.7031 6.17812 10.7031 6.4375 10.8906L10.5 13.7937V1.5H1.5V0H10.5C11.3281 0 12 0.671875 12 1.5V15.25C12 15.5312 11.8438 15.7875 11.5938 15.9156C11.3438 16.0437 11.0437 16.0219 10.8156 15.8594L6 12.4219L1.18438 15.8594C0.95625 16.0219 0.65625 16.0437 0.40625 15.9156C0.15625 15.7875 0 15.5312 0 15.25V1.5Z" fill="#9CA3AF"/>
              </svg>
            </button>
            <button className="w-5 h-10 flex items-center justify-center rounded-full hover:bg-gray-50">
              <svg className="w-1 h-4" viewBox="0 0 4 16" fill="none">
                <path d="M2 11.25C1.53587 11.25 1.09075 11.4344 0.762563 11.7626C0.434374 12.0908 0.25 12.5359 0.25 13C0.25 13.4641 0.434374 13.9092 0.762563 14.2374C1.09075 14.5656 1.53587 14.75 2 14.75C2.46413 14.75 2.90925 14.5656 3.23744 14.2374C3.56563 13.9092 3.75 13.4641 3.75 13C3.75 12.5359 3.56563 12.0908 3.23744 11.7626C2.90925 11.4344 2.46413 11.25 2 11.25ZM2 6.25C1.53587 6.25 1.09075 6.43437 0.762563 6.76256C0.434374 7.09075 0.25 7.53587 0.25 8C0.25 8.46413 0.434374 8.90925 0.762563 9.23744C1.09075 9.56563 1.53587 9.75 2 9.75C2.46413 9.75 2.90925 9.56563 3.23744 9.23744C3.56563 8.90925 3.75 8.46413 3.75 8C3.75 7.53587 3.56563 7.09075 3.23744 6.76256C2.90925 6.43437 2.46413 6.25 2 6.25ZM3.75 3C3.75 2.53587 3.56563 2.09075 3.23744 1.76256C2.90925 1.43437 2.46413 1.25 2 1.25C1.53587 1.25 1.09075 1.43437 0.762563 1.76256C0.434374 2.09075 0.25 2.53587 0.25 3C0.25 3.46413 0.434374 3.90925 0.762563 4.23744C1.09075 4.56563 1.53587 4.75 2 4.75C2.46413 4.75 2.90925 4.56563 3.23744 4.23744C3.56563 3.90925 3.75 3.46413 3.75 3Z" fill="#9CA3AF"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Job Title and Actions Row */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-800 mb-1">{job.title}</h3>
            <p className="text-gray-600 text-base">{job.description}</p>
          </div>
          <button
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="px-6 py-2.5 bg-black bg-opacity-5 hover:bg-opacity-10 rounded-xl border border-black border-opacity-5 text-black font-medium text-sm transition-colors"
          >
            Job Details
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2 px-2 py-2 bg-gray-50 rounded-xl">
          <svg className="w-4 h-4" viewBox="0 0 16 17" fill="none">
            <path d="M10.6667 15.6673H5.33333C2.9 15.6673 1.5 14.2673 1.5 11.834V5.16732C1.5 2.73398 2.9 1.33398 5.33333 1.33398H10.6667C13.1 1.33398 14.5 2.73398 14.5 5.16732V11.834C14.5 14.2673 13.1 15.6673 10.6667 15.6673ZM5.33333 2.33398C3.42667 2.33398 2.5 3.26065 2.5 5.16732V11.834C2.5 13.7407 3.42667 14.6673 5.33333 14.6673H10.6667C12.5733 14.6673 13.5 13.7407 13.5 11.834V5.16732C13.5 3.26065 12.5733 2.33398 10.6667 2.33398H5.33333Z" fill="#7602FD"/>
            <path d="M12.3307 6.66667H10.9974C9.98406 6.66667 9.16406 5.84667 9.16406 4.83333V3.5C9.16406 3.22667 9.39073 3 9.66406 3C9.9374 3 10.1641 3.22667 10.1641 3.5V4.83333C10.1641 5.29333 10.5374 5.66667 10.9974 5.66667H12.3307C12.6041 5.66667 12.8307 5.89333 12.8307 6.16667C12.8307 6.44 12.6041 6.66667 12.3307 6.66667Z" fill="#7602FD"/>
            <path d="M8.0026 9.66602H5.33594C5.0626 9.66602 4.83594 9.43935 4.83594 9.16602C4.83594 8.89268 5.0626 8.66602 5.33594 8.66602H8.0026C8.27594 8.66602 8.5026 8.89268 8.5026 9.16602C8.5026 9.43935 8.27594 9.66602 8.0026 9.66602Z" fill="#7602FD"/>
            <path d="M10.6693 12.334H5.33594C5.0626 12.334 4.83594 12.1073 4.83594 11.834C4.83594 11.5607 5.0626 11.334 5.33594 11.334H10.6693C10.9426 11.334 11.1693 11.5607 11.1693 11.834C11.1693 12.1073 10.9426 12.334 10.6693 12.334Z" fill="#7602FD"/>
          </svg>
          <span className="text-sm text-gray-700">{job.proposals} proposals</span>
        </div>
        
        <div className="flex items-center gap-2 px-2 py-2 bg-gray-50 rounded-xl">
          <svg className="w-4 h-4" viewBox="0 0 16 17" fill="none">
            <path d="M8.00385 11.3866C6.41052 11.3866 5.11719 10.0933 5.11719 8.49995C5.11719 6.90661 6.41052 5.61328 8.00385 5.61328C9.59719 5.61328 10.8905 6.90661 10.8905 8.49995C10.8905 10.0933 9.59719 11.3866 8.00385 11.3866ZM8.00385 6.61328C6.96385 6.61328 6.11719 7.45995 6.11719 8.49995C6.11719 9.53995 6.96385 10.3866 8.00385 10.3866C9.04385 10.3866 9.89052 9.53995 9.89052 8.49995C9.89052 7.45995 9.04385 6.61328 8.00385 6.61328Z" fill="#6C63FF"/>
            <path d="M7.99875 14.513C5.49208 14.513 3.12542 13.0463 1.49875 10.4997C0.792083 9.39966 0.792083 7.60633 1.49875 6.49966C3.13208 3.95299 5.49875 2.48633 7.99875 2.48633C10.4988 2.48633 12.8654 3.95299 14.4921 6.49966C15.1988 7.59966 15.1988 9.393 14.4921 10.4997C12.8654 13.0463 10.4988 14.513 7.99875 14.513ZM7.99875 3.48633C5.84542 3.48633 3.78542 4.77966 2.34542 7.03966C1.84542 7.81966 1.84542 9.17966 2.34542 9.95966C3.78542 12.2197 5.84542 13.513 7.99875 13.513C10.1521 13.513 12.2121 12.2197 13.6521 9.95966C14.1521 9.17966 14.1521 7.81966 13.6521 7.03966C12.2121 4.77966 10.1521 3.48633 7.99875 3.48633Z" fill="#6C63FF"/>
          </svg>
          <span className="text-sm text-gray-700">{job.views} views</span>
        </div>

        {job.lastUpdated && (
          <div className="flex items-center gap-2 px-2 py-2 bg-gray-50 rounded-xl">
            <svg className="w-4 h-4" viewBox="0 0 16 17" fill="none">
              <path d="M8.00261 15.6673C4.04927 15.6673 0.835938 12.454 0.835938 8.50065C0.835938 4.54732 4.04927 1.33398 8.00261 1.33398C11.9559 1.33398 15.1693 4.54732 15.1693 8.50065C15.1693 12.454 11.9559 15.6673 8.00261 15.6673ZM8.00261 2.33398C4.60261 2.33398 1.83594 5.10065 1.83594 8.50065C1.83594 11.9007 4.60261 14.6673 8.00261 14.6673C11.4026 14.6673 14.1693 11.9007 14.1693 8.50065C14.1693 5.10065 11.4026 2.33398 8.00261 2.33398Z" fill="#3A404A"/>
              <path d="M10.4711 11.1192C10.3845 11.1192 10.2978 11.0992 10.2178 11.0459L8.15115 9.81253C7.63781 9.50586 7.25781 8.83253 7.25781 8.23919V5.50586C7.25781 5.23253 7.48448 5.00586 7.75781 5.00586C8.03115 5.00586 8.25781 5.23253 8.25781 5.50586V8.23919C8.25781 8.47919 8.45781 8.83253 8.66448 8.95253L10.7311 10.1859C10.9711 10.3259 11.0445 10.6325 10.9045 10.8725C10.8045 11.0325 10.6378 11.1192 10.4711 11.1192Z" fill="#3A404A"/>
            </svg>
            <span className="text-sm text-gray-700">{job.lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Progress Section for drafts */}
      {job.progress && (
        <div className="flex flex-col gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{job.progressText}</p>
        </div>
      )}

      {/* Bottom Section with Avatars and Action Button */}
      <div className="flex items-center justify-between gap-6">
        {/* Avatar Stack */}
        <div className="flex items-center relative h-8">
          <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white -ml-6"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white -ml-6"></div>
        </div>

        {/* Action Button */}
        <div className="flex-1 flex justify-end">
          {job.status === 'draft' ? (
            <button 
              onClick={() => handleFinishPosting(job.id)}
              disabled={publishingJobId === job.id}
              className="flex items-center gap-3 px-6 py-2.5 bg-black bg-opacity-5 hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-black border-opacity-5 text-black font-medium text-sm transition-colors"
            >
              {publishingJobId === job.id ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <path d="M4.61763 16.2676C4.1093 16.2676 3.6343 16.0926 3.29263 15.7676C2.8593 15.3593 2.65097 14.7426 2.72597 14.0759L3.0343 11.3759C3.09263 10.8676 3.40097 10.1926 3.7593 9.82594L10.601 2.58427C12.3093 0.775936 14.0926 0.725936 15.901 2.43427C17.7093 4.1426 17.7593 5.92594 16.051 7.73427L9.2093 14.9759C8.8593 15.3509 8.2093 15.7009 7.70096 15.7843L5.01763 16.2426C4.87597 16.2509 4.75097 16.2676 4.61763 16.2676ZM13.276 2.42594C12.6343 2.42594 12.076 2.82594 11.5093 3.42594L4.66763 10.6759C4.50097 10.8509 4.3093 11.2676 4.27597 11.5093L3.96763 14.2093C3.9343 14.4843 4.00097 14.7093 4.15097 14.8509C4.30097 14.9926 4.52597 15.0426 4.80097 15.0009L7.4843 14.5426C7.72597 14.5009 8.12597 14.2843 8.29263 14.1093L15.1343 6.8676C16.1676 5.7676 16.5426 4.75094 15.0343 3.33427C14.3676 2.6926 13.7926 2.42594 13.276 2.42594Z" fill="#5F42A1"/>
                    <path d="M14.4536 9.12406C14.437 9.12406 14.412 9.12406 14.3953 9.12406C11.7953 8.86573 9.70362 6.89073 9.30362 4.30739C9.25362 3.96573 9.48695 3.64906 9.82862 3.59073C10.1703 3.54073 10.487 3.77406 10.5453 4.11573C10.862 6.13239 12.4953 7.68239 14.5286 7.88239C14.8703 7.91573 15.1203 8.22406 15.087 8.56573C15.0453 8.88239 14.7703 9.12406 14.4536 9.12406Z" fill="#5F42A1"/>
                    <path d="M17.5 18.959H2.5C2.15833 18.959 1.875 18.6757 1.875 18.334C1.875 17.9923 2.15833 17.709 2.5 17.709H17.5C17.8417 17.709 18.125 17.9923 18.125 18.334C18.125 18.6757 17.8417 18.959 17.5 18.959Z" fill="#5F42A1"/>
                  </svg>
                  Finish Posting
                </>
              )}
            </button>
          ) : job.showApplicants ? (
            <button
              onClick={() => toggleProposals(job.id)}
              className="flex items-center gap-3 px-6 py-2.5 bg-black bg-opacity-5 hover:bg-opacity-10 rounded-xl border border-black border-opacity-5 text-black font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                {expandedJobId === job.id ? (
                  <path d="M7.89063 12.7342C7.73229 12.7342 7.57396 12.6759 7.44896 12.5509C6.76562 11.8676 6.39062 10.9592 6.39062 10.0009C6.39062 8.00924 8.00729 6.39258 9.99896 6.39258C10.9573 6.39258 11.8656 6.76758 12.549 7.45091C12.6656 7.56758 12.7323 7.72591 12.7323 7.89258C12.7323 8.05924 12.6656 8.21758 12.549 8.33424L8.33229 12.5509C8.20729 12.6759 8.04896 12.7342 7.89063 12.7342ZM9.99896 7.64258C8.69896 7.64258 7.64062 8.70091 7.64062 10.0009C7.64062 10.4176 7.74896 10.8176 7.94896 11.1676L11.1656 7.95091C10.8156 7.75091 10.4156 7.64258 9.99896 7.64258Z" fill="#5F42A1"/>
                ) : (
                  <>
                    <path d="M9.99896 13.6092C8.00729 13.6092 6.39062 11.9926 6.39062 10.0009C6.39062 8.00924 8.00729 6.39258 9.99896 6.39258C11.9906 6.39258 13.6073 8.00924 13.6073 10.0009C13.6073 11.9926 11.9906 13.6092 9.99896 13.6092ZM9.99896 7.64258C8.69896 7.64258 7.64062 8.70091 7.64062 10.0009C7.64062 11.3009 8.69896 12.3592 9.99896 12.3592C11.299 12.3592 12.3573 11.3009 12.3573 10.0009C12.3573 8.70091 11.299 7.64258 9.99896 7.64258Z" fill="#5F42A1"/>
                    <path d="M9.99844 17.5158C6.8651 17.5158 3.90677 15.6824 1.87344 12.4991C0.990104 11.1241 0.990104 8.88242 1.87344 7.49909C3.9151 4.31576 6.87344 2.48242 9.99844 2.48242C13.1234 2.48242 16.0818 4.31576 18.1151 7.49909C18.9984 8.87409 18.9984 11.1158 18.1151 12.4991C16.0818 15.6824 13.1234 17.5158 9.99844 17.5158ZM9.99844 3.73242C7.30677 3.73242 4.73177 5.34909 2.93177 8.17409C2.30677 9.14909 2.30677 10.8491 2.93177 11.8241C4.73177 14.6491 7.30677 16.2658 9.99844 16.2658C12.6901 16.2658 15.2651 14.6491 17.0651 11.8241C17.6901 10.8491 17.6901 9.14909 17.0651 8.17409C15.2651 5.34909 12.6901 3.73242 9.99844 3.73242Z" fill="#5F42A1"/>
                  </>
                )}
              </svg>
              {expandedJobId === job.id ? 'Hide Proposals' : 'Show Applicants'}
            </button>
          ) : null}
        </div>
      </div>

      {/* Expanded Proposals Section */}
      {expandedJobId === job.id && job.freelancerProposals && (
        <div className="flex gap-4 flex-wrap mt-6">
          {job.freelancerProposals.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight" style={{ fontFamily: 'Manrope' }}>
                Your Jobs
              </h1>
              <p className="text-gray-600 text-base" style={{ fontFamily: 'Poppins' }}>
                Manage all your job posts and freelancer updates in one place.
              </p>
            </div>
            <button
              onClick={() => navigate('/post-job')}
              className="flex items-center gap-3 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M11.5385 1.53846C11.5385 0.6875 10.851 0 10 0C9.14904 0 8.46154 0.6875 8.46154 1.53846V8.46154H1.53846C0.6875 8.46154 0 9.14904 0 10C0 10.851 0.6875 11.5385 1.53846 11.5385H8.46154V18.4615C8.46154 19.3125 9.14904 20 10 20C10.851 20 11.5385 19.3125 11.5385 18.4615V11.5385H18.4615C19.3125 11.5385 20 10.851 20 10C20 9.14904 19.3125 8.46154 18.4615 8.46154H11.5385V1.53846Z" fill="white"/>
              </svg>
              Post a Job
            </button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {error && error !== 'Please log in to view your jobs.' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-8">
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-normal transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
                <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-gray-700 rounded-full">
                  {filterCounts.all}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-normal transition-colors ${
                  activeFilter === 'active'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active
                <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-gray-700 rounded-full">
                  {filterCounts.active}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('drafts')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-normal transition-colors ${
                  activeFilter === 'drafts'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Drafts
                <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-gray-700 rounded-full">
                  {filterCounts.drafts}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-2 rounded-lg text-sm font-normal transition-colors ${
                  activeFilter === 'completed'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-8 mb-12">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600">Loading your jobs...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                {error === 'Please log in to view your jobs.' ? (
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" viewBox="0 0 64 64" fill="none">
                        <path d="M32 8C36.4183 8 40 11.5817 40 16V20H44C46.2091 20 48 21.7909 48 24V48C48 50.2091 46.2091 52 44 52H20C17.7909 52 16 50.2091 16 48V24C16 21.7909 17.7909 20 20 20H24V16C24 11.5817 27.5817 8 32 8ZM32 12C29.7909 12 28 13.7909 28 16V20H36V16C36 13.7909 34.2091 12 32 12ZM32 32C33.6569 32 35 33.3431 35 35C35 36.6569 33.6569 38 32 38C30.3431 38 29 36.6569 29 35C29 33.3431 30.3431 32 32 32Z" fill="currentColor"/>
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h3>
                      <p className="text-gray-600 mb-6">Please log in to view your jobs.</p>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate('/client-portal')}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => navigate('/client-portal')}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-red-600 mb-4">{error}</div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600 mb-4">
                  {activeFilter === 'all' 
                    ? "You haven't posted any jobs yet."
                    : `No ${activeFilter} jobs found.`
                  }
                </div>
                {activeFilter === 'all' && (
                  <button
                    onClick={() => navigate('/post-job')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Post Your First Job
                  </button>
                )}
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-6 border border-gray-200 rounded-3xl shadow-sm bg-white">
            <h2 className="text-xl font-normal text-gray-800 mb-6" style={{ fontFamily: 'DM Sans' }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => navigate('/post-job')}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                  <svg className="w-3.5 h-4" viewBox="0 0 14 16" fill="none">
                    <path d="M8 2.5C8 1.94687 7.55312 1.5 7 1.5C6.44688 1.5 6 1.94687 6 2.5V7H1.5C0.946875 7 0.5 7.44688 0.5 8C0.5 8.55312 0.946875 9 1.5 9H6V13.5C6 14.0531 6.44688 14.5 7 14.5C7.55312 14.5 8 14.0531 8 13.5V9H12.5C13.0531 9 13.5 8.55312 13.5 8C13.5 7.44688 13.0531 7 12.5 7H8V2.5Z" fill="#FF6B35"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-purple-600 mb-1">Post a New Job</h3>
                  <p className="text-sm text-gray-600">Create a job listing</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <svg className="w-5 h-4" viewBox="0 0 21 16" fill="none">
                    <path d="M3.33594 4C3.33594 2.93913 3.75736 1.92172 4.50751 1.17157C5.25766 0.421427 6.27507 0 7.33594 0C8.3968 0 9.41422 0.421427 10.1644 1.17157C10.9145 1.92172 11.3359 2.93913 11.3359 4C11.3359 5.06087 10.9145 6.07828 10.1644 6.82843C9.41422 7.57857 8.3968 8 7.33594 8C6.27507 8 5.25766 7.57857 4.50751 6.82843C3.75736 6.07828 3.33594 5.06087 3.33594 4ZM0.335938 15.0719C0.335938 11.9937 2.82969 9.5 5.90781 9.5H8.76406C11.8422 9.5 14.3359 11.9937 14.3359 15.0719C14.3359 15.5844 13.9203 16 13.4078 16H1.26406C0.751563 16 0.335938 15.5844 0.335938 15.0719ZM19.3766 16H15.0672C15.2359 15.7063 15.3359 15.3656 15.3359 15V14.75C15.3359 12.8531 14.4891 11.15 13.1547 10.0063C13.2297 10.0031 13.3016 10 13.3766 10H15.2953C18.0797 10 20.3359 12.2562 20.3359 15.0406C20.3359 15.5719 19.9047 16 19.3766 16ZM13.8359 8C12.8672 8 11.9922 7.60625 11.3578 6.97188C11.9734 6.14062 12.3359 5.1125 12.3359 4C12.3359 3.1625 12.1297 2.37188 11.7641 1.67813C12.3453 1.25312 13.0609 1 13.8359 1C15.7703 1 17.3359 2.56562 17.3359 4.5C17.3359 6.43437 15.7703 8 13.8359 8Z" fill="#4361EE"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-purple-600 mb-1">Browse Freelancers</h3>
                  <p className="text-sm text-gray-600">Find creative talent</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                  <svg className="w-3 h-4" viewBox="0 0 13 16" fill="none">
                    <path d="M9.95156 7.77812C10.4016 7.13437 10.6641 6.35 10.6641 5.5C10.6641 3.29063 8.87344 1.5 6.66406 1.5C4.45469 1.5 2.66406 3.29063 2.66406 5.5C2.66406 6.35 2.92656 7.13437 3.37656 7.77812C3.49219 7.94375 3.62969 8.13125 3.77656 8.33125C4.17969 8.88438 4.66094 9.54688 5.02031 10.2C5.34531 10.7937 5.51094 11.4125 5.59219 11.9969H4.07031C4.00156 11.6219 3.88594 11.2562 3.70156 10.9187C3.39219 10.3562 3.00781 9.82812 2.62344 9.3C2.46094 9.07812 2.29844 8.85625 2.14219 8.63125C1.52656 7.74688 1.16406 6.66563 1.16406 5.5C1.16406 2.4625 3.62656 0 6.66406 0C9.70156 0 12.1641 2.4625 12.1641 5.5C12.1641 6.66563 11.8016 7.74687 11.1828 8.63437C11.0266 8.85938 10.8641 9.08125 10.7016 9.30313C10.3172 9.82812 9.93281 10.3562 9.62344 10.9219C9.43906 11.2594 9.32344 11.625 9.25469 12H7.73906C7.82031 11.4156 7.98594 10.7937 8.31094 10.2031C8.67031 9.55 9.15156 8.8875 9.55469 8.33438C9.70156 8.13438 9.83594 7.94688 9.95156 7.78125V7.77812ZM6.66406 4C5.83594 4 5.16406 4.67188 5.16406 5.5C5.16406 5.775 4.93906 6 4.66406 6C4.38906 6 4.16406 5.775 4.16406 5.5C4.16406 4.11875 5.28281 3 6.66406 3C6.93906 3 7.16406 3.225 7.16406 3.5C7.16406 3.775 6.93906 4 6.66406 4ZM6.66406 16C5.28281 16 4.16406 14.8813 4.16406 13.5V13H9.16406V13.5C9.16406 14.8813 8.04531 16 6.66406 16Z" fill="#9A48D0"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-purple-600 mb-1">Get Inspired</h3>
                  <p className="text-sm text-gray-600">See top projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

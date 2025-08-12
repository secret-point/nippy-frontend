import { useState } from 'react'
import { JobDetailsModal } from '../components/JobDetailsModal'
import { ResolveFlagModal } from '../components/ResolveFlagModal'
import { TakeDownJobModal } from '../components/TakeDownJobModal'

interface Job {
  id: string
  title: string
  client: string
  status: 'Open' | 'In Progress' | 'Completed' | 'Flagged'
  price: string
  postedDate: string
  flags?: Array<{
    type: string
    reason: string
    flaggedBy: string
    flaggedDate: string
  }>
  alerts?: Array<{
    type: 'warning' | 'info' | 'error'
    text: string
  }>
  freelancer?: string
  category?: string
  description?: string
  skills?: string[]
  timeline?: {
    posted: string
    deadline: string
    completed?: string
  }
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Website Redesign Project',
    client: 'Acme Inc.',
    status: 'Open',
    price: '$2,500',
    postedDate: '2 days ago',
    category: 'Web Development',
    description: 'Complete redesign of company website with modern UI/UX',
    skills: ['React', 'TypeScript', 'TailwindCSS'],
    timeline: {
      posted: '2023-06-10',
      deadline: '2023-07-15'
    }
  },
  {
    id: '2',
    title: 'Mobile App Development',
    client: 'TechCorp',
    status: 'In Progress',
    price: '$5,000',
    postedDate: '2 days ago',
    freelancer: 'John Doe',
    category: 'Mobile Development',
    description: 'Native iOS and Android app development',
    skills: ['React Native', 'TypeScript', 'Firebase'],
    timeline: {
      posted: '2023-06-08',
      deadline: '2023-08-01'
    },
    flags: [{
      type: 'Scope disagreement',
      reason: 'Client and freelancer have different understanding of project scope',
      flaggedBy: 'Freelancer',
      flaggedDate: '2023-06-18'
    }],
    alerts: [
      { type: 'warning', text: 'Scope disagreement' },
      { type: 'info', text: 'Potential terms violation' }
    ]
  },
  {
    id: '3',
    title: 'Logo Design',
    client: 'StartupXYZ',
    status: 'Completed',
    price: '$500',
    postedDate: '1 week ago',
    freelancer: 'Sarah Miller',
    category: 'Graphic Design',
    description: 'Modern logo design for tech startup',
    skills: ['Adobe Illustrator', 'Logo Design', 'Branding'],
    timeline: {
      posted: '2023-06-03',
      deadline: '2023-06-17',
      completed: '2023-06-15'
    }
  },
  {
    id: '4',
    title: 'Content Writing for Blog',
    client: 'BlogMaster',
    status: 'Flagged',
    price: '$1,200',
    postedDate: '2 days ago',
    category: 'Content Writing',
    description: 'Weekly blog posts for marketing website',
    skills: ['Content Writing', 'SEO', 'Marketing'],
    timeline: {
      posted: '2023-06-12',
      deadline: '2023-07-12'
    },
    flags: [{
      type: 'Potential terms violation',
      reason: 'Content requirements may violate platform guidelines',
      flaggedBy: 'System',
      flaggedDate: '2023-06-15'
    }],
    alerts: [
      { type: 'info', text: 'Potential terms violation' }
    ]
  },
  {
    id: '5',
    title: 'SEO Optimization',
    client: 'GrowthHackers',
    status: 'In Progress',
    price: '$1,800',
    postedDate: '2 days ago',
    freelancer: 'Mike Johnson',
    category: 'Digital Marketing',
    description: 'Complete SEO audit and optimization',
    skills: ['SEO', 'Analytics', 'Technical SEO'],
    timeline: {
      posted: '2023-06-10',
      deadline: '2023-07-20'
    },
    flags: [{
      type: 'Payment issue',
      reason: 'Payment processing failed multiple times',
      flaggedBy: 'System',
      flaggedDate: '2023-06-20'
    }],
    alerts: [
      { type: 'error', text: 'Failed transaction' }
    ]
  },
  {
    id: '6',
    title: 'Video Editing Project',
    client: 'MediaPro',
    status: 'Completed',
    price: '$2,200',
    postedDate: '2 weeks ago',
    freelancer: 'Alex Chen',
    category: 'Video Production',
    description: 'Professional video editing for marketing campaign',
    skills: ['Video Editing', 'After Effects', 'Color Grading'],
    timeline: {
      posted: '2023-05-28',
      deadline: '2023-06-18',
      completed: '2023-06-16'
    }
  }
]

export const JobManagement = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showTakeDownModal, setShowTakeDownModal] = useState(false)
  const [jobToResolve, setJobToResolve] = useState<Job | null>(null)
  const [jobToTakeDown, setJobToTakeDown] = useState<Job | null>(null)

  const tabs = [
    { id: 'all', label: 'All Jobs', count: mockJobs.length },
    { id: 'flagged', label: 'Flagged Jobs', count: mockJobs.filter(job => job.status === 'Flagged' || job.flags?.length).length },
    { id: 'open', label: 'Open', count: mockJobs.filter(job => job.status === 'Open').length },
    { id: 'progress', label: 'In Progress', count: mockJobs.filter(job => job.status === 'In Progress').length },
    { id: 'completed', label: 'Completed', count: mockJobs.filter(job => job.status === 'Completed').length }
  ]

  const getFilteredJobs = () => {
    let filtered = mockJobs

    // Filter by tab
    switch (activeTab) {
      case 'flagged':
        filtered = filtered.filter(job => job.status === 'Flagged' || job.flags?.length)
        break
      case 'open':
        filtered = filtered.filter(job => job.status === 'Open')
        break
      case 'progress':
        filtered = filtered.filter(job => job.status === 'In Progress')
        break
      case 'completed':
        filtered = filtered.filter(job => job.status === 'Completed')
        break
      default:
        break
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.client.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'In Progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Flagged':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-300'
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-300'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-300'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300'
    }
  }

  const handleResolveFlag = (job: Job) => {
    setJobToResolve(job)
    setShowResolveModal(true)
  }

  const handleTakeDownJob = (job: Job) => {
    setJobToTakeDown(job)
    setShowTakeDownModal(true)
  }

  const flaggedJobsCount = mockJobs.filter(job => job.status === 'Flagged' || job.flags?.length).length

  const filteredJobs = getFilteredJobs()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 font-manrope tracking-tight">Job Management</h1>
        <p className="text-lg text-gray-600 font-poppins">View and manage all platform jobs</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Tabs and Search */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {/* Tabs */}
          <div className="flex items-center bg-white rounded-lg">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex flex-col items-center">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
                {activeTab === tab.id && (
                  <div className="w-full h-0.5 bg-purple-600 rounded-full mt-1" />
                )}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-56 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {flaggedJobsCount > 0 && (
                <div className="ml-4 flex items-center justify-center w-8 h-8 bg-red-50 border border-red-200 rounded-full">
                  <span className="text-sm font-medium text-red-600">{flaggedJobsCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="divide-y divide-gray-200">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`p-6 ${job.flags?.length || job.status === 'Flagged' ? 'bg-red-50' : ''}`}
            >
              {/* Job Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-purple-600">{job.title}</h3>
                    {job.status === 'Flagged' && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 border border-red-200 rounded-full">
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Client: {job.client}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <span className="text-sm text-gray-500">{job.price}</span>
                </div>
              </div>

              {/* Job Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Posted {job.postedDate}</span>
                  {job.alerts?.map((alert, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded border ${getAlertColor(alert.type)}`}
                    >
                      {alert.type === 'warning' && (
                        <svg className="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {alert.type === 'info' && (
                        <svg className="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                      {alert.type === 'error' && (
                        <svg className="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      {alert.text}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>

                  {(job.flags?.length || job.status === 'Flagged') && (
                    <>
                      <button
                        onClick={() => handleResolveFlag(job)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Resolve Flag
                      </button>
                      <button
                        onClick={() => handleTakeDownJob(job)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Take Down Job
                      </button>
                    </>
                  )}

                  {job.status === 'In Progress' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>

              {/* Flag Details */}
              {job.flags?.map((flag, index) => (
                <div key={index} className="mt-3 p-3 bg-red-25 border border-red-200 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium text-red-700">Flag reason:</span>
                    <span className="text-red-700"> {flag.reason}</span>
                    <span className="text-gray-600"> (Flagged by {flag.flaggedBy} on {flag.flaggedDate})</span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {showResolveModal && jobToResolve && (
        <ResolveFlagModal
          job={jobToResolve}
          onClose={() => {
            setShowResolveModal(false)
            setJobToResolve(null)
          }}
          onConfirm={() => {
            // Handle resolve flag
            console.log('Resolving flag for:', jobToResolve.title)
            setShowResolveModal(false)
            setJobToResolve(null)
          }}
        />
      )}

      {showTakeDownModal && jobToTakeDown && (
        <TakeDownJobModal
          job={jobToTakeDown}
          onClose={() => {
            setShowTakeDownModal(false)
            setJobToTakeDown(null)
          }}
          onConfirm={() => {
            // Handle take down job
            console.log('Taking down job:', jobToTakeDown.title)
            setShowTakeDownModal(false)
            setJobToTakeDown(null)
          }}
        />
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { Modal } from './ui/Modal'
import { Tabs } from './ui/Tabs'

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

interface JobDetailsModalProps {
  job: Job
  onClose: () => void
}

interface Client {
  name: string
  id: string
  avatar: string
}

interface Freelancer {
  name: string
  rating: number
  memberSince: string
  avatar: string
}

const mockClient: Client = {
  name: 'StartupXYZ',
  id: '#103',
  avatar: 'S'
}

const mockFreelancer: Freelancer = {
  name: 'Sarah Miller',
  rating: 4.9,
  memberSince: '2021-11-05',
  avatar: 'SM'
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'flagHistory', label: 'Flag History' },
    { id: 'paymentHistory', label: 'Payment History' },
    { id: 'adminAction', label: 'Admin Action' }
  ]

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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Left Column - Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-600">Job Description</h3>
            <p className="text-sm text-gray-700">
              {job.description || 'Design a modern, versatile logo that captures our brand identity as a tech startup focused on sustainability and innovation.'}
            </p>
          </div>

          {/* Required Skills */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-600">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(job.skills || ['Logo Design', 'Branding', 'Adobe Illustrator', 'Vector Graphics']).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-600">Timeline</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-600">Posted</span>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">
                      {job.timeline?.posted || '2023-06-10'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Deadline</span>
                  <div className="flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">
                      {job.timeline?.deadline || '2023-06-25'}
                    </span>
                  </div>
                </div>
                {job.timeline?.completed && (
                  <div>
                    <span className="text-xs text-gray-600">Completed</span>
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">
                        {job.timeline.completed}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Client & Freelancer Info */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs font-medium text-gray-800 mb-3">Client Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs font-medium text-purple-600">{mockClient.name}</span>
              </div>
              <div className="text-xs text-gray-600">Client ID: {mockClient.id}</div>
              <button className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Client Profile
              </button>
            </div>
          </div>

          {/* Freelancer Information */}
          {job.freelancer && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-xs font-medium text-gray-800 mb-3">Assigned Freelancer</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs font-medium text-purple-600">{mockFreelancer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-xs text-gray-700">{mockFreelancer.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">·</span>
                  <span className="text-xs text-gray-600">Member since {mockFreelancer.memberSince}</span>
                </div>
                <button className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Freelancer Profile
                </button>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs font-medium text-gray-800 mb-2">Category</h4>
            <span className="text-xs text-gray-700">{job.category || 'Graphic Design'}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Message Parties
          </button>
        </div>
      </div>
    </div>
  )

  const renderFlagHistory = () => (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-700">Flag History</h3>
      {job.flags && job.flags.length > 0 ? (
        <div className="space-y-3">
          {job.flags.map((flag, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-red-900">{flag.type}</h4>
                  <p className="text-sm text-red-700 mt-1">{flag.reason}</p>
                  <p className="text-xs text-red-600 mt-2">
                    Flagged by {flag.flaggedBy} on {flag.flaggedDate}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No flags found for this job.</p>
        </div>
      )}
    </div>
  )

  const renderPaymentHistory = () => (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-700">Payment History</h3>
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No payment history available.</p>
      </div>
    </div>
  )

  const renderAdminAction = () => (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-700">Admin Actions</h3>
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No admin actions recorded.</p>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'flagHistory':
        return renderFlagHistory()
      case 'paymentHistory':
        return renderPaymentHistory()
      case 'adminAction':
        return renderAdminAction()
      default:
        return renderOverview()
    }
  }

  const tabItems = tabs.map(tab => ({
    id: tab.id,
    label: tab.label
  }))

  const headerContent = (
    <div className="flex items-center gap-3">
      <div>
        <h2 className="font-medium text-gray-700">Job #{job.id}: {job.title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
          <span className="text-sm text-gray-600">{job.price}</span>
        </div>
      </div>
    </div>
  )

  const footerContent = (
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Close
      </button>
    </div>
  )

  return (
    <Modal 
      isOpen={true}
      onClose={onClose}
      size="xl"
      footer={footerContent}
    >
      {headerContent}
      
      <div className="mt-6">
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="underline"
        />
      </div>
      
      <div className="mt-6 max-h-[450px] overflow-y-auto">
        {renderTabContent()}
      </div>
    </Modal>
  )
}

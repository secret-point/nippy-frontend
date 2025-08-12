import React, { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  userType: 'Freelancer' | 'Client'
  status: 'Active' | 'Pending' | 'Suspended'
  rating: number
  joinedDate: string
  avatar: string
}

interface ViewDetailsModalProps {
  user: User
  onClose: () => void
}

interface Job {
  id: string
  title: string
  role: string
  client: string
  status: 'Completed' | 'In Progress'
  date: string
  amount: string
}

interface Payment {
  id: string
  amount: string
  status: 'Paid' | 'Pending'
  date: string
  job: string
}

interface ChatMessage {
  id: string
  company: string
  message: string
  date: string
  hasUnread?: boolean
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Website Redesign',
    role: 'Freelancer',
    client: 'Acme Corp',
    status: 'Completed',
    date: 'Feb 15, 2023',
    amount: '$1,200'
  },
  {
    id: '2',
    title: 'Logo Design',
    role: 'Freelancer',
    client: 'TechStart',
    status: 'In Progress',
    date: 'Mar 5, 2023',
    amount: '$400'
  }
]

const mockPayments: Payment[] = [
  {
    id: '1',
    amount: '$1,200',
    status: 'Paid',
    date: 'Feb 15, 2023',
    job: 'Website Redesign'
  },
  {
    id: '2',
    amount: '$200',
    status: 'Pending',
    date: 'Mar 5, 2023',
    job: 'Logo Design (Milestone 1)'
  }
]

const mockChats: ChatMessage[] = [
  {
    id: '1',
    company: 'Acme Corp',
    message: 'Thanks for the great work!',
    date: 'Feb 21, 2023'
  },
  {
    id: '2',
    company: 'TechStart',
    message: 'Can you send me the latest draft?',
    date: 'Mar 8, 2023',
    hasUnread: true
  }
]

export const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('jobs')

  const tabs = [
    { id: 'jobs', label: 'Jobs History' },
    { id: 'payment', label: 'Payment' },
    { id: 'flags', label: 'Flags & Disputes' },
    { id: 'chat', label: 'Chat History' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Paid':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'In Progress':
      case 'Pending':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'Freelancer':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Client':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const renderJobsHistory = () => (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700">Job History</h3>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div>Job Title</div>
          <div>Role</div>
          <div>Client/Freelancer</div>
          <div>Status</div>
          <div>Date</div>
          <div>Amount</div>
        </div>
        {/* Table Rows */}
        {mockJobs.map((job) => (
          <div key={job.id} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 text-sm">
            <div className="font-medium text-gray-900">{job.title}</div>
            <div className="text-gray-500">{job.role}</div>
            <div className="text-gray-500">{job.client}</div>
            <div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
            </div>
            <div className="text-gray-500">{job.date}</div>
            <div className="text-gray-500">{job.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPaymentHistory = () => (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700">Payment History</h3>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div>Amount</div>
          <div>Status</div>
          <div>Date</div>
          <div>Job</div>
        </div>
        {/* Table Rows */}
        {mockPayments.map((payment) => (
          <div key={payment.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 text-sm">
            <div className="font-medium text-gray-900">{payment.amount}</div>
            <div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                {payment.status}
              </span>
            </div>
            <div className="text-gray-500">{payment.date}</div>
            <div className="text-gray-500">{payment.job}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderFlagsDisputes = () => (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700">Flags & Disputes</h3>
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">No flags or disputes found.</p>
      </div>
    </div>
  )

  const renderChatHistory = () => (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700">Chat History</h3>
      <div className="space-y-4">
        {mockChats.map((chat) => (
          <div key={chat.id} className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-500">{chat.company[0]}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{chat.company}</h4>
                <p className="text-sm text-gray-600">{chat.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{chat.date}</span>
              {chat.hasUnread && (
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              )}
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View Full Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return renderJobsHistory()
      case 'payment':
        return renderPaymentHistory()
      case 'flags':
        return renderFlagsDisputes()
      case 'chat':
        return renderChatHistory()
      default:
        return renderJobsHistory()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-500">{user.avatar}</span>
            </div>
            <div>
              <h2 className="font-medium text-gray-900">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{user.email}</span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getUserTypeColor(user.userType)}`}>
                  {user.userType}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 py-3">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-purple-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-96 overflow-y-auto">
          {renderTabContent()}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

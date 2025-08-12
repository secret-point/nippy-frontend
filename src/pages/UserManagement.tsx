import { useState } from 'react'
import { ViewDetailsModal } from '../components/ViewDetailsModal'

interface User {
  id: string
  name: string
  email: string
  userType: 'Freelancer' | 'Client'
  status: 'Active' | 'Pending' | 'Suspended'
  rating: number
  joinedDate: string
  avatar: string
  disputes?: { type: string; count: number; status: string }[]
  flags?: { type: string; count: number; status: string }[]
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    userType: 'Freelancer',
    status: 'Pending',
    rating: 4.8,
    joinedDate: 'Jan 10, 2023',
    avatar: 'J'
  },
  {
    id: '2',
    name: 'Cody Fishe',
    email: 'cody.fisher@example.com',
    userType: 'Client',
    status: 'Active',
    rating: 4.8,
    joinedDate: 'Jan 10, 2023',
    avatar: 'C',
    disputes: [{ type: 'Payment dispute', count: 3, status: 'open' }]
  },
  {
    id: '3',
    name: 'Cody Fishe',
    email: 'cody.fisher@example.com',
    userType: 'Freelancer',
    status: 'Active',
    rating: 4.8,
    joinedDate: 'Jan 10, 2023',
    avatar: 'C',
    flags: [{ type: 'Multiple reports', count: 2, status: 'flags' }]
  },
  {
    id: '4',
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    userType: 'Freelancer',
    status: 'Pending',
    rating: 4.8,
    joinedDate: 'Jan 10, 2023',
    avatar: 'J'
  },
  {
    id: '5',
    name: 'Cody Fishe',
    email: 'cody.fisher@example.com',
    userType: 'Client',
    status: 'Active',
    rating: 4.8,
    joinedDate: 'Jan 10, 2023',
    avatar: 'C',
    disputes: [{ type: 'Payment dispute', count: 3, status: 'open' }],
    flags: [{ type: 'Payment dispute', count: 2, status: 'flags' }]
  }
]

const filterButtons = [
  { id: 'all', label: 'All Users', active: true },
  { id: 'disputes', label: 'Active Disputes', count: 2, color: 'orange' },
  { id: 'flagged', label: 'Flagged Users', count: 2, color: 'red' },
  { id: 'suspicious', label: 'Suspicious Activity', count: 2, color: 'purple' },
  { id: 'pending', label: 'Pending Approval', count: 3, color: 'yellow' },
  { id: 'suspended', label: 'Suspended', count: 1, color: 'gray' }
]

export const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Suspended':
        return 'bg-gray-100 text-gray-700 border-gray-200'
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

  const getFilterColor = (color: string) => {
    switch (color) {
      case 'orange':
        return 'bg-orange-100 text-orange-600'
      case 'red':
        return 'bg-red-100 text-red-600'
      case 'purple':
        return 'bg-purple-100 text-purple-600'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600'
      case 'gray':
        return 'bg-gray-600 text-white'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-2 font-manrope -tracking-wide">User Management</h1>
        <p className="text-lg text-gray-600">Approve, reject, verify, and manage platform users</p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Users Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-medium text-black">Users</h2>
            <p className="text-sm text-gray-600">Manage all platform users</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <span className="text-xs text-gray-600">Filter by:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {filterButtons.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                    filter.active || activeFilter === filter.id
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-gray-200 text-gray-700 border-gray-300'
                  }`}
                >
                  {filter.id === 'disputes' && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.179 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                  {filter.id === 'flagged' && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {filter.id === 'suspicious' && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  <span>{filter.label}</span>
                  {filter.count && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${getFilterColor(filter.color || 'gray')}`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="divide-y divide-gray-200">
          {mockUsers.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-500">{user.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{user.email}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getUserTypeColor(user.userType)}`}>
                        {user.userType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">{user.rating}</span>
                  </div>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-sm font-medium hover:bg-purple-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Joined on {user.joinedDate}</span>
                  {user.disputes && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <svg className="w-3 h-3 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-yellow-600">{user.disputes[0].type}</span>
                      <span className="font-semibold text-yellow-600">{user.disputes[0].count} {user.disputes[0].status}</span>
                    </div>
                  )}
                  {user.flags && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs">
                      <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-600">{user.flags[0].type}</span>
                      <span className="font-semibold text-red-600">{user.flags[0].count} flags</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded border-0 hover:bg-blue-700 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded border-0 hover:bg-red-700 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded border-0 hover:bg-green-700 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verify KYC
                  </button>
                  <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded border-0 hover:bg-yellow-700 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Suspend
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 flex items-center gap-1">
                    <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Add Note
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 flex items-center gap-1">
                    <svg className="w-3 h-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Escalate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Details Modal */}
      {selectedUser && (
        <ViewDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}

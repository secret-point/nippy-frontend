import React from 'react'

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
}

interface ResolveFlagModalProps {
  job: Job
  onClose: () => void
  onConfirm: () => void
}

export const ResolveFlagModal: React.FC<ResolveFlagModalProps> = ({ job, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200">
          {/* Icon */}
          <div className="flex items-center justify-center w-9 h-9 bg-purple-100 rounded-full flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-1">Resolve Flag</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to resolve the flag for "{job.title}"? This will mark the job as reviewed and remove it from the flagged list.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Resolve Flag
          </button>
        </div>
      </div>
    </div>
  )
}

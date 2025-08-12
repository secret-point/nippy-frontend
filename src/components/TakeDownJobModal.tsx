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

interface TakeDownJobModalProps {
  job: Job
  onClose: () => void
  onConfirm: () => void
}

export const TakeDownJobModal: React.FC<TakeDownJobModalProps> = ({ job, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200">
          {/* Icon */}
          <div className="flex items-center justify-center w-9 h-9 bg-red-100 rounded-full flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-1">Take Down Job</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to take down "{job.title}"? This will remove the job from the platform and notify the client.
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
            className="px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Take Down
          </button>
        </div>
      </div>
    </div>
  )
}

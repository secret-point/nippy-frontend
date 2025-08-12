import React from 'react'

interface HireModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  freelancerName: string
  freelancerTitle: string
  jobTitle: string
  jobId: string
}

export const HireModal: React.FC<HireModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  freelancerName,
  freelancerTitle,
  jobTitle,
  jobId
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex-1 pr-4">
            Hire {freelancerName} for this job?
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d="M10.7066 4.70625C11.0973 4.31562 11.0973 3.68125 10.7066 3.29062C10.316 2.9 9.68164 2.9 9.29102 3.29062L6.00039 6.58437L2.70664 3.29375C2.31602 2.90312 1.68164 2.90312 1.29102 3.29375C0.900391 3.68437 0.900391 4.31875 1.29102 4.70937L4.58477 8L1.29414 11.2937C0.903516 11.6844 0.903516 12.3188 1.29414 12.7094C1.68477 13.1 2.31914 13.1 2.70977 12.7094L6.00039 9.41562L9.29414 12.7062C9.68477 13.0969 10.3191 13.0969 10.7098 12.7062C11.1004 12.3156 11.1004 11.6812 10.7098 11.2906L7.41602 8L10.7066 4.70625Z" 
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Job Details */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Job Title: <span className="underline">{jobTitle}</span> • ID: {jobId}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Ready to get started with this freelancer on your project? Each job is linked to one freelancer to keep things simple and clear.
          </p>

          {/* Freelancer Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{freelancerName}</h3>
              <p className="text-sm text-gray-600">{freelancerTitle}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 21 20" fill="none">
              <path 
                d="M7.83268 13.25L4.33268 9.75001L3.16602 10.9167L7.83268 15.5833L17.8327 5.58334L16.666 4.41667L7.83268 13.25Z" 
                fill="white"
              />
            </svg>
            Hire & Start Project
          </button>
          
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M7.33268 13.25L3.83268 9.74999L2.66602 10.9167L7.33268 15.5833L17.3327 5.58332L16.166 4.41666L7.33268 13.25Z" 
                fill="currentColor"
              />
            </svg>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

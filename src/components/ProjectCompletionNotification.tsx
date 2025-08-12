import React from 'react'

interface ProjectCompletionNotificationProps {
  freelancerName: string
  onPreviewFiles: () => void
  onApproveAndPay: () => void
  onRequestRevisions: () => void
}

export const ProjectCompletionNotification: React.FC<ProjectCompletionNotificationProps> = ({
  freelancerName,
  onPreviewFiles,
  onApproveAndPay,
  onRequestRevisions
}) => {
  return (
    <div className="p-4 mx-6 mb-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm">
      <div className="flex items-start gap-3">
        {/* Check Icon */}
        <div className="flex-shrink-0 w-5 h-5 mt-1">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 21" 
            fill="none" 
            className="w-5 h-5"
          >
            <g clipPath="url(#clip0_5_39277)">
              <path 
                d="M10 20.5C12.6522 20.5 15.1957 19.4464 17.0711 17.5711C18.9464 15.6957 20 13.1522 20 10.5C20 7.84784 18.9464 5.3043 17.0711 3.42893C15.1957 1.55357 12.6522 0.5 10 0.5C7.34784 0.5 4.8043 1.55357 2.92893 3.42893C1.05357 5.3043 0 7.84784 0 10.5C0 13.1522 1.05357 15.6957 2.92893 17.5711C4.8043 19.4464 7.34784 20.5 10 20.5ZM14.4141 8.66406L9.41406 13.6641C9.04688 14.0312 8.45312 14.0312 8.08984 13.6641L5.58984 11.1641C5.22266 10.7969 5.22266 10.2031 5.58984 9.83984C5.95703 9.47656 6.55078 9.47266 6.91406 9.83984L8.75 11.6758L13.0859 7.33594C13.4531 6.96875 14.0469 6.96875 14.4102 7.33594C14.7734 7.70312 14.7773 8.29687 14.4102 8.66016L14.4141 8.66406Z" 
                fill="#F39C12"
              />
            </g>
            <defs>
              <clipPath id="clip0_5_39277">
                <path d="M0 0.5H20V20.5H0V0.5Z" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <h3 className="text-lg font-medium text-gray-800">
            {freelancerName} has marked this job as complete.
          </h3>

          {/* Description */}
          <div className="space-y-1">
            <p className="text-gray-700">
              Please take a moment to review the final files before you approve and proceed to payment.
            </p>
            <p className="text-sm text-gray-600">
              Make sure all final assets are delivered as expected before approving.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onPreviewFiles}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_5_39289)">
                  <path 
                    d="M13 6.5C13 7.93437 12.5344 9.25938 11.75 10.3344L15.7063 14.2937C16.0969 14.6844 16.0969 15.3188 15.7063 15.7094C15.3156 16.1 14.6812 16.1 14.2906 15.7094L10.3344 11.75C9.25938 12.5375 7.93437 13 6.5 13C2.90937 13 0 10.0906 0 6.5C0 2.90937 2.90937 0 6.5 0C10.0906 0 13 2.90937 13 6.5ZM6.5 11C7.09095 11 7.67611 10.8836 8.22208 10.6575C8.76804 10.4313 9.26412 10.0998 9.68198 9.68198C10.0998 9.26412 10.4313 8.76804 10.6575 8.22208C10.8836 7.67611 11 7.09095 11 6.5C11 5.90905 10.8836 5.32389 10.6575 4.77792C10.4313 4.23196 10.0998 3.73588 9.68198 3.31802C9.26412 2.90016 8.76804 2.56869 8.22208 2.34254C7.67611 2.1164 7.09095 2 6.5 2C5.90905 2 5.32389 2.1164 4.77792 2.34254C4.23196 2.56869 3.73588 2.90016 3.31802 3.31802C2.90016 3.73588 2.56869 4.23196 2.34254 4.77792C2.1164 5.32389 2 5.90905 2 6.5C2 7.09095 2.1164 7.67611 2.34254 8.22208C2.56869 8.76804 2.90016 9.26412 3.31802 9.68198C3.73588 10.0998 4.23196 10.4313 4.77792 10.6575C5.32389 10.8836 5.90905 11 6.5 11Z" 
                    fill="#374151"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5_39289">
                    <path d="M0 0H16V16H0V0Z" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              Preview Files
            </button>

            <button
              onClick={onApproveAndPay}
              className="flex items-center gap-2 px-4 py-2.5 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
            >
              <svg width="14" height="16" viewBox="0 0 15 16" fill="none">
                <g clipPath="url(#clip0_5_39295)">
                  <path 
                    d="M14.1754 3.29376C14.566 3.68439 14.566 4.31876 14.1754 4.70939L6.17539 12.7094C5.78477 13.1 5.15039 13.1 4.75977 12.7094L0.759766 8.70939C0.369141 8.31876 0.369141 7.68439 0.759766 7.29376C1.15039 6.90314 1.78477 6.90314 2.17539 7.29376L5.46914 10.5844L12.7629 3.29376C13.1535 2.90314 13.7879 2.90314 14.1785 3.29376H14.1754Z" 
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5_39295">
                    <path d="M0.46875 0H14.4688V16H0.46875V0Z" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              Approve & Pay
            </button>

            <button
              onClick={onRequestRevisions}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 17 16" fill="none">
                <g clipPath="url(#clip0_5_39301)">
                  <path 
                    d="M6.82812 1.08752C7.1875 1.24689 7.42188 1.60627 7.42188 2.00002V4.00002H10.9219C13.9594 4.00002 16.4219 6.46252 16.4219 9.50002C16.4219 13.0406 13.875 14.6219 13.2906 14.9406C13.2125 14.9844 13.125 15 13.0375 15C12.6969 15 12.4219 14.7219 12.4219 14.3844C12.4219 14.15 12.5562 13.9344 12.7281 13.775C13.0219 13.5 13.4219 12.95 13.4219 12.0031C13.4219 10.3469 12.0781 9.00314 10.4219 9.00314H7.42188V11.0031C7.42188 11.3969 7.19063 11.7563 6.82812 11.9156C6.46562 12.075 6.04688 12.0094 5.75313 11.7469L0.753125 7.24689C0.54375 7.05314 0.421875 6.78439 0.421875 6.50002C0.421875 6.21564 0.54375 5.94689 0.753125 5.75627L5.75313 1.25627C6.04688 0.990644 6.46875 0.925019 6.82812 1.08752Z" 
                    fill="#374151"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5_39301">
                    <path d="M0.421875 0H16.4219V16H0.421875V0Z" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              Request Revisions
            </button>
          </div>

          {/* Note */}
          <p className="text-sm text-gray-600 border-t border-yellow-200 pt-4">
            <strong>Note:</strong> You can only preview files for now, once the payment is done, the files will be unlocked for download
          </p>
        </div>
      </div>
    </div>
  )
}

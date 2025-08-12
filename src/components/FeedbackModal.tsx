import React, { useState } from 'react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  freelancerName: string
  onSubmit: (feedback: FeedbackData) => void
}

interface FeedbackData {
  rating: number
  comment: string
  attributes: string[]
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  freelancerName,
  onSubmit
}) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])

  const attributes = [
    'Met deadline',
    'Communicative',
    'High quality',
    'Would hire again',
    'Easy to work with'
  ]

  const handleAttributeToggle = (attribute: string) => {
    setSelectedAttributes(prev =>
      prev.includes(attribute)
        ? prev.filter(a => a !== attribute)
        : [...prev, attribute]
    )
  }

  const handleSubmit = () => {
    onSubmit({
      rating,
      comment,
      attributes: selectedAttributes
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex">
          {/* Left Side - Feedback Form */}
          <div className="flex-1 p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                <span className="text-gray-900">How was your experience with</span>
                <span className="text-indigo-600"> {freelancerName}</span>
                <span className="text-gray-900"> ?</span>
              </h2>
              <button 
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 15 21">
                  <path d="M15 20.5H0V0.5H15V20.5Z" stroke="#E5E7EB"/>
                  <path d="M13.3818 6.38281C13.8701 5.89453 13.8701 5.10156 13.3818 4.61328C12.8936 4.125 12.1006 4.125 11.6123 4.61328L7.49902 8.73047L3.38184 4.61719C2.89355 4.12891 2.10059 4.12891 1.6123 4.61719C1.12402 5.10547 1.12402 5.89844 1.6123 6.38672L5.72949 10.5L1.61621 14.6172C1.12793 15.1055 1.12793 15.8984 1.61621 16.3867C2.10449 16.875 2.89746 16.875 3.38574 16.3867L7.49902 12.2695L11.6162 16.3828C12.1045 16.8711 12.8975 16.8711 13.3857 16.3828C13.874 15.8945 13.874 15.1016 13.3857 14.6133L9.26855 10.5L13.3818 6.38281Z" fill="#6B7280"/>
                </svg>
              </button>
            </div>

            <div className="space-y-9">
              {/* Overall Rating */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="w-7 h-6"
                    >
                      <svg className="w-7 h-6" fill={star <= rating ? "#FACC15" : "#D1D5DB"} viewBox="0 0 27 24">
                        <path d="M14.8558 0.84375C14.6073 0.328125 14.0823 0 13.5058 0C12.9292 0 12.4089 0.328125 12.1558 0.84375L9.14171 7.04531L2.41046 8.03906C1.84796 8.12344 1.37921 8.51719 1.20577 9.05625C1.03233 9.59531 1.17296 10.1906 1.57608 10.5891L6.46046 15.4219L5.30733 22.2516C5.21358 22.8141 5.44796 23.3859 5.91202 23.7188C6.37608 24.0516 6.99015 24.0938 7.4964 23.8266L13.5105 20.6156L19.5245 23.8266C20.0308 24.0938 20.6448 24.0562 21.1089 23.7188C21.573 23.3813 21.8073 22.8141 21.7136 22.2516L20.5558 15.4219L25.4401 10.5891C25.8433 10.1906 25.9886 9.59531 25.8105 9.05625C25.6323 8.51719 25.1683 8.12344 24.6058 8.03906L17.8698 7.04531L14.8558 0.84375Z"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Share Experience */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Share your experience</label>
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others what stood out during the project. Was the freelancer communicative? Creative? On-time?"
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={200}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {comment.length} / 200
                  </div>
                </div>
              </div>

              {/* What stood out */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">What stood out? (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    {attributes.slice(0, 3).map((attribute) => (
                      <label key={attribute} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAttributes.includes(attribute)}
                          onChange={() => handleAttributeToggle(attribute)}
                          className="w-4 h-4 rounded border border-gray-300"
                        />
                        <span className="text-gray-700">{attribute}</span>
                      </label>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {attributes.slice(3).map((attribute) => (
                      <label key={attribute} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAttributes.includes(attribute)}
                          onChange={() => handleAttributeToggle(attribute)}
                          className="w-4 h-4 rounded border border-gray-300"
                        />
                        <span className="text-gray-700">{attribute}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8">
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                Remind me later
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Info Panel */}
          <div className="w-80 bg-blue-50 p-8 flex flex-col">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-white rounded-full shadow-md flex items-center justify-center">
                <svg className="w-12 h-12 text-indigo-600" fill="currentColor" viewBox="0 0 48 49">
                  <path d="M24.001 42.5C37.2572 42.5 48.001 33.7719 48.001 23C48.001 12.2281 37.2572 3.5 24.001 3.5C10.7447 3.5 0.000964416 12.2281 0.000964416 23C0.000964416 27.2281 1.66034 31.1375 4.47284 34.3344C4.29471 36.6312 3.40409 38.675 2.46659 40.2312C1.95096 41.0938 1.42596 41.7875 1.04159 42.2562C0.844714 42.4906 0.694714 42.6688 0.582214 42.7906C0.525964 42.8469 0.488464 42.8937 0.460339 42.9219L0.432214 42.95C0.000964418 43.3812 -0.120911 44.0188 0.113464 44.5813C0.347839 45.1438 0.891589 45.5094 1.50096 45.5094C4.19159 45.5094 6.90096 44.675 9.15096 43.7C11.2978 42.7625 13.126 41.6469 14.2416 40.8313C17.2228 41.9094 20.5228 42.5094 24.001 42.5094V42.5ZM12.001 20C12.7966 20 13.5597 20.3161 14.1223 20.8787C14.6849 21.4413 15.001 22.2044 15.001 23C15.001 23.7956 14.6849 24.5587 14.1223 25.1213C13.5597 25.6839 12.7966 26 12.001 26C11.2053 26 10.4423 25.6839 9.87964 25.1213C9.31703 24.5587 9.00097 23.7956 9.00097 23C9.00097 22.2044 9.31703 21.4413 9.87964 20.8787C10.4423 20.3161 11.2053 20 12.001 20ZM24.001 20C24.7966 20 25.5597 20.3161 26.1223 20.8787C26.6849 21.4413 27.001 22.2044 27.001 23C27.001 23.7956 26.6849 24.5587 26.1223 25.1213C25.5597 25.6839 24.7966 26 24.001 26C23.2053 26 22.4423 25.6839 21.8796 25.1213C21.317 24.5587 21.001 23.7956 21.001 23C21.001 22.2044 21.317 21.4413 21.8796 20.8787C22.4423 20.3161 23.2053 20 24.001 20ZM33.001 23C33.001 22.2044 33.317 21.4413 33.8796 20.8787C34.4423 20.3161 35.2053 20 36.001 20C36.7966 20 37.5597 20.3161 38.1223 20.8787C38.6849 21.4413 39.001 22.2044 39.001 23C39.001 23.7956 38.6849 24.5587 38.1223 25.1213C37.5597 25.6839 36.7966 26 36.001 26C35.2053 26 34.4423 25.6839 33.8796 25.1213C33.317 24.5587 33.001 23.7956 33.001 23Z"/>
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Why your feedback matters</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your honest review helps freelancers improve their service and assists other clients in making informed decisions.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 14 16">
                    <path d="M13.7047 3.29375C14.0953 3.68437 14.0953 4.31875 13.7047 4.70937L5.70469 12.7094C5.31406 13.1 4.67969 13.1 4.28906 12.7094L0.289062 8.70937C-0.101562 8.31875 -0.101562 7.68437 0.289062 7.29375C0.679688 6.90312 1.31406 6.90312 1.70469 7.29375L4.99844 10.5844L12.2922 3.29375C12.6828 2.90312 13.3172 2.90312 13.7078 3.29375H13.7047Z"/>
                  </svg>
                  <span className="text-sm text-gray-700">Helps freelancers build their reputation on Nippy</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-3.5 h-4 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 14 16">
                    <path d="M13.7047 3.29375C14.0953 3.68437 14.0953 4.31875 13.7047 4.70937L5.70469 12.7094C5.31406 13.1 4.67969 13.1 4.28906 12.7094L0.289062 8.70937C-0.101562 8.31875 -0.101562 7.68437 0.289062 7.29375C0.679688 6.90312 1.31406 6.90312 1.70469 7.29375L4.99844 10.5844L12.2922 3.29375C12.6828 2.90312 13.3172 2.90312 13.7078 3.29375H13.7047Z"/>
                  </svg>
                  <span className="text-sm text-gray-700">Contributes to the freelancer's visibility and "Top Rated" status</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-3.5 h-4 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 14 16">
                    <path d="M13.7047 3.29375C14.0953 3.68437 14.0953 4.31875 13.7047 4.70937L5.70469 12.7094C5.31406 13.1 4.67969 13.1 4.28906 12.7094L0.289062 8.70937C-0.101562 8.31875 -0.101562 7.68437 0.289062 7.29375C0.679688 6.90312 1.31406 6.90312 1.70469 7.29375L4.99844 10.5844L12.2922 3.29375C12.6828 2.90312 13.3172 2.90312 13.7078 3.29375H13.7047Z"/>
                  </svg>
                  <span className="text-sm text-gray-700">Guides other clients to find the right talent for their projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

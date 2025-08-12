import React, { useState } from 'react'

interface Job {
  id: string
  title: string
  description: string
  postedTime: string
  tags: string[]
}

interface QuickHireModalProps {
  isOpen: boolean
  onClose: () => void
  freelancerName: string
  onJobSelected?: (jobId: string) => void
  onJobCreated?: (jobData: any) => void
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Mobile App UI Redesign',
    description: 'Need to refresh the UI of our fitness tracking app with modern design elements and improved user flow.',
    postedTime: 'Posted 2 hours ago',
    tags: ['UI Design', 'Mobile', 'Figma']
  },
  {
    id: '2',
    title: 'Social Media Campaign',
    description: 'Looking for a designer to create engaging social media graphics for our summer campaign.',
    postedTime: 'Posted 2 days ago',
    tags: ['Social Media', 'Marketing']
  },
  {
    id: '3',
    title: 'Website Redesign Project',
    description: 'We need to completely overhaul our company website with a modern, responsive design that reflects our brand identity.',
    postedTime: 'Posted 6 days ago',
    tags: ['Web Design', 'Responsive', 'Branding']
  }
]

export const QuickHireModal: React.FC<QuickHireModalProps> = ({
  isOpen,
  onClose,
  freelancerName,
  onJobSelected,
  onJobCreated
}) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing')
  const [selectedJobId, setSelectedJobId] = useState<string>('1')
  const [newJobData, setNewJobData] = useState({
    title: '',
    description: '',
    adTypes: [] as string[],
    files: [] as File[]
  })

  if (!isOpen) return null

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId)
  }

  const handleSendJobBrief = () => {
    if (activeTab === 'existing') {
      onJobSelected?.(selectedJobId)
    } else {
      onJobCreated?.(newJobData)
    }
    onClose()
  }

  const handleAdTypeToggle = (type: string) => {
    setNewJobData(prev => ({
      ...prev,
      adTypes: prev.adTypes.includes(type)
        ? prev.adTypes.filter(t => t !== type)
        : [...prev.adTypes, type]
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setNewJobData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-gray-900">Quick Hire</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 12 16">
                <path d="M10.7047 4.70624C11.0953 4.31562 11.0953 3.68124 10.7047 3.29062C10.3141 2.89999 9.67969 2.89999 9.28906 3.29062L5.99844 6.58437L2.70469 3.29374C2.31406 2.90312 1.67969 2.90312 1.28906 3.29374C0.898438 3.68437 0.898438 4.31874 1.28906 4.70937L4.58281 7.99999L1.29219 11.2937C0.901563 11.6844 0.901563 12.3187 1.29219 12.7094C1.68281 13.1 2.31719 13.1 2.70781 12.7094L5.99844 9.41562L9.29219 12.7062C9.68281 13.0969 10.3172 13.0969 10.7078 12.7062C11.0984 12.3156 11.0984 11.6812 10.7078 11.2906L7.41406 7.99999L10.7047 4.70624Z" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600">Message {freelancerName} & hire them directly for your project</p>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'new'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Create New Job
            </button>
            <button
              onClick={() => setActiveTab('existing')}
              className={`flex-1 px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'existing'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Choose Existing
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'existing' ? (
            <div className="space-y-4">
              <p className="text-gray-700">Select one of your existing job posts to share with {freelancerName}</p>
              
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedJobId === job.id
                        ? 'border-blue-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleJobSelect(job.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5">
                        {selectedJobId === job.id ? (
                          <div className="w-4.5 h-4.5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7.91869 11.9041L5.17719 9.16262L4 10.3398L7.91869 14.2585L16 6.17719L14.8228 5L7.91869 11.9041Z" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <span className="text-xs text-gray-500">{job.postedTime}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 text-xs rounded-full ${
                                selectedJobId === job.id
                                  ? 'bg-white text-gray-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newJobData.title}
                  onChange={(e) => setNewJobData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ad Banner for salad shop"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newJobData.description}
                  onChange={(e) => setNewJobData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="I want an 3 distinct ad banners for my salad shop to show summer offers and deals"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Ad Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Ad Type</label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['Social Media', 'Print', 'Video', 'Other'].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        newJobData.adTypes.includes(type)
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {newJobData.adTypes.includes(type) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{type}</span>
                      <input
                        type="checkbox"
                        checked={newJobData.adTypes.includes(type)}
                        onChange={() => handleAdTypeToggle(type)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Reference Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Files <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <svg className="w-11 h-9 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 46 36">
                      <path d="M10.625 33.75C5.03516 33.75 0.5 29.2148 0.5 23.625C0.5 19.2094 3.32656 15.4547 7.26406 14.0695C7.25703 13.8797 7.25 13.6898 7.25 13.5C7.25 7.28437 12.2844 2.25 18.5 2.25C22.6695 2.25 26.3047 4.51406 28.2523 7.88906C29.3211 7.17188 30.6148 6.75 32 6.75C35.7266 6.75 38.75 9.77344 38.75 13.5C38.75 14.3578 38.5883 15.1734 38.3 15.9328C42.4062 16.7625 45.5 20.3977 45.5 24.75C45.5 29.7211 41.4711 33.75 36.5 33.75H10.625ZM16.1797 18.4922C15.5188 19.1531 15.5188 20.2219 16.1797 20.8758C16.8406 21.5297 17.9094 21.5367 18.5633 20.8758L21.3055 18.1336V27.5625C21.3055 28.4977 22.0578 29.25 22.993 29.25C23.9281 29.25 24.6805 28.4977 24.6805 27.5625V18.1336L27.4227 20.8758C28.0836 21.5367 29.1523 21.5367 29.8062 20.8758C30.4602 20.2148 30.4672 19.1461 29.8062 18.4922L24.1812 12.8672C23.5203 12.2063 22.4516 12.2063 21.7977 12.8672L16.1727 18.4922H16.1797Z" />
                    </svg>
                    <p className="text-sm text-gray-700">Drag and drop files here, or click to browse</p>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, GIF, MP4 (max 50MB)</p>
                  </div>
                  <label className="mt-4 inline-block">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="sr-only"
                      accept=".jpg,.jpeg,.png,.gif,.mp4,.pdf"
                    />
                    <span className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
                      Browse Files
                    </span>
                  </label>
                </div>
                
                {newJobData.files.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">{newJobData.files.length} file(s) selected</p>
                    <div className="space-y-1">
                      {newJobData.files.map((file, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Freelancer Info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <h4 className="font-medium text-gray-900">{freelancerName}</h4>
              <p className="text-sm text-gray-600">UI/UX Designer</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="space-y-3">
            <button
              onClick={handleSendJobBrief}
              disabled={activeTab === 'new' && (!newJobData.title || !newJobData.description)}
              className="w-full bg-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.4516 2.46664L5.92656 4.96664C0.868229 6.65831 0.868229 9.41664 5.92656 11.1L8.1599 11.8416L8.90156 14.075C10.5849 19.1333 13.3516 19.1333 15.0349 14.075L17.5432 6.55831C18.6599 3.18331 16.8266 1.34164 13.4516 2.46664ZM13.7182 6.94997L10.5516 10.1333C10.4266 10.2583 10.2682 10.3166 10.1099 10.3166C9.95156 10.3166 9.79323 10.2583 9.66823 10.1333C9.42656 9.89164 9.42656 9.49164 9.66823 9.24997L12.8349 6.06664C13.0766 5.82497 13.4766 5.82497 13.7182 6.06664C13.9599 6.30831 13.9599 6.70831 13.7182 6.94997Z" />
              </svg>
              Send Job Brief & Start Chat
            </button>
            
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 14 15">
                <path d="M7 14.5C8.85652 14.5 10.637 13.7625 11.9497 12.4497C13.2625 11.137 14 9.35652 14 7.5C14 5.64348 13.2625 3.86301 11.9497 2.55025C10.637 1.2375 8.85652 0.5 7 0.5C5.14348 0.5 3.36301 1.2375 2.05025 2.55025C0.737498 3.86301 0 5.64348 0 7.5C0 9.35652 0.737498 11.137 2.05025 12.4497C3.36301 13.7625 5.14348 14.5 7 14.5ZM5.90625 9.6875H6.5625V7.9375H5.90625C5.54258 7.9375 5.25 7.64492 5.25 7.28125C5.25 6.91758 5.54258 6.625 5.90625 6.625H7.21875C7.58242 6.625 7.875 6.91758 7.875 7.28125V9.6875H8.09375C8.45742 9.6875 8.75 9.98008 8.75 10.3438C8.75 10.7074 8.45742 11 8.09375 11H5.90625C5.54258 11 5.25 10.7074 5.25 10.3438C5.25 9.98008 5.54258 9.6875 5.90625 9.6875ZM7 4C7.23206 4 7.45462 4.09219 7.61872 4.25628C7.78281 4.42038 7.875 4.64294 7.875 4.875C7.875 5.10706 7.78281 5.32962 7.61872 5.49372C7.45462 5.65781 7.23206 5.75 7 5.75C6.76794 5.75 6.54538 5.65781 6.38128 5.49372C6.21719 5.32962 6.125 5.10706 6.125 4.875C6.125 4.64294 6.21719 4.42038 6.38128 4.25628C6.54538 4.09219 6.76794 4 7 4Z" />
              </svg>
              <span>Once sent, a message thread will open with this freelancer.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

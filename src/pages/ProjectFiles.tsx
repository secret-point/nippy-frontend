import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FileItem {
  id: string
  name: string
  size: string
  type: 'pdf' | 'jpg' | 'png' | 'xlsx' | 'zip'
  uploadedBy: string
  uploadDate: string
  category: 'reference' | 'submitted'
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Brand_Guidelines_2023.pdf',
    size: '2.4 MB',
    type: 'pdf',
    uploadedBy: 'Alex Johnson',
    uploadDate: 'May 24, 2023',
    category: 'reference'
  },
  {
    id: '2',
    name: 'Logo_References.jpg',
    size: '2.4 MB',
    type: 'jpg',
    uploadedBy: 'Alex Johnson',
    uploadDate: 'May 24, 2023',
    category: 'reference'
  },
  {
    id: '3',
    name: 'Project_Requirements.xlsx',
    size: '546 KB',
    type: 'xlsx',
    uploadedBy: 'Alex Johnson',
    uploadDate: 'May 24, 2023',
    category: 'reference'
  },
  {
    id: '4',
    name: 'Logo_Draft_v1.png',
    size: '2.4 MB',
    type: 'png',
    uploadedBy: 'Alex Johnson',
    uploadDate: 'May 24, 2023',
    category: 'submitted'
  },
  {
    id: '5',
    name: 'Logo_Draft_v2.png',
    size: '2.4 MB',
    type: 'png',
    uploadedBy: 'Alex Johnson',
    uploadDate: 'May 24, 2023',
    category: 'submitted'
  },
  {
    id: '6',
    name: 'Logo_Draft_v3.png',
    size: '2.4 MB',
    type: 'png',
    uploadedBy: 'Alex Johnson',
    uploadDate: 'May 24, 2023',
    category: 'submitted'
  },
  {
    id: '7',
    name: 'Source_Files.zip',
    size: '546 KB',
    type: 'zip',
    uploadedBy: 'Alex Johnson',
    uploadDate: 'May 24, 2023',
    category: 'submitted'
  }
]

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return (
        <div className="flex w-12 h-12 justify-center items-center rounded-lg bg-red-100">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 21">
            <path d="M0 3C0 1.62109 1.12109 0.5 2.5 0.5H8.75V5.5C8.75 6.19141 9.30859 6.75 10 6.75H15V12.375H6.875C5.49609 12.375 4.375 13.4961 4.375 14.875V20.5H2.5C1.12109 20.5 0 19.3789 0 18V3ZM15 5.5H10V0.5L15 5.5ZM6.875 14.25H8.125C9.33203 14.25 10.3125 15.2305 10.3125 16.4375C10.3125 17.6445 9.33203 18.625 8.125 18.625H7.5V19.875C7.5 20.2188 7.21875 20.5 6.875 20.5C6.53125 20.5 6.25 20.2188 6.25 19.875V18V14.875C6.25 14.5312 6.53125 14.25 6.875 14.25ZM8.125 17.375C8.64453 17.375 9.0625 16.957 9.0625 16.4375C9.0625 15.918 8.64453 15.5 8.125 15.5H7.5V17.375H8.125ZM11.875 14.25H13.125C14.1602 14.25 15 15.0898 15 16.125V18.625C15 19.6602 14.1602 20.5 13.125 20.5H11.875C11.5312 20.5 11.25 20.2188 11.25 19.875V14.875C11.25 14.5312 11.5312 14.25 11.875 14.25ZM13.125 19.25C13.4688 19.25 13.75 18.9688 13.75 18.625V16.125C13.75 15.7812 13.4688 15.5 13.125 15.5H12.5V19.25H13.125ZM16.25 14.875C16.25 14.5312 16.5312 14.25 16.875 14.25H18.75C19.0938 14.25 19.375 14.5312 19.375 14.875C19.375 15.2188 19.0938 15.5 18.75 15.5H17.5V16.75H18.75C19.0938 16.75 19.375 17.0312 19.375 17.375C19.375 17.7188 19.0938 18 18.75 18H17.5V19.875C17.5 20.2188 17.2188 20.5 16.875 20.5C16.5312 20.5 16.25 20.2188 16.25 19.875V17.375V14.875Z" />
          </svg>
        </div>
      )
    case 'jpg':
    case 'png':
      return (
        <div className="flex w-12 h-12 justify-center items-center rounded-lg bg-blue-100">
          <svg className="w-4 h-5 text-blue-600" fill="currentColor" viewBox="0 0 16 21">
            <path d="M3 0.5C1.62109 0.5 0.5 1.62109 0.5 3V18C0.5 19.3789 1.62109 20.5 3 20.5H13C14.3789 20.5 15.5 19.3789 15.5 18V6.75H10.5C9.80859 6.75 9.25 6.19141 9.25 5.5V0.5H3ZM10.5 0.5V5.5H15.5L10.5 0.5ZM3 10.5C3 10.1685 3.1317 9.85054 3.36612 9.61612C3.60054 9.3817 3.91848 9.25 4.25 9.25C4.58152 9.25 4.89946 9.3817 5.13388 9.61612C5.3683 9.85054 5.5 10.1685 5.5 10.5C5.5 10.8315 5.3683 11.1495 5.13388 11.3839C4.89946 11.6183 4.58152 11.75 4.25 11.75C3.91848 11.75 3.60054 11.6183 3.36612 11.3839C3.1317 11.1495 3 10.8315 3 10.5ZM8.9375 11.75C9.14453 11.75 9.33594 11.8516 9.45312 12.0195L12.8906 17.0195C13.0234 17.2109 13.0352 17.4609 12.9297 17.6641C12.8242 17.8672 12.6094 18 12.375 18H8.9375H7.375H5.5H3.625C3.39844 18 3.19141 17.8789 3.08203 17.6836C2.97266 17.4883 2.97266 17.2461 3.08984 17.0547L4.96484 13.9297C5.07812 13.7422 5.28125 13.625 5.5 13.625C5.71875 13.625 5.92188 13.7383 6.03516 13.9297L6.53516 14.7656L8.42188 12.0234C8.53906 11.8555 8.73047 11.7539 8.9375 11.7539V11.75Z" />
          </svg>
        </div>
      )
    case 'xlsx':
      return (
        <div className="flex w-12 h-12 justify-center items-center rounded-lg bg-green-100">
          <svg className="w-4 h-5 text-green-600" fill="currentColor" viewBox="0 0 16 21">
            <path d="M3 0.5C1.62109 0.5 0.5 1.62109 0.5 3V18C0.5 19.3789 1.62109 20.5 3 20.5H13C14.3789 20.5 15.5 19.3789 15.5 18V6.75H10.5C9.80859 6.75 9.25 6.19141 9.25 5.5V0.5H3ZM10.5 0.5V5.5H15.5L10.5 0.5ZM6.58203 10.2734L8 12.3008L9.41797 10.2734C9.71484 9.84766 10.3008 9.74609 10.7227 10.043C11.1445 10.3398 11.25 10.9258 10.9531 11.3477L9.14453 13.9375L10.957 16.5234C11.2539 16.9492 11.1523 17.5312 10.7266 17.8281C10.3008 18.125 9.71875 18.0234 9.42188 17.5977L8 15.5703L6.58203 17.5977C6.28516 18.0234 5.69922 18.125 5.27734 17.8281C4.85547 17.5312 4.75 16.9453 5.04688 16.5234L6.85547 13.9375L5.04297 11.3516C4.74609 10.9258 4.84766 10.3438 5.27344 10.0469C5.69922 9.75 6.28125 9.85156 6.57812 10.2773L6.58203 10.2734Z" />
          </svg>
        </div>
      )
    case 'zip':
      return (
        <div className="flex w-12 h-12 justify-center items-center rounded-lg bg-purple-100">
          <svg className="w-4 h-5 text-purple-600" fill="currentColor" viewBox="0 0 16 21">
            <path d="M3 0.5C1.62109 0.5 0.5 1.62109 0.5 3V18C0.5 19.3789 1.62109 20.5 3 20.5H13C14.3789 20.5 15.5 19.3789 15.5 18V6.75H10.5C9.80859 6.75 9.25 6.19141 9.25 5.5V0.5H3ZM10.5 0.5V5.5H15.5L10.5 0.5ZM4.25 2.375C4.25 2.03125 4.53125 1.75 4.875 1.75H6.125C6.46875 1.75 6.75 2.03125 6.75 2.375C6.75 2.71875 6.46875 3 6.125 3H4.875C4.53125 3 4.25 2.71875 4.25 2.375ZM4.25 4.875C4.25 4.53125 4.53125 4.25 4.875 4.25H6.125C6.46875 4.25 6.75 4.53125 6.75 4.875C6.75 5.21875 6.46875 5.5 6.125 5.5H4.875C4.53125 5.5 4.25 5.21875 4.25 4.875ZM4.25 7.375C4.25 7.03125 4.53125 6.75 4.875 6.75H6.125C6.46875 6.75 6.75 7.03125 6.75 7.375C6.75 7.71875 6.46875 8 6.125 8H4.875C4.53125 8 4.25 7.71875 4.25 7.375ZM4.00391 10.1797C4.14844 9.63281 4.64453 9.25 5.21094 9.25H5.78906C6.35547 9.25 6.85156 9.62891 6.99609 10.1797L7.91406 13.625C7.96875 13.8359 7.99609 14.0508 7.99609 14.2656C7.99609 15.6406 6.87109 16.7539 5.49609 16.7539C4.12109 16.7539 2.99609 15.6406 2.99609 14.2656C2.99609 14.0508 3.02344 13.832 3.07812 13.625L3.99609 10.1797H4.00391ZM4.875 13.625C4.53125 13.625 4.25 13.9062 4.25 14.25C4.25 14.5938 4.53125 14.875 4.875 14.875H6.125C6.46875 14.875 6.75 14.5938 6.75 14.25C6.75 13.9062 6.46875 13.625 6.125 13.625H4.875Z" />
          </svg>
        </div>
      )
    default:
      return (
        <div className="flex w-12 h-12 justify-center items-center rounded-lg bg-gray-100">
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 21">
            <path d="M3 0.5C1.62109 0.5 0.5 1.62109 0.5 3V18C0.5 19.3789 1.62109 20.5 3 20.5H13C14.3789 20.5 15.5 19.3789 15.5 18V6.75H10.5C9.80859 6.75 9.25 6.19141 9.25 5.5V0.5H3ZM10.5 0.5V5.5H15.5L10.5 0.5Z" />
          </svg>
        </div>
      )
  }
}

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7.5 14.7917C7.41667 14.7917 7.34167 14.775 7.25833 14.7417C7.025 14.65 6.875 14.4167 6.875 14.1667V9.16666C6.875 8.825 7.15833 8.54166 7.5 8.54166C7.84167 8.54166 8.125 8.825 8.125 9.16666V12.6583L8.725 12.0583C8.96667 11.8167 9.36667 11.8167 9.60833 12.0583C9.85 12.3 9.85 12.7 9.60833 12.9417L7.94167 14.6083C7.825 14.725 7.65833 14.7917 7.5 14.7917Z" />
    <path d="M7.50052 14.7917C7.34219 14.7917 7.18385 14.7333 7.05885 14.6083L5.39219 12.9417C5.15052 12.7 5.15052 12.3 5.39219 12.0583C5.63385 11.8167 6.03385 11.8167 6.27552 12.0583L7.94219 13.725C8.18385 13.9667 8.18385 14.3667 7.94219 14.6083C7.81719 14.7333 7.65885 14.7917 7.50052 14.7917Z" />
    <path d="M12.5013 18.9583H7.5013C2.9763 18.9583 1.04297 17.025 1.04297 12.5V7.5C1.04297 2.975 2.9763 1.04166 7.5013 1.04166H11.668C12.0096 1.04166 12.293 1.325 12.293 1.66666C12.293 2.00833 12.0096 2.29166 11.668 2.29166H7.5013C3.65964 2.29166 2.29297 3.65833 2.29297 7.5V12.5C2.29297 16.3417 3.65964 17.7083 7.5013 17.7083H12.5013C16.343 17.7083 17.7096 16.3417 17.7096 12.5V8.33333C17.7096 7.99166 17.993 7.70833 18.3346 7.70833C18.6763 7.70833 18.9596 7.99166 18.9596 8.33333V12.5C18.9596 17.025 17.0263 18.9583 12.5013 18.9583Z" />
    <path d="M18.3346 8.95834H15.0013C12.1513 8.95834 11.043 7.85 11.043 5V1.66667C11.043 1.41667 11.193 1.18334 11.4263 1.09167C11.6596 0.99167 11.9263 1.05 12.1096 1.225L18.7763 7.89167C18.9513 8.06667 19.0096 8.34167 18.9096 8.575C18.8096 8.80834 18.5846 8.95834 18.3346 8.95834ZM12.293 3.175V5C12.293 7.15 12.8513 7.70834 15.0013 7.70834H16.8263L12.293 3.175Z" />
  </svg>
)

const PreviewIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.99896 13.6083C8.00729 13.6083 6.39062 11.9917 6.39062 10C6.39062 8.00834 8.00729 6.39167 9.99896 6.39167C11.9906 6.39167 13.6073 8.00834 13.6073 10C13.6073 11.9917 11.9906 13.6083 9.99896 13.6083ZM9.99896 7.64167C8.69896 7.64167 7.64062 8.7 7.64062 10C7.64062 11.3 8.69896 12.3583 9.99896 12.3583C11.299 12.3583 12.3573 11.3 12.3573 10C12.3573 8.7 11.299 7.64167 9.99896 7.64167Z" />
    <path d="M9.99844 17.5167C6.8651 17.5167 3.90677 15.6833 1.87344 12.5C0.990104 11.125 0.990104 8.88333 1.87344 7.5C3.9151 4.31666 6.87344 2.48333 9.99844 2.48333C13.1234 2.48333 16.0818 4.31666 18.1151 7.5C18.9984 8.875 18.9984 11.1167 18.1151 12.5C16.0818 15.6833 13.1234 17.5167 9.99844 17.5167ZM9.99844 3.73333C7.30677 3.73333 4.73177 5.35 2.93177 8.175C2.30677 9.15 2.30677 10.85 2.93177 11.825C4.73177 14.65 7.30677 16.2667 9.99844 16.2667C12.6901 16.2667 15.2651 14.65 17.0651 11.825C17.6901 10.85 17.6901 9.15 17.0651 8.175C15.2651 5.35 12.6901 3.73333 9.99844 3.73333Z" />
  </svg>
)

const ExpandIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 17">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.29219 13.2062C7.68281 13.5969 8.31719 13.5969 8.70781 13.2062L14.7078 7.20625C15.0984 6.81562 15.0984 6.18125 14.7078 5.79062C14.3172 5.4 13.6828 5.4 13.2922 5.79062L7.99844 11.0844L2.70469 5.79375C2.31406 5.40312 1.67969 5.40312 1.28906 5.79375C0.898438 6.18437 0.898438 6.81875 1.28906 7.20937L7.28906 13.2094L7.29219 13.2062Z" />
  </svg>
)

export const ProjectFilesPage: React.FC = () => {
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    reference: true,
    submitted: true
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const referenceFiles = mockFiles.filter(file => file.category === 'reference')
  const submittedFiles = mockFiles.filter(file => file.category === 'submitted')

  const handlePreview = (file: FileItem) => {
    console.log('Preview file:', file.name)
  }

  const handleDownload = (file: FileItem) => {
    console.log('Download file:', file.name)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/messages')}
            className="flex items-center gap-3 mb-6 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-black bg-opacity-5 rounded-xl shadow-sm border border-black border-opacity-5">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.06705 20L10.8163 18.0922L4.74247 11.3934H20V8.60665H4.74247L10.8163 1.91854L9.06705 0L0 10L9.06705 20Z" />
              </svg>
              <span className="font-medium text-black">Back to Chat</span>
            </div>
          </button>

          <div className="flex items-center gap-6 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Files</h1>
          </div>
          <p className="text-gray-600">All files shared in this project conversation</p>
        </div>

        {/* Project Info */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-lg font-medium text-gray-900">Logo Design</h2>
          <span className="text-gray-400">–</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
            <span className="text-gray-600">Alex Johnson</span>
          </div>
        </div>

        {/* Reference Files Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Your Reference Files</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{referenceFiles.length} files</span>
                <button
                  onClick={() => toggleSection('reference')}
                  className={`transform transition-transform ${expandedSections.reference ? 'rotate-180' : ''}`}
                >
                  <ExpandIcon />
                </button>
              </div>
            </div>
          </div>

          {expandedSections.reference && (
            <div className="divide-y divide-gray-100">
              {referenceFiles.map((file) => (
                <div key={file.id} className="px-6 py-5 flex items-center gap-4">
                  {getFileIcon(file.type)}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 truncate">{file.name}</h4>
                    <p className="text-sm text-gray-500">{file.size}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>Uploaded by: {file.uploadedBy}</span>
                      <span>•</span>
                      <span>{file.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => handlePreview(file)}
                        className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <PreviewIcon />
                        <span className="text-xs">Preview</span>
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <DownloadIcon />
                        <span className="text-xs">Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submitted Files Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Files submitted by the Freelancer</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{submittedFiles.length} files</span>
                <button
                  onClick={() => toggleSection('submitted')}
                  className={`transform transition-transform ${expandedSections.submitted ? 'rotate-180' : ''}`}
                >
                  <ExpandIcon />
                </button>
              </div>
            </div>
          </div>

          {expandedSections.submitted && (
            <div className="divide-y divide-gray-100">
              {submittedFiles.map((file) => (
                <div key={file.id} className="px-6 py-5 flex items-center gap-4">
                  {getFileIcon(file.type)}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 truncate">{file.name}</h4>
                    <p className="text-sm text-gray-500">{file.size}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>Uploaded by: {file.uploadedBy}</span>
                      <span>•</span>
                      <span>{file.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => handlePreview(file)}
                        className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <PreviewIcon />
                        <span className="text-xs">Preview</span>
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <DownloadIcon />
                        <span className="text-xs">Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

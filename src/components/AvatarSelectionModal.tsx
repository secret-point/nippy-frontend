import React, { useState, useRef } from 'react'
import { Modal } from './ui/Modal'
import { fileAPI } from '../services/fileAPI'

interface AvatarSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAvatarSelected: (avatarUrl: string) => void
  currentAvatar?: string | null
}

export const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  isOpen,
  onClose,
  onAvatarSelected,
  currentAvatar
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (8MB max like Discord)
    const maxSize = 8 * 1024 * 1024 // 8MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 8MB')
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)

      const fileResult = await fileAPI.uploadAvatar(selectedFile)
      const avatarUrl = fileResult.avatarUrl

      onAvatarSelected(avatarUrl)
      onClose()
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    onAvatarSelected('')
    onClose()
  }

  const resetSelection = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetSelection()
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Change your avatar"
      size="md"
    >
      <div className="space-y-6">
        {/* Current/Preview Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : currentAvatar ? (
                <img 
                  src={currentAvatar} 
                  alt="Current avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}
            </div>
            {previewUrl && (
              <button
                onClick={resetSelection}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Upload Area */}
        {!selectedFile && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop an image or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-purple-600 hover:text-purple-700 underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  We recommend an image of at least 128x128. Larger images will be resized to fit.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, JPEG, PNG, GIF, or WebP. Max file size: 8MB.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {currentAvatar && (
              <button
                onClick={handleRemoveAvatar}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove Avatar
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  'Apply'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

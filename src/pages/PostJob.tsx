import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsAPI, CreateJobData } from '../services/jobsAPI'
import { authAPI } from '../services/authApi'
import { fileAPI, UploadedFile } from '../services/fileAPI'

export const PostJob = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    jobTitle: 'Video Editor for 30-second Reel',
    category: 'Video & Animation',
    urgency: 'Flexible',
    budgetMin: '',
    budgetMax: '',
    jobType: 'fixed' as 'fixed' | 'hourly',
    experienceLevel: 'intermediate' as 'entry' | 'intermediate' | 'expert',
    description: 'Eg. "I need a video editor for a 30-second reel with motion graphics. The video will showcase our new product line with dynamic transitions and text overlays. Need it completed within 4 days. The footage is already shot and I can provide brand assets and guidelines."',
    additionalNotes: '',
    referenceUrl: ''
  })

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [draftError, setDraftError] = useState<string | null>(null)
  const [draftSuccess, setDraftSuccess] = useState<string | null>(null)

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    size: string;
    caption: string;
    file?: File;
    preview?: string;
    uploaded?: boolean;
    uploadedFile?: UploadedFile;
  }>>([])

  const [isUploading, setIsUploading] = useState(false)
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Generate dynamic waveform data for visualization
  const generateWaveformData = () => {
    const data = Array.from({ length: 64 }, () => Math.random() * 100)
    setWaveformData(data)
  }

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Setup audio context for waveform visualization
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start()

      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
        generateWaveformData() // Update waveform animation
      }, 1000)

      // Handle recording data
      mediaRecorderRef.current.ondataavailable = (event) => {
        // Here you would typically send the audio data to a speech-to-text service
        console.log('Audio data available:', event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        // Simulate speech-to-text conversion
        const transcribedText = "I need a video editor for a 30-second reel with motion graphics. The video will showcase our new product line with dynamic transitions and text overlays. Need it completed within 4 days. The footage is already shot and I can provide brand assets and guidelines."
        setFormData(prev => ({ ...prev, description: transcribedText }))
      }

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setWaveformData([])
  }

  // Toggle pause/resume
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        if (intervalRef.current) {
          intervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1)
            generateWaveformData()
          }, 1000)
        }
      } else {
        mediaRecorderRef.current.pause()
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
      setIsPaused(!isPaused)
    }
  }

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Waveform visualization component
  const WaveformVisualization = () => (
    <div className="flex items-center justify-center gap-1 px-11 py-4">
      {Array.from({ length: 64 }, (_, i) => (
        <div
          key={i}
          className="w-1 bg-purple-500 rounded-full transition-all duration-150"
          style={{
            height: `${Math.max(12, (waveformData[i] || Math.random() * 100) * 0.6)}px`,
            opacity: isRecording && !isPaused ? 0.6 + Math.random() * 0.4 : 0.6
          }}
        />
      ))}
    </div>
  )

  // Recording controls component
  const RecordingControls = () => (
    <div className="flex items-center justify-center gap-2">
      {/* Stop button with timer */}
      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1.5 shadow-sm">
        <button
          onClick={stopRecording}
          className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M11.9688 2C6.44875 2 1.96875 6.48 1.96875 12C1.96875 17.52 6.44875 22 11.9688 22C17.4888 22 21.9688 17.52 21.9688 12C21.9688 6.48 17.4988 2 11.9688 2ZM16.2287 13.23C16.2287 14.89 14.8887 16.23 13.2287 16.23H10.7688C9.10875 16.23 7.76875 14.89 7.76875 13.23V10.77C7.76875 9.11 9.10875 7.77 10.7688 7.77H13.2287C14.8887 7.77 16.2287 9.11 16.2287 10.77V13.23Z" fill="white"/>
          </svg>
        </button>
        <span className="text-sm font-inter text-gray-600 w-8">
          {formatTime(recordingTime)}
        </span>
      </div>

      {/* Pause/Resume button */}
      <button
        onClick={togglePause}
        className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm"
      >
        {isPaused ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8.5 6.82L11.77 8.68C13.68 9.81 13.68 12.64 11.77 13.77L8.5 15.63C6.87 16.58 5 15.44 5 13.46V8.99C5 7.01 6.87 5.87 8.5 6.82Z" fill="#7F7F7F"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" fill="#7F7F7F"/>
            <path d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z" fill="#7F7F7F"/>
          </svg>
        )}
      </button>
    </div>
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const handleSaveDraft = async () => {
    try {
      setIsDraftSaving(true)
      setDraftError(null)
      setDraftSuccess(null)

      // Get current user
      const currentUser = authAPI.getCurrentUser()
      if (!currentUser) {
        setDraftError('You must be logged in to save a draft')
        return
      }

      // Convert budget strings to numbers
      const budgetMin = formData.budgetMin ? parseFloat(formData.budgetMin.replace(/[$,]/g, '')) : undefined
      const budgetMax = formData.budgetMax ? parseFloat(formData.budgetMax.replace(/[$,]/g, '')) : undefined

      // Create draft job data - only include non-empty fields
      const draftData: Partial<CreateJobData> = {}

      if (formData.jobTitle.trim()) {
        draftData.title = formData.jobTitle.trim()
      }
      
      if (formData.description.trim()) {
        draftData.description = formData.description.trim()
      }

      if (formData.jobType) {
        draftData.jobType = formData.jobType
      }

      if (formData.experienceLevel) {
        draftData.experienceLevel = formData.experienceLevel
      }

      if (budgetMin) {
        if (formData.jobType === 'fixed') {
          draftData.budget = budgetMin
        } else {
          draftData.hourlyRateMin = budgetMin
        }
      }

      if (budgetMax && formData.jobType === 'hourly') {
        draftData.hourlyRateMax = budgetMax
      }

      if (formData.additionalNotes.trim() || uploadedFiles.length > 0) {
        draftData.requirements = [
          formData.additionalNotes.trim(),
          // Add note about uploaded files if any
          uploadedFiles.length > 0 ? 
            `\n\nUploaded files (${uploadedFiles.length}): ${uploadedFiles.map(f => f.name).join(', ')}` : 
            ''
        ].filter(Boolean).join('\n') || undefined
      }

      if (formData.urgency && formData.urgency !== 'Flexible') {
        draftData.duration = formData.urgency === 'Urgent' ? '1-3 days' : '1 week'
      }

      if (formData.category) {
        draftData.skillsRequired = [formData.category]
        // Also set a categoryId if we have a mapping
        // For now, we'll let the backend handle the default category
      }

      // Call the API to save draft
      const savedDraft = await jobsAPI.createDraft(currentUser.id, draftData)
      
      console.log('Draft saved successfully:', savedDraft)
      
      // Show success message
      setDraftSuccess('Draft saved successfully! You can continue editing or publish it later.')
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setDraftSuccess(null)
      }, 5000)
      
    } catch (error: any) {
      console.error('Error saving draft:', error)
      setDraftError(error.message || 'Failed to save draft. Please try again.')
    } finally {
      setIsDraftSaving(false)
    }
  }

  const handlePostJob = async () => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      // Get current user
      const currentUser = authAPI.getCurrentUser()
      if (!currentUser) {
        setSubmitError('You must be logged in to post a job')
        return
      }

      // Validate required fields
      if (!formData.jobTitle.trim()) {
        setSubmitError('Job title is required')
        return
      }

      if (!formData.description.trim()) {
        setSubmitError('Job description is required')
        return
      }

      // Convert budget strings to numbers
      const budgetMin = formData.budgetMin ? parseFloat(formData.budgetMin.replace(/[$,]/g, '')) : undefined
      const budgetMax = formData.budgetMax ? parseFloat(formData.budgetMax.replace(/[$,]/g, '')) : undefined

      // Validate budget for fixed jobs
      if (formData.jobType === 'fixed' && (!budgetMin || budgetMin < 5)) {
        setSubmitError('Budget must be at least $5 for fixed projects')
        return
      }

      // Create job data matching backend structure
      const jobData: CreateJobData = {
        title: formData.jobTitle.trim(),
        description: formData.description.trim(),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        budget: formData.jobType === 'fixed' ? budgetMin : undefined,
        hourlyRateMin: formData.jobType === 'hourly' ? budgetMin : undefined,
        hourlyRateMax: formData.jobType === 'hourly' ? budgetMax : undefined,
        requirements: [
          formData.additionalNotes.trim(),
          // Add note about uploaded files if any
          uploadedFiles.length > 0 ? 
            `\n\nUploaded files (${uploadedFiles.length}): ${uploadedFiles.map(f => f.name).join(', ')}` : 
            ''
        ].filter(Boolean).join('\n') || undefined,
        // For now, we'll set some default values since the UI doesn't have all fields
        duration: formData.urgency === 'Urgent' ? '1-3 days' : formData.urgency === 'Flexible' ? '1-2 weeks' : '1 week',
        skillsRequired: formData.category ? [formData.category] : undefined,
      }

      // Call the API
      const createdJob = await jobsAPI.createJob(currentUser.id, jobData)
      
      console.log('Job created successfully:', createdJob)
      
      // Navigate to job listing or success page
      navigate('/jobs')
      
    } catch (error: any) {
      console.error('Error posting job:', error)
      setSubmitError(error.message || 'Failed to post job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileDelete = async (fileId: string) => {
    try {
      // Find the file to delete
      const fileToDelete = uploadedFiles.find(f => f.id === fileId)
      
      if (fileToDelete?.uploaded && fileToDelete.uploadedFile) {
        // Delete from backend if it was uploaded
        await fileAPI.deleteFile(fileToDelete.uploadedFile.id)
      }
      
      // Remove from frontend state
      setUploadedFiles(files => files.filter(f => f.id !== fileId))
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error deleting file. Please try again.')
    }
  }

  // File upload functionality
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    const maxSize = 20 * 1024 * 1024 // 20MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'image/svg+xml']
    
    if (file.size > maxSize) {
      return 'File size must be less than 20MB'
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please use JPG, PNG, PDF, or SVG'
    }
    
    return null
  }

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        // For non-image files, return a default icon or file type indicator
        resolve('')
      }
    })
  }

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    setIsUploading(true)

    try {
      // First validate all files
      const validFiles: File[] = []
      for (const file of fileArray) {
        const validationError = validateFile(file)
        if (validationError) {
          alert(`${file.name}: ${validationError}`)
          continue
        }
        validFiles.push(file)
      }

      if (validFiles.length === 0) {
        setIsUploading(false)
        return
      }

      // Create preview objects for immediate UI feedback
      const previewFiles: Array<{
        id: string;
        name: string;
        size: string;
        caption: string;
        file?: File;
        preview?: string;
        uploaded?: boolean;
        uploadedFile?: UploadedFile;
      }> = []
      for (const file of validFiles) {
        const preview = await createFilePreview(file)
        const previewFile = {
          id: `temp-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: formatFileSize(file.size),
          caption: '',
          file: file,
          preview: preview,
          uploaded: false
        }
        previewFiles.push(previewFile)
      }

      // Add preview files to state immediately
      setUploadedFiles(prev => [...prev, ...previewFiles])

      // Upload files to backend
      const uploadedFiles = await fileAPI.uploadAttachments(validFiles)

      // Update the state with uploaded file information
      setUploadedFiles(prev => prev.map(file => {
        // Find corresponding uploaded file
        const uploadedFile = uploadedFiles.find(uf => uf.originalName === file.name)
        if (uploadedFile && file.file) {
          return {
            ...file,
            id: uploadedFile.id,
            uploaded: true,
            uploadedFile: uploadedFile
          }
        }
        return file
      }))

    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Error uploading files to server. Please try again.')
      
      // Remove preview files that failed to upload
      setUploadedFiles(prev => prev.filter(file => file.uploaded || !file.file))
    } finally {
      setIsUploading(false)
    }
  }

  const handleBrowseFiles = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
    // Reset the input value so the same file can be selected again
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-manrope tracking-tight">
            Post a New Job
          </h1>
          <p className="text-gray-600 text-base font-poppins">
            Tell us what you need and we'll help you find the right creative.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="space-y-8">
          {/* Core Job Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-black font-poppins mb-6">
              Core Job Details
            </h2>

            <div className="space-y-6">
              {/* Job Title and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div className="relative">
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm font-poppins text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 font-poppins">
                    Job Title
                  </label>
                  <div className="absolute right-3 top-3">
                    <svg width="24" height="24" viewBox="0 0 25 24" fill="none">
                      <path d="M9.30312 15.9008L5.10313 11.7008L3.70312 13.1008L9.30312 18.7008L21.3031 6.70078L19.9031 5.30078L9.30312 15.9008Z" fill="#10B981"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 font-poppins mt-1">
                    Clear titles attract 3x more qualified candidates
                  </p>
                </div>

                {/* Category */}
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm font-poppins text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                  >
                    <option value="Video & Animation">Video & Animation</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Writing & Translation">Writing & Translation</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 font-poppins">
                    Category
                  </label>
                  <div className="absolute right-3 top-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12.0034 16.8006C11.3034 16.8006 10.6034 16.5306 10.0734 16.0006L3.55344 9.48062C3.26344 9.19062 3.26344 8.71062 3.55344 8.42063C3.84344 8.13063 4.32344 8.13063 4.61344 8.42063L11.1334 14.9406C11.6134 15.4206 12.3934 15.4206 12.8734 14.9406L19.3934 8.42063C19.6834 8.13063 20.1634 8.13063 20.4534 8.42063C20.7434 8.71062 20.7434 9.19062 20.4534 9.48062L13.9334 16.0006C13.4034 16.5306 12.7034 16.8006 12.0034 16.8006Z" fill="#737373"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 font-poppins mt-1">
                    This helps us match your job with the right freelancers
                  </p>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <h3 className="text-base font-medium text-black font-poppins mb-4">Urgency</h3>
                <div className="flex flex-wrap gap-4">
                  {['Urgent', 'Flexible', 'Set Date'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, urgency: option})}
                      className={`px-6 py-2.5 rounded-lg border font-poppins text-base transition-colors ${
                        formData.urgency === option
                          ? 'border-2 border-purple-600 text-black'
                          : 'border border-gray-300 text-black hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div>
                <h3 className="text-base font-medium text-black font-poppins mb-4">Job Type</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setFormData({...formData, jobType: 'fixed'})}
                    className={`px-6 py-2.5 rounded-lg border font-poppins text-base transition-colors ${
                      formData.jobType === 'fixed'
                        ? 'border-2 border-purple-600 text-black'
                        : 'border border-gray-300 text-black hover:border-gray-400'
                    }`}
                  >
                    Fixed Price
                  </button>
                  <button
                    onClick={() => setFormData({...formData, jobType: 'hourly'})}
                    className={`px-6 py-2.5 rounded-lg border font-poppins text-base transition-colors ${
                      formData.jobType === 'hourly'
                        ? 'border-2 border-purple-600 text-black'
                        : 'border border-gray-300 text-black hover:border-gray-400'
                    }`}
                  >
                    Hourly Rate
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-poppins mt-2">
                  {formData.jobType === 'fixed' 
                    ? 'Pay a fixed amount for the entire project' 
                    : 'Pay an hourly rate for time-based work'
                  }
                </p>
              </div>

              {/* Budget Range */}
              <div>
                <h3 className="text-base font-medium text-black font-poppins mb-4">
                  {formData.jobType === 'fixed' ? 'Project Budget' : 'Hourly Rate Range'}
                </h3>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <input
                    type="text"
                    placeholder={formData.jobType === 'fixed' ? '$500' : '$25/hr'}
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({...formData, budgetMin: e.target.value})}
                    className="h-12 px-4 border border-gray-300 rounded-lg text-sm font-poppins text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder={formData.jobType === 'fixed' ? '$1000' : '$50/hr'}
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({...formData, budgetMax: e.target.value})}
                    className="h-12 px-4 border border-gray-300 rounded-lg text-sm font-poppins text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 font-poppins mt-2">
                  {formData.jobType === 'fixed' 
                    ? 'Set a budget range for the entire project' 
                    : 'Set the hourly rate range you\'re willing to pay'
                  }
                </p>
              </div>

              {/* Job Description */}
              <div className="relative">
                {isRecording ? (
                  <div className="border border-gray-300 rounded-lg bg-white min-h-[200px] flex flex-col justify-center">
                    <WaveformVisualization />
                    <div className="flex justify-center pb-4">
                      <RecordingControls />
                    </div>
                    <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 font-poppins">
                      Job Description
                    </label>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-6 border border-gray-300 rounded-lg text-sm font-poppins text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 font-poppins">
                      Job Description
                    </label>
                    <button
                      onClick={startRecording}
                      className="absolute bottom-3 right-3 flex items-center gap-2 px-6 py-2 bg-purple-50 text-purple-600 rounded-lg font-inter text-sm hover:bg-purple-100 transition-colors"
                    >
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path d="M15.9344 8.10013C15.6094 8.10013 15.351 8.35846 15.351 8.68346V10.0001C15.351 12.9501 12.951 15.3501 10.001 15.3501C7.05104 15.3501 4.65104 12.9501 4.65104 10.0001V8.67513C4.65104 8.35013 4.39271 8.0918 4.06771 8.0918C3.74271 8.0918 3.48438 8.35013 3.48438 8.67513V9.9918C3.48438 13.3835 6.09271 16.1751 9.41771 16.4751V18.2501C9.41771 18.5751 9.67604 18.8335 10.001 18.8335C10.326 18.8335 10.5844 18.5751 10.5844 18.2501V16.4751C13.901 16.1835 16.5177 13.3835 16.5177 9.9918V8.67513C16.5094 8.35846 16.251 8.10013 15.9344 8.10013Z" fill="#5F42A1"/>
                        <path d="M10.0036 2.16602C7.97031 2.16602 6.32031 3.81602 6.32031 5.84935V10.116C6.32031 12.1493 7.97031 13.7993 10.0036 13.7993C12.037 13.7993 13.687 12.1493 13.687 10.116V5.84935C13.687 3.81602 12.037 2.16602 10.0036 2.16602ZM11.0953 7.95768C11.037 8.17435 10.8453 8.31602 10.6286 8.31602C10.587 8.31602 10.5453 8.30768 10.5036 8.29935C10.1786 8.20768 9.83698 8.20768 9.51198 8.29935C9.24531 8.37435 8.98698 8.21602 8.92031 7.95768C8.84531 7.69935 9.00365 7.43268 9.26198 7.36602C9.75365 7.23268 10.2703 7.23268 10.762 7.36602C11.012 7.43268 11.162 7.69935 11.0953 7.95768ZM11.537 6.34102C11.462 6.54102 11.2786 6.65768 11.0786 6.65768C11.0203 6.65768 10.9703 6.64935 10.912 6.63268C10.3286 6.41602 9.67865 6.41602 9.09531 6.63268C8.84531 6.72435 8.56198 6.59102 8.47031 6.34102C8.37865 6.09102 8.51198 5.80768 8.76198 5.72435C9.56198 5.43268 10.4453 5.43268 11.2453 5.72435C11.4953 5.81602 11.6286 6.09102 11.537 6.34102Z" fill="#5F42A1"/>
                      </svg>
                      Record
                    </button>
                  </>
                )}
              </div>

              {/* Paraphrase with AI */}
              <button className="flex items-center gap-2 text-purple-600 font-poppins text-sm">
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none">
                  <g clipPath="url(#clip0_5_49276)">
                    <path d="M6.41758 1.66758L5.38672 2.05313C5.30469 2.0832 5.25 2.1625 5.25 2.25C5.25 2.3375 5.30469 2.4168 5.38672 2.44687L6.41758 2.83242L6.80312 3.86328C6.8332 3.94531 6.9125 4 7 4C7.0875 4 7.1668 3.94531 7.19688 3.86328L7.58242 2.83242L8.61328 2.44687C8.69531 2.4168 8.75 2.3375 8.75 2.25C8.75 2.1625 8.69531 2.0832 8.61328 2.05313L7.58242 1.66758L7.19688 0.636719C7.1668 0.554688 7.0875 0.5 7 0.5C6.9125 0.5 6.8332 0.554688 6.80312 0.636719L6.41758 1.66758Z" fill="#6C5DD3"/>
                    <path d="M1.26055 11.3117C0.749219 11.823 0.749219 12.6543 1.26055 13.1684L2.20664 14.1145C2.71797 14.6258 3.54922 14.6258 4.06328 14.1145L14.4895 3.68555C15.0008 3.17422 15.0008 2.34297 14.4895 1.82891L13.5434 0.885547C13.032 0.374219 12.2008 0.374219 11.6867 0.885547L1.26055 11.3117Z" fill="#6C5DD3"/>
                    <path d="M13.2508 2.75859L10.3797 5.62969L9.74258 4.99258L12.6137 2.12148L13.2508 2.75859Z" fill="#6C5DD3"/>
                    <path d="M0.205078 3.70469C0.0820312 3.75117 0 3.86875 0 4C0 4.13125 0.0820312 4.24883 0.205078 4.29531L1.75 4.875L2.32969 6.41992C2.37617 6.54297 2.49375 6.625 2.625 6.625C2.75625 6.625 2.87383 6.54297 2.92031 6.41992L3.5 4.875L5.04492 4.29531C5.16797 4.24883 5.25 4.13125 5.25 4C5.25 3.86875 5.16797 3.75117 5.04492 3.70469L3.5 3.125L2.92031 1.58008C2.87383 1.45703 2.75625 1.375 2.625 1.375C2.49375 1.375 2.37617 1.45703 2.32969 1.58008L1.75 3.125L0.205078 3.70469Z" fill="#6C5DD3"/>
                    <path d="M9.83008 10.7047C9.70703 10.7512 9.625 10.8687 9.625 11C9.625 11.1313 9.70703 11.2488 9.83008 11.2953L11.375 11.875L11.9547 13.4199C12.0012 13.543 12.1187 13.625 12.25 13.625C12.3813 13.625 12.4988 13.543 12.5453 13.4199L13.125 11.875L14.6699 11.2953C14.793 11.2488 14.875 11.1313 14.875 11C14.875 10.8687 14.793 10.7512 14.6699 10.7047L13.125 10.125L12.5453 8.58008C12.4988 8.45703 12.3813 8.375 12.25 8.375C12.1187 8.375 12.0012 8.45703 11.9547 8.58008L11.375 10.125L9.83008 10.7047Z" fill="#6C5DD3"/>
                  </g>
                </svg>
                Paraphrase with AI
              </button>
            </div>
          </div>

          {/* Reference or Inspiration Materials */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-black font-poppins">
                Reference or Inspiration Materials (Optional)
              </h2>
              <button
                onClick={() => setIsReferenceExpanded(!isReferenceExpanded)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                  className={`transform transition-transform ${isReferenceExpanded ? 'rotate-180' : ''}`}
                >
                  <path d="M9.4527 15.4367C9.98731 15.9656 10.8555 15.9656 11.3901 15.4367L19.6017 7.31327C20.1363 6.7844 20.1363 5.92552 19.6017 5.39665C19.067 4.86778 18.1988 4.86778 17.6642 5.39665L10.4193 12.5639L3.1743 5.40088C2.6397 4.87201 1.7715 4.87201 1.23689 5.40088C0.702286 5.92975 0.702286 6.78863 1.23689 7.3175L9.44843 15.4409L9.4527 15.4367Z" fill="#5F42A1"/>
                </svg>
              </button>
            </div>

            {isReferenceExpanded && (
              <div className="space-y-6">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.svg,.ai,.psd"
                  className="hidden"
                />

                {/* Drop Zone */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-10 text-gray-400">
                      <svg width="45" height="36" viewBox="0 0 45 36" fill="none">
                        <path d="M45 36H0V0H45V36Z" stroke="#E5E7EB"/>
                        <path d="M10.125 33.75C4.53516 33.75 0 29.2148 0 23.625C0 19.2094 2.82656 15.4547 6.76406 14.0695C6.75703 13.8797 6.75 13.6898 6.75 13.5C6.75 7.28437 11.7844 2.25 18 2.25C22.1695 2.25 25.8047 4.51406 27.7523 7.88906C28.8211 7.17188 30.1148 6.75 31.5 6.75C35.2266 6.75 38.25 9.77344 38.25 13.5C38.25 14.3578 38.0883 15.1734 37.8 15.9328C41.9062 16.7625 45 20.3977 45 24.75C45 29.7211 40.9711 33.75 36 33.75H10.125ZM15.6797 18.4922C15.0188 19.1531 15.0188 20.2219 15.6797 20.8758C16.3406 21.5297 17.4094 21.5367 18.0633 20.8758L20.8055 18.1336V27.5625C20.8055 28.4977 21.5578 29.25 22.493 29.25C23.4281 29.25 24.1805 28.4977 24.1805 27.5625V18.1336L26.9227 20.8758C27.5836 21.5367 28.6523 21.5367 29.3062 20.8758C29.9602 20.2148 29.9672 19.1461 29.3062 18.4922L23.6812 12.8672C23.0203 12.2063 21.9516 12.2063 21.2977 12.8672L15.6727 18.4922H15.6797Z" fill="#9CA3AF"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className={`text-base font-poppins mb-2 ${isDragOver ? 'text-purple-600' : 'text-gray-600'}`}>
                        {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
                      </h3>
                      <p className="text-sm font-poppins text-gray-500">
                        Upload images, designs, logos, or any visual reference that helps explain what you're looking for
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleBrowseFiles}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg font-poppins text-base hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                              <path d="M18.0537 9.85L17.9204 9.66667C17.6871 9.38333 17.4121 9.15833 17.0954 8.99167C16.6704 8.75 16.1871 8.625 15.6871 8.625H5.31208C4.81208 8.625 4.33708 8.75 3.90375 8.99167C3.57875 9.16667 3.28708 9.40833 3.04541 9.70833C2.57041 10.3167 2.34541 11.0667 2.42041 11.8167L2.72875 15.7083C2.83708 16.8833 2.97874 18.3333 5.62041 18.3333H15.3871C18.0287 18.3333 18.1621 16.8833 18.2787 15.7L18.5871 11.825C18.6621 11.125 18.4787 10.425 18.0537 9.85Z" fill="white"/>
                              <path d="M17.6223 7.01867C17.6677 7.40067 17.2506 7.65953 16.8816 7.55062C16.5023 7.43866 16.1058 7.38268 15.6953 7.38268H5.31198C4.89631 7.38268 4.48638 7.44295 4.09903 7.55842C3.73469 7.66704 3.32031 7.41775 3.32031 7.03757V5.54935C3.32031 2.57435 4.22865 1.66602 7.20365 1.66602H8.18698C9.37865 1.66602 9.75365 2.04935 10.237 2.67435L11.237 4.00768C11.4453 4.29102 11.4536 4.30768 11.8203 4.30768H13.8036C16.3494 4.30768 17.3793 4.97414 17.6223 7.01867Z" fill="white"/>
                            </svg>
                            Browse Files
                          </>
                        )}
                      </button>
                      <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-black rounded-lg font-poppins text-base hover:bg-gray-50 transition-colors">
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                          <path d="M16.3953 11.8673C16.1536 12.109 15.7703 12.109 15.537 11.8673C15.2953 11.6257 15.2953 11.2423 15.537 11.009C17.2036 9.34232 17.2036 6.63399 15.537 4.97565C13.8703 3.31732 11.162 3.30899 9.50365 4.97565C7.84531 6.64232 7.83698 9.35065 9.50365 11.009C9.74531 11.2507 9.74531 11.634 9.50365 11.8673C9.26198 12.109 8.87865 12.109 8.64531 11.8673C6.50365 9.72565 6.50365 6.24232 8.64531 4.10899C10.787 1.97565 14.2703 1.96732 16.4036 4.10899C18.537 6.25065 18.537 9.72565 16.3953 11.8673Z" fill="black"/>
                          <path d="M4.60729 8.13242C4.84896 7.89076 5.23229 7.89076 5.46563 8.13242C5.70729 8.37409 5.70729 8.75742 5.46563 8.99075C3.79896 10.6574 3.79896 13.3658 5.46563 15.0241C7.13229 16.6824 9.84063 16.6908 11.499 15.0241C13.1573 13.3574 13.1656 10.6491 11.499 8.99075C11.2573 8.74909 11.2573 8.36576 11.499 8.13242C11.7406 7.89076 12.124 7.89076 12.3573 8.13242C14.499 10.2741 14.499 13.7574 12.3573 15.8908C10.2156 18.0241 6.73229 18.0324 4.59896 15.8908C2.46563 13.7491 2.46563 10.2741 4.60729 8.13242Z" fill="black"/>
                        </svg>
                        Add URL
                      </button>
                    </div>
                    <p className="text-sm font-poppins text-gray-500">
                      Supported formats: JPG, PNG, PDF, SVG, AI, PSD (Max 20MB per file)
                    </p>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-inter font-medium text-black mb-4">
                      Uploaded Files ({uploadedFiles.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* File Preview */}
                          <div className="h-40 bg-gray-100 relative flex items-center justify-center">
                            {!file.uploaded && file.file && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                                <div className="flex flex-col items-center text-white">
                                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-2"></div>
                                  <span className="text-sm font-poppins">Uploading...</span>
                                </div>
                              </div>
                            )}
                            {file.uploaded && (
                              <div className="absolute top-2 right-2 z-20">
                                <div className="bg-green-500 rounded-full p-1">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            {file.preview ? (
                              <img 
                                src={file.preview} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                            ) : null}
                            <div className={`flex items-center justify-center ${file.preview ? 'hidden' : ''}`}>
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M14.1693 6.10044C12.6293 3.68044 10.3759 2.28711 8.0026 2.28711C6.81594 2.28711 5.6626 2.63378 4.60927 3.28044C3.55594 3.93378 2.60927 4.88711 1.83594 6.10044C1.16927 7.14711 1.16927 8.84711 1.83594 9.89378C3.37594 12.3204 5.62927 13.7071 8.0026 13.7071C9.18927 13.7071 10.3426 13.3604 11.3959 12.7138C12.4493 12.0604 13.3959 11.1071 14.1693 9.89378C14.8359 8.85378 14.8359 7.14711 14.1693 6.10044ZM8.0026 10.6938C6.50927 10.6938 5.30927 9.48711 5.30927 8.00044C5.30927 6.51378 6.50927 5.30711 8.0026 5.30711C9.49594 5.30711 10.6959 6.51378 10.6959 8.00044C10.6959 9.48711 9.49594 10.6938 8.0026 10.6938Z" fill="#3A404A"/>
                                  <path d="M8.00156 6.09375C6.9549 6.09375 6.10156 6.94708 6.10156 8.00042C6.10156 9.04708 6.9549 9.90042 8.00156 9.90042C9.04823 9.90042 9.90823 9.04708 9.90823 8.00042C9.90823 6.95375 9.04823 6.09375 8.00156 6.09375Z" fill="#3A404A"/>
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleFileDelete(file.id)}
                                className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50"
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M14.0491 3.48732C12.9757 3.38065 11.9024 3.30065 10.8224 3.24065V3.23398L10.6757 2.36732C10.5757 1.75398 10.429 0.833984 8.86905 0.833984H7.12238C5.56905 0.833984 5.42238 1.71398 5.31572 2.36065L5.17572 3.21398C4.55572 3.25398 3.93572 3.29398 3.31572 3.35398L1.95572 3.48732C1.67572 3.51398 1.47572 3.76065 1.50238 4.03398C1.52905 4.30732 1.76905 4.50732 2.04905 4.48065L3.40905 4.34732C6.90238 4.00065 10.4224 4.13398 13.9557 4.48732C13.9757 4.48732 13.989 4.48732 14.0091 4.48732C14.2624 4.48732 14.4824 4.29398 14.5091 4.03398C14.529 3.76065 14.3291 3.51398 14.0491 3.48732Z" fill="#3A404A"/>
                                  <path d="M12.8211 5.42602C12.6611 5.25935 12.4411 5.16602 12.2145 5.16602H3.7878C3.56114 5.16602 3.33447 5.25935 3.18114 5.42602C3.0278 5.59268 2.94114 5.81935 2.95447 6.05268L3.3678 12.8927C3.44114 13.906 3.53447 15.1727 5.86114 15.1727H10.1411C12.4678 15.1727 12.5611 13.9127 12.6345 12.8927L13.0478 6.05935C13.0611 5.81935 12.9745 5.59268 12.8211 5.42602ZM9.1078 11.8327H6.8878C6.61447 11.8327 6.3878 11.606 6.3878 11.3327C6.3878 11.0593 6.61447 10.8327 6.8878 10.8327H9.1078C9.38113 10.8327 9.6078 11.0593 9.6078 11.3327C9.6078 11.606 9.38113 11.8327 9.1078 11.8327ZM9.6678 9.16602H6.33447C6.06114 9.16602 5.83447 8.93935 5.83447 8.66602C5.83447 8.39268 6.06114 8.16602 6.33447 8.16602H9.6678C9.94113 8.16602 10.1678 8.39268 10.1678 8.66602C10.1678 8.93935 9.94113 9.16602 9.6678 9.16602Z" fill="#3A404A"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                          {/* File Info */}
                          <div className="p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-poppins text-black truncate">{file.name}</span>
                              <span className="text-xs font-poppins text-gray-500">{file.size}</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Add a caption (optional)"
                              value={file.caption}
                              onChange={(e) => {
                                setUploadedFiles(files => 
                                  files.map(f => f.id === file.id ? {...f, caption: e.target.value} : f)
                                )
                              }}
                              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-xs font-poppins text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference Links */}
                <div>
                  <h3 className="text-sm font-inter font-medium text-black mb-4">Reference Links</h3>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="Paste a URL (e.g., Dribbble, Behance, Pinterest)"
                      value={formData.referenceUrl}
                      onChange={(e) => setFormData({...formData, referenceUrl: e.target.value})}
                      className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-lg text-sm font-poppins text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="absolute left-3 top-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19.0712 14.2396C18.7812 14.5296 18.3212 14.5296 18.0413 14.2396C17.7513 13.9496 17.7513 13.4896 18.0413 13.2096C20.0413 11.2096 20.0413 7.95961 18.0413 5.96961C16.0413 3.97961 12.7912 3.96961 10.8012 5.96961C8.81125 7.96961 8.80125 11.2196 10.8012 13.2096C11.0912 13.4996 11.0912 13.9596 10.8012 14.2396C10.5112 14.5296 10.0512 14.5296 9.77125 14.2396C7.20125 11.6696 7.20125 7.48961 9.77125 4.92961C12.3412 2.36961 16.5212 2.35961 19.0812 4.92961C21.6412 7.49961 21.6412 11.6696 19.0712 14.2396Z" fill="#737373"/>
                        <path d="M4.92875 9.76047C5.21875 9.47047 5.67875 9.47047 5.95875 9.76047C6.24875 10.0505 6.24875 10.5105 5.95875 10.7905C3.95875 12.7905 3.95875 16.0405 5.95875 18.0305C7.95875 20.0205 11.2088 20.0305 13.1988 18.0305C15.1888 16.0305 15.1988 12.7805 13.1988 10.7905C12.9088 10.5005 12.9088 10.0405 13.1988 9.76047C13.4888 9.47047 13.9488 9.47047 14.2288 9.76047C16.7988 12.3305 16.7988 16.5105 14.2288 19.0705C11.6588 21.6305 7.47875 21.6405 4.91875 19.0705C2.35875 16.5005 2.35875 12.3305 4.92875 9.76047Z" fill="#737373"/>
                      </svg>
                    </div>
                    <div className="absolute right-3 top-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 12.75L6 12.75C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25L18 11.25C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" fill="#7602FD"/>
                        <path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18L11.25 6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6L12.75 18C12.75 18.41 12.41 18.75 12 18.75Z" fill="#7602FD"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <h3 className="text-sm font-inter font-medium text-black mb-4">Additional Notes</h3>
                  <textarea
                    placeholder="Add any additional context about your reference materials..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg text-sm font-poppins text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Messages */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#FEF2F2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error posting job</h3>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {draftError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#FEF2F2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error saving draft</h3>
                  <p className="text-sm text-red-700 mt-1">{draftError}</p>
                </div>
              </div>
            </div>
          )}

          {draftSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#F0FDF4"/>
                  <path d="M13.5 8L8.5 13L6.5 11" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800">Draft saved successfully</h3>
                  <p className="text-sm text-green-700 mt-1">{draftSuccess}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={handleSaveDraft}
              disabled={isDraftSaving || isSubmitting}
              className="flex items-center gap-3 px-8 py-3 border border-gray-300 text-gray-600 rounded-lg font-poppins text-base hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDraftSaving ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 8.12435C9.91667 8.12435 9.84167 8.10768 9.75833 8.07435C9.525 7.98268 9.375 7.74935 9.375 7.49935V1.66602C9.375 1.32435 9.65833 1.04102 10 1.04102C10.3417 1.04102 10.625 1.32435 10.625 1.66602V5.99102L11.225 5.39102C11.4667 5.14935 11.8667 5.14935 12.1083 5.39102C12.35 5.63268 12.35 6.03268 12.1083 6.27435L10.4417 7.94102C10.325 8.05768 10.1667 8.12435 10 8.12435Z" fill="#7F7F7F"/>
                    <path d="M10.0005 8.12552C9.84219 8.12552 9.68385 8.06719 9.55885 7.94219L7.89219 6.27552C7.65052 6.03385 7.65052 5.63385 7.89219 5.39219C8.13385 5.15052 8.53385 5.15052 8.77552 5.39219L10.4422 7.05885C10.6839 7.30052 10.6839 7.70052 10.4422 7.94219C10.3172 8.06719 10.1589 8.12552 10.0005 8.12552Z" fill="#7F7F7F"/>
                    <path d="M11.4651 14.7923H8.52344C7.64844 14.7923 6.8651 14.309 6.47344 13.5257L5.49844 11.5757C5.4651 11.5007 5.3901 11.459 5.3151 11.459H1.64844C1.30677 11.459 1.02344 11.1757 1.02344 10.834C1.02344 10.4923 1.30677 10.209 1.64844 10.209H5.32344C5.88177 10.209 6.38177 10.5173 6.63177 11.0173L7.60677 12.9673C7.78177 13.3257 8.1401 13.5423 8.5401 13.5423H11.4818C11.8818 13.5423 12.2401 13.3257 12.4151 12.9673L13.3901 11.0173C13.6401 10.5173 14.1401 10.209 14.6984 10.209H18.3318C18.6734 10.209 18.9568 10.4923 18.9568 10.834C18.9568 11.1757 18.6734 11.459 18.3318 11.459H14.6984C14.6151 11.459 14.5484 11.5007 14.5151 11.5757L13.5401 13.5257C13.1234 14.309 12.3401 14.7923 11.4651 14.7923Z" fill="#7F7F7F"/>
                    <path d="M12.4974 18.9584H7.4974C2.9724 18.9584 1.03906 17.0251 1.03906 12.5001V9.16677C1.03906 5.25844 2.48906 3.3001 5.73906 2.8251C6.08906 2.7751 6.3974 3.00844 6.4474 3.3501C6.4974 3.69177 6.26406 4.00844 5.9224 4.05844C3.30573 4.44177 2.28906 5.8751 2.28906 9.16677V12.5001C2.28906 16.3418 3.65573 17.7084 7.4974 17.7084H12.4974C16.3391 17.7084 17.7057 16.3418 17.7057 12.5001V9.16677C17.7057 5.8751 16.6891 4.44177 14.0724 4.05844C13.7307 4.00844 13.4974 3.69177 13.5474 3.3501C13.5974 3.00844 13.9141 2.7751 14.2557 2.8251C17.5057 3.3001 18.9557 5.25844 18.9557 9.16677V12.5001C18.9557 17.0251 17.0224 18.9584 12.4974 18.9584Z" fill="#7F7F7F"/>
                  </svg>
                  Save as Draft
                </>
              )}
            </button>
            <button
              onClick={handlePostJob}
              disabled={isSubmitting || isDraftSaving}
              className="flex items-center gap-3 px-8 py-3 bg-purple-600 text-white rounded-lg font-poppins text-base hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13.4516 2.46719L5.92656 4.96719C0.868229 6.65886 0.868229 9.41719 5.92656 11.1005L8.1599 11.8422L8.90156 14.0755C10.5849 19.1339 13.3516 19.1339 15.0349 14.0755L17.5432 6.55886C18.6599 3.18386 16.8266 1.34219 13.4516 2.46719ZM13.7182 6.95052L10.5516 10.1339C10.4266 10.2589 10.2682 10.3172 10.1099 10.3172C9.95156 10.3172 9.79323 10.2589 9.66823 10.1339C9.42656 9.89219 9.42656 9.49219 9.66823 9.25052L12.8349 6.06719C13.0766 5.82552 13.4766 5.82552 13.7182 6.06719C13.9599 6.30886 13.9599 6.70886 13.7182 6.95052Z" fill="white"/>
                  </svg>
                  Post Job
                </>
              )}
            </button>
          </div>

          {/* Tips Section */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                  <path d="M8.5 12C8.8 11.0031 9.42188 10.1531 10.0375 9.30625C10.2 9.08437 10.3625 8.8625 10.5188 8.6375C11.1375 7.74687 11.5 6.66875 11.5 5.50313C11.5 2.4625 9.0375 0 6 0C2.9625 0 0.5 2.4625 0.5 5.5C0.5 6.66563 0.8625 7.74687 1.48125 8.63437C1.6375 8.85938 1.8 9.08125 1.9625 9.30313C2.58125 10.15 3.20312 11.0031 3.5 11.9969H8.5V12ZM6 16C7.38125 16 8.5 14.8813 8.5 13.5V13H3.5V13.5C3.5 14.8813 4.61875 16 6 16ZM3.5 5.5C3.5 5.775 3.275 6 3 6C2.725 6 2.5 5.775 2.5 5.5C2.5 3.56562 4.06562 2 6 2C6.275 2 6.5 2.225 6.5 2.5C6.5 2.775 6.275 3 6 3C4.61875 3 3.5 4.11875 3.5 5.5Z" fill="#FBBF24"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-800 font-poppins mb-2">
                  Tips for a Great Job Post
                </h3>
                <div className="space-y-1 text-sm text-gray-600 font-poppins">
                  <p>• Be specific about what you want and include visual examples if possible</p>
                  <p>• Set a realistic budget and timeline to attract serious freelancers</p>
                  <p>• Mention any specific skills or experience required</p>
                  <p>• Include your brand guidelines or style preferences</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path d="M8.0026 1.83398C4.32927 1.83398 1.33594 4.82732 1.33594 8.50065C1.33594 12.174 4.32927 15.1673 8.0026 15.1673C11.6759 15.1673 14.6693 12.174 14.6693 8.50065C14.6693 4.82732 11.6759 1.83398 8.0026 1.83398ZM7.5026 5.83398C7.5026 5.56065 7.72927 5.33398 8.0026 5.33398C8.27594 5.33398 8.5026 5.56065 8.5026 5.83398V9.16732C8.5026 9.44065 8.27594 9.66732 8.0026 9.66732C7.72927 9.66732 7.5026 9.44065 7.5026 9.16732V5.83398ZM8.61594 11.4207C8.5826 11.5073 8.53594 11.574 8.47594 11.6407C8.40927 11.7007 8.33594 11.7473 8.25594 11.7807C8.17594 11.814 8.08927 11.834 8.0026 11.834C7.91594 11.834 7.82927 11.814 7.74927 11.7807C7.66927 11.7473 7.59594 11.7007 7.52927 11.6407C7.46927 11.574 7.4226 11.5073 7.38927 11.4207C7.35594 11.3407 7.33594 11.254 7.33594 11.1673C7.33594 11.0807 7.35594 10.994 7.38927 10.914C7.4226 10.834 7.46927 10.7607 7.52927 10.694C7.59594 10.634 7.66927 10.5873 7.74927 10.554C7.90927 10.4873 8.09594 10.4873 8.25594 10.554C8.33594 10.5873 8.40927 10.634 8.47594 10.694C8.53594 10.7607 8.5826 10.834 8.61594 10.914C8.64927 10.994 8.66927 11.0807 8.66927 11.1673C8.66927 11.254 8.64927 11.3407 8.61594 11.4207Z" fill="#7602FD"/>
                  </svg>
                  <p className="text-sm text-gray-600 font-poppins">
                    Most jobs get responses within 24 hours of posting.
                  </p>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.svg,.ai,.psd"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
    )
  }
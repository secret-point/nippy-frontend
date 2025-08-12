import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavigationHeader } from '../components/ui'
import { authAPI } from '../services/authApi'

interface UserSelection {
  type: 'client' | 'freelancer' | null
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

const businessTypes = [
  { id: 'cafe', label: 'Café', icon: '☕' },
  { id: 'saloon', label: 'Saloon', icon: '✂️' },
  { id: 'clothing', label: 'Clothing Store', icon: '👕' },
  { id: 'food', label: 'Food Business', icon: '🍽️' },
  { id: 'other', label: 'Other', icon: '🏢' }
]

const UserRoleSelection = ({ onSelect }: { onSelect: (type: 'client' | 'freelancer') => void }) => {
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null)
  const navigate = useNavigate()

  const handleCardSelect = (type: 'client' | 'freelancer') => {
    setSelectedRole(type)
  }

  const handleCreateAccount = () => {
    if (selectedRole) {
      onSelect(selectedRole)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Join Nippy as a client or a freelancer
          </h1>
          <p className="text-lg text-gray-600 mb-16">
            Choose how you would like to use Nippy
          </p>

          {/* Selection Cards */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
            {/* Client Card */}
            <div 
              onClick={() => handleCardSelect('client')}
              className={`w-full max-w-sm p-6 border-2 bg-white rounded-2xl cursor-pointer hover:shadow-lg transition-all ${
                selectedRole === 'client'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-3 rounded-2xl ${
                  selectedRole === 'client' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-black mb-1">
                    I'm a Client, looking to hire designers
                  </h3>
                  <p className="text-gray-600">
                    I need help with designs or the creative side of my business
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    selectedRole === 'client'
                      ? 'bg-green-500'
                      : 'border border-gray-300'
                  }`}>
                    {selectedRole === 'client' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Freelancer Card */}
            <div 
              onClick={() => handleCardSelect('freelancer')}
              className={`w-full max-w-sm p-6 border-2 bg-white rounded-2xl cursor-pointer hover:shadow-lg transition-all ${
                selectedRole === 'freelancer'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-3 rounded-2xl ${
                  selectedRole === 'freelancer' ? 'bg-green-100' : 'border border-gray-200'
                }`}>
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-black mb-1">
                    I'm a Freelance Designer, looking for work
                  </h3>
                  <p className="text-gray-600">
                    I can create ads, graphic posters or videos
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    selectedRole === 'freelancer'
                      ? 'bg-green-500'
                      : 'border border-gray-300'
                  }`}>
                    {selectedRole === 'freelancer' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Account Button */}
          <button 
            onClick={handleCreateAccount}
            disabled={!selectedRole}
            className={`px-8 py-3 font-medium rounded-xl transition-colors ${
              selectedRole
                ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Account
          </button>

          <div className="mt-6 text-gray-500">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/client-login')}
              className="text-black font-medium hover:underline"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const BusinessTypeSelection = ({ onSelect, onSkip }: { 
  onSelect: (types: string[]) => void
  onSkip: () => void 
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    )
  }

  const getBusinessIcon = (type: string) => {
    switch (type) {
      case 'cafe':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.125 0.5C3.50156 0.5 3 1.00156 3 1.625C3 3.44844 4.09687 4.40937 4.83281 5.05156L4.88437 5.09844C5.64844 5.76406 6 6.12031 6 6.875C6 7.49844 6.50156 8 7.125 8C7.74844 8 8.25 7.49844 8.25 6.875C8.25 5.05156 7.15312 4.09063 6.41719 3.44844L6.36563 3.40156C5.60156 2.73594 5.25 2.37969 5.25 1.625C5.25 1.00156 4.74844 0.5 4.125 0.5ZM1.5 9.5C0.670312 9.5 0 10.1703 0 11V20C0 22.4844 2.01562 24.5 4.5 24.5H13.5C15.9844 24.5 18 22.4844 18 20H18.75C21.6516 20 24 17.6516 24 14.75C24 11.8484 21.6516 9.5 18.75 9.5H16.5H1.5ZM18 12.5H18.75C19.9922 12.5 21 13.5078 21 14.75C21 15.9922 19.9922 17 18.75 17H18V12.5ZM10.5 1.625C10.5 1.00156 9.99844 0.5 9.375 0.5C8.75156 0.5 8.25 1.00156 8.25 1.625C8.25 3.44844 9.34688 4.40937 10.0828 5.05156L10.1344 5.09844C10.8984 5.76406 11.25 6.12031 11.25 6.875C11.25 7.49844 11.7516 8 12.375 8C12.9984 8 13.5 7.49844 13.5 6.875C13.5 5.05156 12.4031 4.09063 11.6672 3.44844L11.6156 3.40156C10.8516 2.73594 10.5 2.37969 10.5 1.625Z"/>
          </svg>
        )
      case 'saloon':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9L10.1484 7.14844C10.3781 6.55781 10.5 5.92031 10.5 5.25C10.5 2.34844 8.15156 0 5.25 0C2.34844 0 0 2.34844 0 5.25C0 8.15156 2.34844 10.5 5.25 10.5C5.92031 10.5 6.55781 10.3734 7.14844 10.1484L9 12L7.14844 13.8516C6.55781 13.6219 5.92031 13.5 5.25 13.5C2.34844 13.5 0 15.8484 0 18.75C0 21.6516 2.34844 24 5.25 24C8.15156 24 10.5 21.6516 10.5 18.75C10.5 18.0797 10.3734 17.4422 10.1484 16.8516L23.4 3.6C23.7328 3.26719 23.7328 2.73281 23.4 2.4C22.0734 1.07344 19.9266 1.07344 18.6 2.4L12 9Z"/>
          </svg>
        )
      case 'clothing':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 30 25">
            <path d="M9.92839 1C10.294 1 10.5987 1.26719 10.7112 1.61875C11.2878 3.43281 12.9893 4.75 15.0003 4.75C17.0112 4.75 18.7128 3.43281 19.2893 1.61875C19.4018 1.26719 19.7065 1 20.0721 1H20.6628C21.7175 1 22.7346 1.37031 23.5456 2.04531L29.4612 6.97188C29.7706 7.22969 29.9628 7.60469 29.9956 8.00781C30.0284 8.41094 29.8971 8.80938 29.6299 9.11406L27.0049 12.1141C26.4706 12.7281 25.5424 12.7984 24.9143 12.2781L22.5003 10.2672V22C22.5003 23.6547 21.155 25 19.5003 25H10.5003C8.84558 25 7.50026 23.6547 7.50026 22V10.2672L5.0862 12.2781C4.46276 12.7984 3.53464 12.7281 2.99558 12.1141L0.370575 9.11406C0.103388 8.80938 -0.0278621 8.41094 0.00495037 8.00781C0.0377629 7.60469 0.22995 7.22969 0.539325 6.97188L6.45495 2.04531C7.26589 1.37031 8.28308 1 9.33776 1H9.92839Z"/>
          </svg>
        )
      case 'food':
        return (
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 25">
            <path d="M20.5 1C19.75 1 14.5 2.5 14.5 9.25V14.5C14.5 16.1547 15.8453 17.5 17.5 17.5H19V23.5C19 24.3297 19.6703 25 20.5 25C21.3297 25 22 24.3297 22 23.5V17.5V12.25V2.5C22 1.67031 21.3297 1 20.5 1ZM4 1.75C4 1.36563 3.71406 1.04688 3.32969 1.00469C2.94531 0.9625 2.60313 1.21562 2.51875 1.58594L1.09844 7.975C1.03281 8.27031 1 8.57031 1 8.87031C1 11.0219 2.64531 12.7891 4.75 12.9813V23.5C4.75 24.3297 5.42031 25 6.25 25C7.07969 25 7.75 24.3297 7.75 23.5V12.9813C9.85469 12.7891 11.5 11.0219 11.5 8.87031C11.5 8.57031 11.4672 8.27031 11.4016 7.975L9.98125 1.58594C9.89688 1.21094 9.54531 0.9625 9.16562 1.00469C8.78594 1.04688 8.5 1.36563 8.5 1.75V8.04062C8.5 8.29375 8.29375 8.5 8.04062 8.5C7.80156 8.5 7.60469 8.31719 7.58125 8.07812L6.99531 1.68438C6.9625 1.29531 6.63906 1 6.25 1C5.86094 1 5.5375 1.29531 5.50469 1.68438L4.92344 8.07812C4.9 8.31719 4.70312 8.5 4.46406 8.5C4.21094 8.5 4.00469 8.29375 4.00469 8.04062V1.75H4ZM6.26406 8.875H6.25H6.23594L6.25 8.84219L6.26406 8.875Z"/>
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 25">
            <path d="M2.75 0.666016C1.50781 0.666016 0.5 1.67383 0.5 2.91602V22.416C0.5 23.6582 1.50781 24.666 2.75 24.666H7.25V20.916C7.25 19.6738 8.25781 18.666 9.5 18.666C10.7422 18.666 11.75 19.6738 11.75 20.916V24.666H16.25C17.4922 24.666 18.5 23.6582 18.5 22.416V2.91602C18.5 1.67383 17.4922 0.666016 16.25 0.666016H2.75Z"/>
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            What type of business do you run?
          </h1>
          <p className="text-lg text-gray-600 mb-16">
            This helps us recommend the right creatives for your needs.
          </p>

          {/* Business Type Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {businessTypes.slice(0, 4).map((type) => (
              <button
                key={type.id}
                onClick={() => toggleType(type.id)}
                className={`p-6 border rounded-2xl transition-all hover:shadow-md ${
                  selectedTypes.includes(type.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {getBusinessIcon(type.id)}
                  <span className="text-gray-900 font-medium">{type.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Other Option - Full Width */}
          <button
            onClick={() => toggleType('other')}
            className={`w-full max-w-2xl p-6 border rounded-2xl transition-all hover:shadow-md mb-8 ${
              selectedTypes.includes('other')
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              {getBusinessIcon('other')}
              <span className="text-gray-900 font-medium">Other</span>
            </div>
          </button>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={() => onSelect(selectedTypes)}
              disabled={selectedTypes.length === 0}
              className={`px-8 py-3 font-medium rounded-xl transition-colors ${
                selectedTypes.length > 0
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Proceed
            </button>
            
            <div>
              <button 
                onClick={onSkip}
                className="text-black font-medium hover:underline"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ClientSignupForm = ({ 
  onComplete, 
  selectedBusinessTypes = [] 
}: { 
  onComplete: (data: FormData) => void
  selectedBusinessTypes?: string[]
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    confirmPassword?: string
    agreeToTerms?: string
    general?: string // Add general error for API errors
  }

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Please enter 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setErrors(prev => ({ ...prev, general: undefined })) // Clear previous errors
      
      try {
        // Call the API with the form data
        await authAPI.registerClient({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          businessType: selectedBusinessTypes.length > 0 ? selectedBusinessTypes.join(', ') : 'general'
        })
        
        // If successful, call the completion handler
        onComplete(formData)
      } catch (error: any) {
        // Handle API errors
        setErrors(prev => ({ 
          ...prev, 
          general: error.message || 'Registration failed. Please try again.' 
        }))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Join Nippy as a Client
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="firstName"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      formData.firstName
                        ? '-top-2 text-xs bg-white px-1'
                        : 'top-3 text-gray-500'
                    } ${errors.firstName ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    First name
                  </label>
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="lastName"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      formData.lastName
                        ? '-top-2 text-xs bg-white px-1'
                        : 'top-3 text-gray-500'
                    } ${errors.lastName ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    Last Name
                  </label>
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.email
                      ? '-top-2 text-xs bg-white px-1'
                      : 'top-3 text-gray-500'
                  } ${errors.email ? 'text-red-500' : 'text-gray-500'}`}
                >
                  Work email
                </label>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.password
                      ? '-top-2 text-xs bg-white px-1'
                      : 'top-3 text-gray-500'
                  } ${errors.password ? 'text-red-500' : 'text-gray-500'}`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span>Please enter 8 characters</span>
                <span>{formData.password.length}/8</span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="confirmPassword"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.confirmPassword
                      ? '-top-2 text-xs bg-white px-1'
                      : 'top-3 text-gray-500'
                  } ${errors.confirmPassword ? 'text-red-500' : 'text-gray-500'}`}
                >
                  Password again
                </label>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
              <div className="mt-1 text-right text-sm text-gray-500">
                {formData.confirmPassword.length}/8
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => updateField('agreeToTerms', e.target.checked)}
                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                Yes, I understand and agree to the Nippy{' '}
                <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
            )}

            {/* General Error Display */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-8 py-3 font-medium rounded-xl transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center text-gray-500">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => window.location.href = '/client-login'}
                className="text-black font-medium hover:underline"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export const ClientPortal = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'role-selection' | 'business-type' | 'signup'>('role-selection')
  const [userSelection, setUserSelection] = useState<UserSelection>({ type: null })
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([])

  const handleRoleSelect = (type: 'client' | 'freelancer') => {
    setUserSelection({ type })
    if (type === 'client') {
      setCurrentStep('business-type')
    } else {
      // Handle freelancer flow - could redirect to different component
      console.log('Freelancer selected - redirect to freelancer portal')
    }
  }

  const handleBusinessTypeSelect = (types: string[]) => {
    setSelectedBusinessTypes(types)
    setCurrentStep('signup')
  }

  const handleSkipBusinessType = () => {
    setCurrentStep('signup')
  }

  const handleSignupComplete = (data: FormData) => {
    console.log('Client registration successful:', {
      userType: userSelection.type,
      businessTypes: selectedBusinessTypes,
      formData: data
    })
    // Navigate to dashboard after successful registration
    navigate("/client-dashboard")
  }

  if (currentStep === 'role-selection') {
    return <UserRoleSelection onSelect={handleRoleSelect} />
  }

  if (currentStep === 'business-type') {
    return (
      <BusinessTypeSelection 
        onSelect={handleBusinessTypeSelect}
        onSkip={handleSkipBusinessType}
      />
    )
  }

  if (currentStep === 'signup') {
    return (
      <ClientSignupForm 
        onComplete={handleSignupComplete}
        selectedBusinessTypes={selectedBusinessTypes}
      />
    )
  }

  return null
}

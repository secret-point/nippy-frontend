import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_CONFIG } from '../config/api'

/**
 * This component handles the Google OAuth callback when Google redirects to /oauth2callback
 * It extracts the authorization code and redirects to the backend callback endpoint
 */
export const GoogleOAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleOAuthCallback = () => {
      try {
        // Get the authorization code from Google
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          console.error('Google OAuth error:', error)
          navigate(`/client-login?error=oauth_error&message=${encodeURIComponent(error)}`)
          return
        }

        if (!code) {
          console.error('No authorization code received from Google')
          navigate('/client-login?error=no_code')
          return
        }

        // Get the backend API URL from API_CONFIG
        const apiBaseUrl = API_CONFIG.BASE_URL
        
        // Build the backend callback URL with all query parameters
        const queryString = window.location.search
        const backendCallbackUrl = `${apiBaseUrl}/auth/google/callback${queryString}`

        console.log('Redirecting to backend callback:', backendCallbackUrl)

        // Redirect to backend callback - backend will process and redirect to /auth/success?token=...
        window.location.href = backendCallbackUrl
      } catch (err) {
        console.error('Error handling OAuth callback:', err)
        navigate('/client-login?error=callback_error')
      }
    }

    handleOAuthCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing Google authentication...</p>
      </div>
    </div>
  )
}


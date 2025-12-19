import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token')
        const errorParam = searchParams.get('error')

        // Check for error from backend
        if (errorParam) {
          setError('Authentication failed. Please try again.')
          setTimeout(() => {
            navigate('/client-login?error=auth_failed')
          }, 3000)
          return
        }

        // Check if token exists
        if (!token) {
          setError('No authentication token received. Please try again.')
          setTimeout(() => {
            navigate('/client-login?error=no_token')
          }, 3000)
          return
        }

        // Store token in localStorage
        localStorage.setItem('token', token)

        // Fetch user data to store in localStorage
        try {
          // Use the token to get user info
          // We'll need to call an API endpoint that returns user data
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              localStorage.setItem('user', JSON.stringify(data.data))
            }
          }
        } catch (userError) {
          console.warn('Failed to fetch user data, but token is stored:', userError)
          // Token is stored, so we can still proceed
        }

        // Redirect to dashboard
        navigate('/client-dashboard')
      } catch (err) {
        console.error('Google OAuth callback error:', err)
        setError('An error occurred during authentication.')
        setTimeout(() => {
          navigate('/client-login?error=callback_error')
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-600 mb-4">{error}</div>
            <p className="text-gray-600">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  )
}


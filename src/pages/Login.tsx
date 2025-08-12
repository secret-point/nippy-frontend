import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Input from '../components/Input'
import Checkbox from '../components/Checkbox'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { authAPI } from '../services/authApi'

interface LoginProps {
  onForgotPassword?: () => void
  onLogin?: () => void
}

export function Login({ onForgotPassword, onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !password) {
      console.error('Email and password are required')
      return
    }
    
    setIsLoading(true)
    console.log('Login attempt with:', { email, password: password ? '***' : 'undefined' })
    
    try {
      const result = await authAPI.login(email, password)
      console.log('Login successful:', result)
      onLogin?.()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // In a real app, you'd get the Google token from the Google Sign-In process
      const mockGoogleToken = 'mock-google-token'
      const result = await authAPI.loginWithGoogle(mockGoogleToken)
      console.log('Google sign in successful:', result)
      onLogin?.()
    } catch (error) {
      console.error('Google sign in failed:', error)
    }
  }

  return (
    <AuthLayout
      title="Admin Dashboard"
      subtitle="Sign in to your account"
    >
      <div className="flex flex-col items-start gap-10 self-stretch">
        <GoogleSignInButton onClick={handleGoogleSignIn} />
        
        <div className="flex max-w-[568px] items-center gap-[13px] self-stretch">
          <div className="h-px bg-black flex-1"></div>
          <span className="text-black font-poppins text-base">or</span>
          <div className="h-px bg-black flex-1"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-start gap-12 self-stretch">
        <div className="flex flex-col items-start gap-12 self-stretch">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between items-center self-stretch">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={setRememberMe}
          />
          
          <button 
            type="button"
            onClick={onForgotPassword}
            className="text-[#5F42A1] font-poppins text-xs font-medium hover:text-[#4a3580] transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        <Button type="submit" className="self-stretch" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}

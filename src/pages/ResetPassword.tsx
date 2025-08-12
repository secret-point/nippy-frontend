import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Input from '../components/Input'
import { authAPI } from '../services/authApi'

interface ResetPasswordProps {
  onBackToLogin?: () => void
  onResetSubmit?: () => void
}

export function ResetPassword({ onBackToLogin, onResetSubmit }: ResetPasswordProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await authAPI.resetPassword(email)
      onResetSubmit?.()
    } catch (error) {
      console.error('Password reset failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit} className="flex flex-col items-start gap-12 self-stretch">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className="flex flex-col items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send reset link'}
          </Button>
          
          <Button variant="link" onClick={onBackToLogin}>
            ← Back to login
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}

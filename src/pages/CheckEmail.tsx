import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'

interface CheckEmailProps {
  email?: string
  onBackToLogin?: () => void
}

export function CheckEmail({ email = "hussainigaladimau@gmail.com", onBackToLogin }: CheckEmailProps) {
  return (
    <AuthLayout
      title="Check your email"
      subtitle="We've sent a password reset link to your email address"
    >
      <div className="flex flex-col items-center gap-6 self-stretch">
        <div className="flex w-14 h-14 p-4 justify-center items-center rounded-full bg-green-50">
          <svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6.5L9 17.5L4 12.5" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <p className="self-stretch text-gray-600 text-center font-medium text-base leading-6">
          If an account exists with <span className="font-semibold">{email}</span>, we've sent instructions to reset your password.
        </p>
      </div>

      <Button onClick={onBackToLogin} className="w-full">
        Return to login
      </Button>
    </AuthLayout>
  )
}

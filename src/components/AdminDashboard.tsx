import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Login } from '../pages/Login'
import { ResetPassword } from '../pages/ResetPassword'
import { CheckEmail } from '../pages/CheckEmail'
import { Dashboard } from '../pages/Dashboard'
import { UserManagement } from '../pages/UserManagement'
import { JobManagement } from '../pages/JobManagement'
import { PaymentManagement } from '../pages/PaymentManagement'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { Logo } from './Logo'

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-white flex justify-center items-center px-4 py-8">
    <div className="flex w-full max-w-[560px] flex-col items-center gap-10">
      <Logo />
      {children}
    </div>
  </div>
)

export const AdminDashboard: React.FC = () => {
  const {
    isAuthenticated,
    userRole,
    currentAuthPage,
    resetEmail,
    login,
    navigateToResetPassword,
    navigateToCheckEmail,
    navigateToLogin
  } = useAuth()

  if (!isAuthenticated) {
    return (
      <AuthWrapper>
        {currentAuthPage === 'login' && (
          <Login
            onForgotPassword={navigateToResetPassword}
            onLogin={login}
          />
        )}
        {currentAuthPage === 'reset-password' && (
          <ResetPassword
            onBackToLogin={navigateToLogin}
            onResetSubmit={() => navigateToCheckEmail()}
          />
        )}
        {currentAuthPage === 'check-email' && (
          <CheckEmail
            email={resetEmail}
            onBackToLogin={navigateToLogin}
          />
        )}
      </AuthWrapper>
    )
  }

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="jobs" element={<JobManagement />} />
      
      {/* Super admin only routes */}
      {userRole === 'super_admin' && (
        <>
          <Route path="payments" element={<PaymentManagement />} />
          <Route 
            path="notifications" 
            element={<PlaceholderPage title="Notifications" description="Notifications management coming soon..." />} 
          />
          <Route 
            path="settings" 
            element={<PlaceholderPage title="Settings" description="Settings coming soon..." />} 
          />
          <Route 
            path="security" 
            element={<PlaceholderPage title="Security & Logs" description="Security and logs coming soon..." />} 
          />
        </>
      )}
      
      {/* Common routes for both roles */}
      <Route 
        path="content" 
        element={<PlaceholderPage title="Content Manager" description="Content management coming soon..." />} 
      />
      <Route 
        path="disputes" 
        element={<PlaceholderPage title="Dispute Resolution" description="Dispute resolution coming soon..." />} 
      />
      <Route 
        path="reviews" 
        element={<PlaceholderPage title="Review Moderation" description="Review moderation coming soon..." />} 
      />
      <Route 
        path="analytics" 
        element={<PlaceholderPage title="Analytics" description="Analytics dashboard coming soon..." />} 
      />
    </Routes>
  )
}

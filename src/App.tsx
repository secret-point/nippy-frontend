import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import { DashboardLayout } from './components/DashboardLayout'
import { ModeratorDashboardLayout } from './components/ModeratorDashboardLayout'
import { Login } from './pages/Login'
import { ResetPassword } from './pages/ResetPassword'
import { CheckEmail } from './pages/CheckEmail'
import { Dashboard } from './pages/Dashboard'
import { UserManagement } from './pages/UserManagement'
import { JobManagement } from './pages/JobManagement'
import { PaymentManagement } from './pages/PaymentManagement'
import { ClientPortal } from './pages/ClientPortal'
import { ClientDashboard } from './pages/ClientDashboard'
import { BrowseFreelancers } from './pages/BrowseFreelancers'
import { Jobs } from './pages/Jobs'
import { PostJob } from './pages/PostJob'
import { JobDetails } from './pages/JobDetails'
import { ViewProfile } from './pages/ViewProfile'
import { ViewProfileReviews } from './pages/ViewProfileReviews'
import { Messages } from './pages/Messages'
import { ProjectFilesPage } from './pages/ProjectFiles'
import { PaymentHistory } from './pages/PaymentHistory'
import { AddPaymentMethod } from './pages/AddPaymentMethod'
import { Settings } from './pages/Settings'
import FAQs from './pages/FAQs'
import ContactSupport from './pages/ContactSupport'
import Notifications from './pages/Notifications'
import ClientLayout from './components/ClientLayout'
import { ClientLogin } from './pages/ClientLogin'

type AuthPage = 'login' | 'reset-password' | 'check-email'
type UserRole = 'super_admin' | 'moderator'

// Admin Dashboard Routes Component
const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole] = useState<UserRole>('moderator') // Removed setUserRole as it's not used
  const [currentAuthPage, setCurrentAuthPage] = useState<AuthPage>('login')
  const [resetEmail, setResetEmail] = useState('')

  // Auth page navigation handlers
  const navigateToResetPassword = () => setCurrentAuthPage('reset-password')
  const navigateToCheckEmail = (email?: string) => {
    if (email) setResetEmail(email)
    setCurrentAuthPage('check-email')
  }
  const navigateToLogin = () => setCurrentAuthPage('login')

  // Mock authentication - replace with real auth logic
  const handleLogin = () => setIsAuthenticated(true)

  // Select the appropriate dashboard layout based on user role
  const DashboardLayoutComponent = userRole === 'super_admin' ? DashboardLayout : ModeratorDashboardLayout

  if (!isAuthenticated) {
    return (
      <AuthLayout title="Admin Login" subtitle="Please sign in to continue">
        {currentAuthPage === 'login' && (
          <Login
            onForgotPassword={navigateToResetPassword}
            onLogin={handleLogin}
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
      </AuthLayout>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayoutComponent />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="jobs" element={<JobManagement />} />
        {/* Conditionally render super admin only routes */}
        {userRole === 'super_admin' && (
          <>
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="notifications" element={
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <div className="bg-white p-8 rounded-xl border border-gray-200">
                  <p className="text-gray-600">Notifications management coming soon...</p>
                </div>
              </div>
            } />
            <Route path="settings" element={
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <div className="bg-white p-8 rounded-xl border border-gray-200">
                  <p className="text-gray-600">Settings coming soon...</p>
                </div>
              </div>
            } />
            <Route path="security" element={
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Security & Logs</h1>
                <div className="bg-white p-8 rounded-xl border border-gray-200">
                  <p className="text-gray-600">Security and logs coming soon...</p>
                </div>
              </div>
            } />
          </>
        )}
        {/* Common routes for both roles */}
        <Route path="content" element={
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Content Manager</h1>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <p className="text-gray-600">Content management coming soon...</p>
            </div>
          </div>
        } />
        <Route path="disputes" element={
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dispute Resolution</h1>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <p className="text-gray-600">Dispute resolution coming soon...</p>
            </div>
          </div>
        } />
        <Route path="reviews" element={
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Review Moderation</h1>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <p className="text-gray-600">Review moderation coming soon...</p>
            </div>
          </div>
        } />
        <Route path="analytics" element={
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <p className="text-gray-600">Analytics dashboard coming soon...</p>
            </div>
          </div>
        } />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Client registration route - no layout needed */}
        <Route path="/client-login" element={<ClientLogin />} />

        <Route path="/client-portal" element={<ClientPortal />} />

        {/* Client dashboard routes with shared layout */}
        <Route path="/client-dashboard" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
        </Route>
        <Route path="/browse-freelancers" element={<ClientLayout />}>
          <Route index element={<BrowseFreelancers />} />
        </Route>
        <Route path="/jobs" element={<ClientLayout />}>
          <Route index element={<Jobs />} />
        </Route>
        <Route path="/post-job" element={<ClientLayout />}>
          <Route index element={<PostJob />} />
        </Route>
        <Route path="/jobs/:id" element={<ClientLayout />}>
          <Route index element={<JobDetails />} />
        </Route>
        <Route path="/profile/:id" element={<ClientLayout />}>
          <Route index element={<ViewProfile />} />
        </Route>
        <Route path="/profile/:id/reviews" element={<ClientLayout />}>
          <Route index element={<ViewProfileReviews />} />
        </Route>
        <Route path="/messages" element={<ClientLayout />}>
          <Route index element={<Messages />} />
        </Route>
        <Route path="/project-files" element={<ClientLayout />}>
          <Route index element={<ProjectFilesPage />} />
        </Route>
        <Route path="/payment-history" element={<ClientLayout />}>
          <Route index element={<PaymentHistory />} />
        </Route>
        <Route path="/add-payment-method" element={<ClientLayout />}>
          <Route index element={<AddPaymentMethod onClose={() => window.history.back()} onSuccess={() => window.location.href = '/payment-history'} />} />
        </Route>
        <Route path="/settings" element={<ClientLayout />}>
          <Route index element={<Settings />} />
        </Route>
        <Route path="/faqs" element={<ClientLayout />}>
          <Route index element={<FAQs />} />
        </Route>
        <Route path="/contact-support" element={<ClientLayout />}>
          <Route index element={<ContactSupport />} />
        </Route>
        <Route path="/notifications" element={<ClientLayout />}>
          <Route index element={<Notifications />} />
        </Route>

        {/* Redirect root to client login */}
        <Route path="/" element={<Navigate to="/client-login" replace />} />
        
        {/* Admin routes - require authentication */}
        <Route path="/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App

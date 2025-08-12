import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { ErrorBoundary } from '../components/ErrorBoundary'

interface RootLayoutProps {
  children?: React.ReactNode
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {children || <Outlet />}
      </AuthProvider>
    </ErrorBoundary>
  )
}

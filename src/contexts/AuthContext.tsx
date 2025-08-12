import React, { createContext, useContext, useState, ReactNode } from 'react'
import { UserRole, AuthPage } from '../types'

interface AuthState {
  isAuthenticated: boolean
  userRole: UserRole
  currentAuthPage: AuthPage
  resetEmail: string
}

interface AuthContextType extends AuthState {
  login: () => void
  logout: () => void
  setUserRole: (role: UserRole) => void
  navigateToResetPassword: () => void
  navigateToCheckEmail: (email?: string) => void
  navigateToLogin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userRole: 'moderator',
    currentAuthPage: 'login',
    resetEmail: ''
  })

  const login = () => {
    setAuthState(prev => ({ ...prev, isAuthenticated: true }))
  }

  const logout = () => {
    setAuthState(prev => ({ 
      ...prev, 
      isAuthenticated: false,
      currentAuthPage: 'login'
    }))
  }

  const setUserRole = (role: UserRole) => {
    setAuthState(prev => ({ ...prev, userRole: role }))
  }

  const navigateToResetPassword = () => {
    setAuthState(prev => ({ ...prev, currentAuthPage: 'reset-password' }))
  }

  const navigateToCheckEmail = (email?: string) => {
    setAuthState(prev => ({ 
      ...prev, 
      currentAuthPage: 'check-email',
      resetEmail: email || prev.resetEmail
    }))
  }

  const navigateToLogin = () => {
    setAuthState(prev => ({ ...prev, currentAuthPage: 'login' }))
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    setUserRole,
    navigateToResetPassword,
    navigateToCheckEmail,
    navigateToLogin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Logo } from './Logo'
import { Avatar, IconButton, NotificationIcon } from './ui'

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-18">
          <div className="flex items-center justify-between px-4 lg:px-8 py-6">
            <div className="flex items-center gap-6">
              <Logo />
              <span className="hidden md:block text-lg font-medium text-gray-900">
                Welcome Alex: Super Admin
              </span>
              <span className="md:hidden text-sm font-medium text-gray-900">
                Admin Panel
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Role Badge */}
              <div className="hidden md:flex px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                Super Admin
              </div>

              {/* Notification Icon */}
              <IconButton
                icon={<NotificationIcon />}
                variant="notification"
                aria-label="Notifications"
              />

              {/* Profile Avatar */}
              <Avatar initials="A" />
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

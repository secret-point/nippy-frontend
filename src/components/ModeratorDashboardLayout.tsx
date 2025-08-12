import { Outlet } from 'react-router-dom'
import { ModeratorSidebar } from './ModeratorSidebar'
import { Logo } from './Logo'
import { Avatar, IconButton, NotificationIcon } from './ui'

export const ModeratorDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <ModeratorSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-18">
          <div className="flex items-center justify-between px-4 lg:px-8 py-6">
            <div className="flex items-center gap-6">
              <Logo />
              <span className="hidden md:block text-lg font-medium text-gray-900">
                Welcome Sarah: Moderator
              </span>
              <span className="md:hidden text-sm font-medium text-gray-900">
                Moderator Panel
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Role Badge */}
              <div className="hidden md:flex px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Moderator
              </div>

              {/* Notification Icon */}
              <IconButton
                icon={<NotificationIcon />}
                variant="notification"
                aria-label="Notifications"
              />

              {/* Profile Avatar */}
              <Avatar initials="S" />
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

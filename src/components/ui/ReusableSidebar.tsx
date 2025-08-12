import React from 'react'
import { NavLink } from 'react-router-dom'

export interface SidebarItem {
  id: string
  label: string
  path: string
  icon: React.ReactNode
}

interface ReusableSidebarProps {
  items: SidebarItem[]
  className?: string
  logoPlaceholder?: boolean
}

export const ReusableSidebar: React.FC<ReusableSidebarProps> = ({ 
  items, 
  className = '',
  logoPlaceholder = true 
}) => {
  return (
    <div className={`w-64 h-screen bg-white border-r border-gray-200 shadow-sm hidden lg:block ${className}`}>
      <div className="flex flex-col h-full">
        {logoPlaceholder && (
          <div className="p-6">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        )}
        
        <nav className="flex-1 px-4 pb-4">
          <div className="space-y-2">
            {items.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <div className="w-[18px] h-4 flex-shrink-0">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

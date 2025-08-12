import React from 'react'

interface NavigationHeaderProps {
  rightContent?: React.ReactNode
  className?: string
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  rightContent, 
  className = "" 
}) => {
  return (
    <nav className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-black">nippy</div>
          </div>
          {rightContent || (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Looking for work?</span>
              <button className="px-5 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
                Join as a Freelancer
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

import React from 'react'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  headerContent?: React.ReactNode
  navigation?: React.ReactNode
  sidebar?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  background?: 'white' | 'gray'
  className?: string
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1104px]',
  full: 'w-full'
}

const spacingClasses = {
  sm: 'p-4',
  md: 'p-8',
  lg: 'p-11',
  xl: 'p-16'
}

const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50'
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  headerContent,
  navigation,
  sidebar,
  maxWidth = 'xl',
  spacing = 'lg',
  background = 'white',
  className = ''
}) => {
  return (
    <div className={`min-h-screen ${backgroundClasses[background]} ${className}`}>
      {navigation}
      
      <div className="flex">
        {sidebar}
        
        <main className={`flex-1 ${spacingClasses[spacing]}`}>
          <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
            {(title || subtitle || headerContent) && (
              <div className="mb-8">
                {(title || subtitle) && (
                  <div className="mb-6">
                    {title && (
                      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-lg text-gray-600">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
                {headerContent}
              </div>
            )}
            
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

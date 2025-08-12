import React from 'react'

interface AvatarProps {
  initials?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'purple' | 'gray' | 'white'
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-[72px] h-[72px] text-4xl'
}

const variantClasses = {
  primary: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  gray: 'bg-gray-100 text-gray-600',
  white: 'bg-white/90 text-gray-600'
}

export const Avatar: React.FC<AvatarProps> = ({ 
  initials = 'A', 
  size = 'md', 
  variant = 'purple',
  className = '' 
}) => {
  return (
    <div className={`
      ${sizeClasses[size]} 
      ${variantClasses[variant]} 
      rounded-full flex items-center justify-center font-medium
      ${className}
    `}>
      {initials}
    </div>
  )
}

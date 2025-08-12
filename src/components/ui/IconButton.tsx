import React from 'react'

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'save' | 'close' | 'notification'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  'aria-label'?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 p-1',
  md: 'w-8 h-8 p-2',
  lg: 'w-12 h-12 p-3'
}

const variantClasses = {
  default: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
  save: 'bg-white/90 hover:bg-white text-gray-600',
  close: 'hover:bg-gray-100 text-gray-400 hover:text-gray-600',
  notification: 'text-gray-400 hover:text-gray-600'
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  'aria-label': ariaLabel
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full flex items-center justify-center transition-colors
        ${className}
      `}
    >
      {icon}
    </button>
  )
}

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const classes = [
    'bg-white rounded-xl border border-gray-200',
    hover ? 'hover:shadow-md transition-shadow' : 'shadow-sm',
    paddingClasses[padding],
    className
  ].join(' ')

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

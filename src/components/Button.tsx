import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'link'
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
  required?: boolean
}

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  className = '',
  disabled = false
}: ButtonProps) {
  const baseClasses = "flex justify-center items-center gap-2 rounded-xl transition-colors font-poppins"
  
  const variants = {
    primary: "px-6 py-2.5 bg-[#5F42A1] text-white text-base font-medium shadow-[0_32px_24px_0_rgba(255,255,255,0.05)_inset,0_2px_1px_0_rgba(255,255,255,0.25)_inset,0_0_0_1px_rgba(0,0,0,0.15)_inset,0_-2px_1px_0_rgba(0,0,0,0.20)_inset,0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#4a3580]",
    link: "text-[#5F42A1] text-base font-medium hover:text-[#4a3580]"
  }
  
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

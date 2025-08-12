import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

export const CloseIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({ 
  className = '', 
  size = 24, 
  filled = false 
}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

export const EyeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

export const EyeOffIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
)

export const ChevronDownIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

export const ChevronUpIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({ 
  className = '', 
  size = 24, 
  filled = false 
}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

export const NotificationIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 19 20" fill="none">
    <g clipPath="url(#clip0_1_11066)">
      <path d="M9.3126 0C8.6212 0 8.0626 0.558594 8.0626 1.25V1.94922C5.23057 2.39844 3.0626 4.85156 3.0626 7.8125V9.11719C3.0626 10.8906 2.45713 12.6133 1.35167 13.9961L0.769634 14.7266C0.543072 15.0078 0.500103 15.3945 0.656353 15.7188C0.812603 16.043 1.14073 16.25 1.5001 16.25H17.1251C17.4845 16.25 17.8126 16.043 17.9689 15.7188C18.1251 15.3945 18.0821 15.0078 17.8555 14.7266L17.2735 13.9961C16.168 12.6133 15.5626 10.8906 15.5626 9.11719V7.8125C15.5626 4.85156 13.3946 2.39844 10.5626 1.94922V1.25C10.5626 0.558594 10.004 0 9.3126 0Z" fill="currentColor"/>
      <path d="M6.8126 18.75C6.8126 19.9922 7.82041 21 9.0626 21H9.5626C10.8048 21 11.8126 19.9922 11.8126 18.75H6.8126Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_1_11066">
        <path d="M0.5625 0H18.0625V20H0.5625V0Z" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

export const ArrowRightIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
)

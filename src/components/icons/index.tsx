import React from 'react'

interface IconProps {
  className?: string
  size?: number
  filled?: boolean
}

export const DashboardIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 19 16" fill="none" className={className}>
    <g clipPath="url(#clip0_40000002_3759)">
      <path d="M7.5 0H2.5C1.39688 0 0.5 0.896875 0.5 2V6C0.5 7.10312 1.39688 8 2.5 8H7.5C8.60312 8 9.5 7.10312 9.5 6V2C9.5 0.896875 8.60312 0 7.5 0ZM16.5 0H11.5C10.3969 0 9.5 0.896875 9.5 2V6C9.5 7.10312 10.3969 8 11.5 8H16.5C17.6031 8 18.5 7.10312 18.5 6V2C18.5 0.896875 17.6031 0 16.5 0ZM7.5 10H2.5C1.39688 10 0.5 10.8969 0.5 12V14C0.5 15.1031 1.39688 16 2.5 16H7.5C8.60312 16 9.5 15.1031 9.5 14V12C9.5 10.8969 8.60312 10 7.5 10ZM16.5 10H11.5C10.3969 10 9.5 10.8969 9.5 12V14C9.5 15.1031 10.3969 16 11.5 16H16.5C17.6031 16 18.5 15.1031 18.5 14V12C18.5 10.8969 17.6031 10 16.5 10Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_40000002_3759">
        <path d="M0.5 0H18.5V16H0.5V0Z" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

export const UsersIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 19 16" fill="none" className={className}>
    <path d="M5.5 4C5.5 2.89688 6.39688 2 7.5 2C8.60312 2 9.5 2.89688 9.5 4C9.5 5.10312 8.60312 6 7.5 6C6.39688 6 5.5 5.10312 5.5 4ZM11.5 4C11.5 2.89688 12.3969 2 13.5 2C14.6031 2 15.5 2.89688 15.5 4C15.5 5.10312 14.6031 6 13.5 6C12.3969 6 11.5 5.10312 11.5 4ZM1.5 13V14H13.5V13C13.5 11.3437 12.1562 10 10.5 10H4.5C2.84375 10 1.5 11.3437 1.5 13ZM15.5 10H14.5C15.6031 10 16.5 10.8969 16.5 12V14H18.5V13C18.5 11.3437 17.1562 10 15.5 10Z" fill="currentColor"/>
  </svg>
)

export const JobsIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 19 16" fill="none" className={className}>
    <path d="M6.96875 1.5H12.0312C12.1859 1.5 12.3125 1.6125 12.3125 1.75V3H6.6875V1.75C6.6875 1.6125 6.81406 1.5 6.96875 1.5ZM5 1.75V3H2.75C1.50898 3 0.5 3.89687 0.5 5V8H7.25H11.75H18.5V5C18.5 3.89687 17.491 3 16.25 3H14V1.75C14 0.784375 13.1176 0 12.0312 0H6.96875C5.88242 0 5 0.784375 5 1.75ZM18.5 9H11.75V10C11.75 10.5531 11.2781 11 10.75 11H8.25C7.69688 11 7.25 10.5531 7.25 10V9H0.5V13C0.5 14.1031 1.50898 15 2.75 15H16.25C17.491 15 18.5 14.1031 18.5 13V9Z" fill="currentColor"/>
  </svg>
)

export const PaymentsIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 19 16" fill="none" className={className}>
    <path d="M2.5 2C1.39688 2 0.5 2.76875 0.5 3.71429V4.57143H18.5V3.71429C18.5 2.76875 17.6031 2 16.5 2H2.5ZM18.5 7.14286H0.5V12.2857C0.5 13.2312 1.39688 14 2.5 14H16.5C17.6031 14 18.5 13.2312 18.5 12.2857V7.14286ZM4 10.5714H6C6.275 10.5714 6.5 10.7643 6.5 11C6.5 11.2357 6.275 11.4286 6 11.4286H4C3.725 11.4286 3.5 11.2357 3.5 11C3.5 10.7643 3.725 10.5714 4 10.5714Z" fill="currentColor"/>
  </svg>
)

export const MessagesIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 19 16" fill="none" className={className}>
    <path d="M2.75 0C1.50898 0 0.5 0.896875 0.5 2V11C0.5 12.1031 1.50898 13 2.75 13H6.125V15.5C6.125 15.6906 6.24453 15.8625 6.43438 15.9469C6.62422 16.0312 6.85273 16.0125 7.025 15.9L11.3738 13H16.25C17.491 13 18.5 12.1031 18.5 11V2C18.5 0.896875 17.491 0 16.25 0H2.75Z" fill="currentColor"/>
  </svg>
)

export const SettingsIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 19 16" fill="none" className={className}>
    <path d="M17.4185 5.20625C17.531 5.47813 17.4361 5.78125 17.1935 5.975L15.6713 7.20625C15.7099 7.46563 15.731 7.73125 15.731 8C15.731 8.26875 15.7099 8.53438 15.6713 8.79375L17.1935 10.025C17.4361 10.2188 17.531 10.5219 17.4185 10.7937C17.2638 11.1656 17.0775 11.5219 16.863 11.8656L16.6978 12.1187C16.4658 12.4625 16.2056 12.7875 15.9209 13.0938C15.7134 13.3188 15.3689 13.3812 15.0885 13.2156L13.3557 12.175C12.8892 12.5312 12.3751 12.8156 11.8189 13.0156L11.4416 15.0125C11.3713 15.3125 11.1287 15.5 10.8272 15.5H9.67278C9.37132 15.5 9.12873 15.3125 9.05842 15.0125L8.68108 13.0156C8.12491 12.8156 7.61077 12.5312 7.14428 12.175L5.41147 13.2156C5.13108 13.3812 4.78655 13.3188 4.57905 13.0938C4.29444 12.7875 4.03421 12.4625 3.80218 12.1187L3.63702 11.8656C3.42249 11.5219 3.23624 11.1656 3.08155 10.7937C2.96905 10.5219 3.064 10.2188 3.30655 10.025L4.82874 8.79375C4.79015 8.53438 4.76905 8.26875 4.76905 8C4.76905 7.73125 4.79015 7.46563 4.82874 7.20625L3.30655 5.975C3.064 5.78125 2.96905 5.47813 3.08155 5.20625C3.23624 4.83438 3.42249 4.47813 3.63702 4.13438L3.80218 3.88125C4.03421 3.5375 4.29444 3.2125 4.57905 2.90625C4.78655 2.68125 5.13108 2.61875 5.41147 2.78438L7.14428 3.825C7.61077 3.46875 8.12491 3.18438 8.68108 2.98438L9.05842 0.9875C9.12873 0.6875 9.37132 0.5 9.67278 0.5H10.8272C11.1287 0.5 11.3713 0.6875 11.4416 0.9875L11.8189 2.98438C12.3751 3.18438 12.8892 3.46875 13.3557 3.825L15.0885 2.78438C15.3689 2.61875 15.7134 2.68125 15.9209 2.90625C16.2056 3.2125 16.4658 3.5375 16.6978 3.88125L16.863 4.13438C17.0775 4.47813 17.2638 4.83438 17.4185 5.20625ZM10.25 11C11.9069 11 13.25 9.65688 13.25 8C13.25 6.34312 11.9069 5 10.25 5C8.59312 5 7.25 6.34312 7.25 8C7.25 9.65688 8.59312 11 10.25 11Z" fill="currentColor"/>
  </svg>
)

export const SearchIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 13L17 17M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" stroke="currentColor"/>
  </svg>
)

export const StarIcon: React.FC<IconProps> = ({ className = '', size = 16, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={filled ? "currentColor" : "none"} className={className}>
    <path d="M8 1L10.09 5.26L15 6L11.5 9.74L12.18 15L8 12.27L3.82 15L4.5 9.74L1 6L5.91 5.26L8 1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const HeartIcon: React.FC<IconProps> = ({ className = '', size = 16, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={filled ? "currentColor" : "none"} className={className}>
    <path d="M14 5.5C14 3.01 12 1 9.5 1C8.5 1 7.5 1.5 7 2.5C6.5 1.5 5.5 1 4.5 1C2 1 0 3.01 0 5.5C0 6.5 0.5 7.5 1 8L7 14L13 8C13.5 7.5 14 6.5 14 5.5Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ChevronDownIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const FilterIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 3H14M5 8H11M7 13H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const CloseIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

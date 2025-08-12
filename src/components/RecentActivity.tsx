import React from 'react'

interface ActivityItem {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
}

interface RecentActivityProps {
  title: string
  items?: ActivityItem[]
  iconType: 'user' | 'job' | 'dispute'
}

// Icon components for different activity types
const UserIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.75 1.83325C4.785 1.83325 3.1875 3.25325 3.1875 4.99992C3.1875 6.71325 4.695 8.09992 6.66 8.15992C6.72 8.15325 6.78 8.15325 6.825 8.15992C6.84 8.15992 6.8475 8.15992 6.8625 8.15992C6.87 8.15992 6.87 8.15992 6.8775 8.15992C8.7975 8.09992 10.305 6.71325 10.3125 4.99992C10.3125 3.25325 8.715 1.83325 6.75 1.83325Z" fill="#697386"/>
    <path d="M10.5602 9.93342C8.46771 8.69342 5.05521 8.69342 2.94771 9.93342C1.99521 10.5001 1.47021 11.2668 1.47021 12.0868C1.47021 12.9068 1.99521 13.6668 2.94021 14.2268C3.99021 14.8534 5.37021 15.1668 6.75021 15.1668C8.13021 15.1668 9.51021 14.8534 10.5602 14.2268C11.5052 13.6601 12.0302 12.9001 12.0302 12.0734C12.0227 11.2534 11.5052 10.4934 10.5602 9.93342Z" fill="#697386"/>
    <path d="M14.9925 5.39332C15.1125 6.68665 14.0775 7.81999 12.645 7.97332C12.6375 7.97332 12.6375 7.97332 12.63 7.97332H12.6075C12.5625 7.97332 12.5175 7.97332 12.48 7.98665C11.7525 8.01998 11.085 7.81332 10.5825 7.43332C11.355 6.81998 11.7975 5.89999 11.7075 4.89999C11.655 4.35998 11.445 3.86665 11.13 3.44665C11.415 3.31999 11.745 3.23999 12.0825 3.21332C13.5525 3.09999 14.865 4.07332 14.9925 5.39332Z" fill="#697386"/>
    <path d="M16.4927 11.5599C16.4327 12.2066 15.9677 12.7666 15.1877 13.1466C14.4377 13.5133 13.4927 13.6866 12.5552 13.6666C13.0952 13.2333 13.4102 12.6933 13.4702 12.1199C13.5452 11.2933 13.1027 10.4999 12.2177 9.86661C11.7152 9.51327 11.1302 9.23327 10.4927 9.02661C12.1502 8.59994 14.2352 8.88661 15.5177 9.80661C16.2077 10.2999 16.5602 10.9199 16.4927 11.5599Z" fill="#697386"/>
  </svg>
)

const JobIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1_11338)">
      <path d="M6.46875 2H11.5312C11.6859 2 11.8125 2.1125 11.8125 2.25V3.5H6.1875V2.25C6.1875 2.1125 6.31406 2 6.46875 2ZM4.5 2.25V3.5H2.25C1.00898 3.5 0 4.39687 0 5.5V8.5H6.75H11.25H18V5.5C18 4.39687 16.991 3.5 15.75 3.5H13.5V2.25C13.5 1.28438 12.6176 0.5 11.5312 0.5H6.46875C5.38242 0.5 4.5 1.28438 4.5 2.25ZM18 9.5H11.25V10.5C11.25 11.0531 10.7473 11.5 10.125 11.5H7.875C7.25273 11.5 6.75 11.0531 6.75 10.5V9.5H0V13.5C0 14.6031 1.00898 15.5 2.25 15.5H15.75C16.991 15.5 18 14.6031 18 13.5V9.5Z" fill="#697386"/>
    </g>
    <defs>
      <clipPath id="clip0_1_11338">
        <path d="M0 0.5H18V16.5H0V0.5Z" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

const getDefaultItems = (type: 'user' | 'job' | 'dispute'): ActivityItem[] => {
  const icon = type === 'user' ? <UserIcon /> : <JobIcon />
  
  if (type === 'user') {
    return [
      { id: '1', title: 'User #1', subtitle: 'Joined today', icon },
      { id: '2', title: 'User #2', subtitle: 'Joined today', icon },
      { id: '3', title: 'User #3', subtitle: 'Joined today', icon },
      { id: '4', title: 'User #4', subtitle: 'Joined today', icon }
    ]
  } else if (type === 'job') {
    return [
      { id: '1', title: 'Job #1', subtitle: 'Posted today', icon },
      { id: '2', title: 'Job #2', subtitle: 'Posted today', icon },
      { id: '3', title: 'Job #3', subtitle: 'Posted today', icon },
      { id: '4', title: 'Job #4', subtitle: 'Posted today', icon }
    ]
  } else {
    return [
      { id: '1', title: 'Dispute #1', subtitle: 'Opened today', icon },
      { id: '2', title: 'Dispute #2', subtitle: 'Opened today', icon },
      { id: '3', title: 'Dispute #3', subtitle: 'Opened today', icon },
      { id: '4', title: 'Dispute #4', subtitle: 'Opened today', icon }
    ]
  }
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  title, 
  items, 
  iconType 
}) => {
  const activityItems = items || getDefaultItems(iconType)
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium text-black mb-4">{title}</h3>
      
      <div className="space-y-4">
        {activityItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-base font-medium">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

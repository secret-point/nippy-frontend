import React, { useState } from 'react';

interface Notification {
  id: string;
  type: 'message' | 'job' | 'profile';
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => void;
  };
  time: string;
  isRead: boolean;
}

interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

const Notifications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationGroup[]>([
    {
      date: 'TODAY',
      notifications: [
        {
          id: '1',
          type: 'message',
          title: 'You received a new message from Sarah P.',
          description: '"Hi there! I was wondering if you could make a few revisions to the..."',
          action: {
            label: 'Open Client',
            handler: () => console.log('Open client')
          },
          time: '3h ago',
          isRead: false
        }
      ]
    },
    {
      date: '27 Jun,2025',
      notifications: [
        {
          id: '2',
          type: 'job',
          title: 'The job you posted has 3 new proposals',
          description: 'We found 3 new freelancers that match your profile and skills.',
          action: {
            label: 'View Proposals',
            handler: () => console.log('View proposals')
          },
          time: '3 days ago',
          isRead: true
        },
        {
          id: '3',
          type: 'profile',
          title: 'Your profile is 85% complete',
          description: 'Complete your profile to increase your chances of getting hired.',
          action: {
            label: 'Complete Profile',
            handler: () => console.log('Complete profile')
          },
          time: '3 days ago',
          isRead: true
        }
      ]
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(group => ({
        ...group,
        notifications: group.notifications.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(group => ({
        ...group,
        notifications: group.notifications.filter(notif => notif.id !== notificationId)
      })).filter(group => group.notifications.length > 0)
    );
  };

  const getNotificationIcon = (type: Notification['type'], isRead: boolean) => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center";
    
    switch (type) {
      case 'message':
        return (
          <div className={`${baseClasses} ${isRead ? 'bg-gray-200' : 'bg-green-100'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_5_31148)">
                <path d="M16.0009 7.5C16.0009 11.0906 12.4197 14 8.00093 14C6.84155 14 5.74155 13.8 4.7478 13.4406C4.37593 13.7125 3.76968 14.0844 3.05093 14.3969C2.30093 14.7219 1.3978 15 0.500927 15C0.297802 15 0.116552 14.8781 0.0384267 14.6906C-0.0396983 14.5031 0.00405172 14.2906 0.144677 14.1469L0.154052 14.1375C0.163427 14.1281 0.175927 14.1156 0.194677 14.0938C0.229052 14.0562 0.282177 13.9969 0.347802 13.9156C0.475927 13.7594 0.647802 13.5281 0.822802 13.2406C1.1353 12.7219 1.43218 12.0406 1.49155 11.275C0.554052 10.2125 0.000926722 8.90938 0.000926722 7.5C0.000926722 3.90937 3.58218 1 8.00093 1C12.4197 1 16.0009 3.90937 16.0009 7.5Z" fill={isRead ? "#6B7280" : "#16A34A"}/>
              </g>
              <defs>
                <clipPath id="clip0_5_31148">
                  <path d="M0 0H16V16H0V0Z" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        );
      case 'job':
        return (
          <div className={`${baseClasses} ${isRead ? 'bg-gray-200' : 'bg-blue-100'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.75 1.5H10.25C10.3875 1.5 10.5 1.6125 10.5 1.75V3H5.5V1.75C5.5 1.6125 5.6125 1.5 5.75 1.5ZM4 1.75V3H2C0.896875 3 0 3.89687 0 5V8H6H10H16V5C16 3.89687 15.1031 3 14 3H12V1.75C12 0.784375 11.2156 0 10.25 0H5.75C4.78438 0 4 0.784375 4 1.75ZM16 9H10V10C10 10.5531 9.55313 11 9 11H7C6.44688 11 6 10.5531 6 10V9H0V13C0 14.1031 0.896875 15 2 15H14C15.1031 15 16 14.1031 16 13V9Z" fill={isRead ? "#6B7280" : "#2563EB"}/>
            </svg>
          </div>
        );
      case 'profile':
        return (
          <div className={`${baseClasses} ${isRead ? 'bg-gray-200' : 'bg-gray-200'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_5_31182)">
                <path d="M15.4996 5.20625C15.5996 5.47813 15.5152 5.78125 15.2996 5.975L13.9465 7.20625C13.9809 7.46563 13.9996 7.73125 13.9996 8C13.9996 8.26875 13.9809 8.53438 13.9465 8.79375L15.2996 10.025C15.5152 10.2188 15.5996 10.5219 15.4996 10.7937C15.3621 11.1656 15.1965 11.5219 15.0059 11.8656L14.859 12.1187C14.6527 12.4625 14.4215 12.7875 14.1684 13.0938C13.984 13.3188 13.6777 13.3937 13.4027 13.3062L11.6621 12.7531C11.2434 13.075 10.7809 13.3438 10.2871 13.5469L9.89649 15.3313C9.83399 15.6156 9.61524 15.8406 9.32774 15.8875C8.89649 15.9594 8.45274 15.9969 7.99962 15.9969C7.54649 15.9969 7.10274 15.9594 6.67149 15.8875C6.38399 15.8406 6.16524 15.6156 6.10274 15.3313L5.71212 13.5469C5.21837 13.3438 4.75587 13.075 4.33712 12.7531L2.59962 13.3094C2.32462 13.3969 2.01837 13.3188 1.83399 13.0969C1.58087 12.7906 1.34962 12.4656 1.14337 12.1219L0.996492 11.8687C0.805867 11.525 0.640242 11.1687 0.502742 10.7969C0.402742 10.525 0.487117 10.2219 0.702742 10.0281L2.05587 8.79688C2.02149 8.53438 2.00274 8.26875 2.00274 8C2.00274 7.73125 2.02149 7.46563 2.05587 7.20625L0.702742 5.975C0.487117 5.78125 0.402742 5.47813 0.502742 5.20625C0.640242 4.83438 0.805867 4.47813 0.996492 4.13438L1.14337 3.88125C1.34962 3.5375 1.58087 3.2125 1.83399 2.90625C2.01837 2.68125 2.32462 2.60625 2.59962 2.69375L4.34024 3.24688C4.75899 2.925 5.22149 2.65625 5.71524 2.45312L6.10587 0.66875C6.16837 0.384375 6.38712 0.159375 6.67462 0.1125C7.10587 0.0375 7.54962 0 8.00274 0C8.45587 0 8.89962 0.0375 9.33087 0.109375C9.61837 0.15625 9.83712 0.38125 9.89962 0.665625L10.2902 2.45C10.784 2.65313 11.2465 2.92188 11.6652 3.24375L13.4059 2.69062C13.6809 2.60312 13.9871 2.68125 14.1715 2.90313C14.4246 3.20938 14.6559 3.53437 14.8621 3.87812L15.009 4.13125C15.1996 4.475 15.3652 4.83125 15.5027 5.20312L15.4996 5.20625ZM8.00274 10.5C8.66578 10.5 9.30167 10.2366 9.77051 9.76777C10.2394 9.29893 10.5027 8.66304 10.5027 8C10.5027 7.33696 10.2394 6.70107 9.77051 6.23223C9.30167 5.76339 8.66578 5.5 8.00274 5.5C7.3397 5.5 6.70382 5.76339 6.23498 6.23223C5.76613 6.70107 5.50274 7.33696 5.50274 8C5.50274 8.66304 5.76613 9.29893 6.23498 9.76777C6.70382 10.2366 7.3397 10.5 8.00274 10.5Z" fill="#4B5563"/>
              </g>
              <defs>
                <clipPath id="clip0_5_31182">
                  <path d="M0 0H16V16H0V0Z" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        
        {/* Search */}
        <div className="relative w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 13L17 17M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" stroke="#8D8D8D" strokeWidth="1.5"/>
            </svg>
            <input
              type="text"
              placeholder="Search FAQs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-gray-600 bg-transparent outline-none min-w-0"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-8">
        {notifications.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-5">
            {/* Date Label */}
            <h3 className="text-sm font-medium text-gray-600">{group.date}</h3>
            
            {/* Notification Cards */}
            <div className="space-y-4">
              {group.notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`bg-white rounded-lg p-5 transition-all ${
                    notification.isRead 
                      ? 'border border-gray-200' 
                      : 'border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    {getNotificationIcon(notification.type, notification.isRead)}
                    
                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-lg font-medium text-gray-900 flex-1">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {notification.time}
                          </span>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.70078 1.70624C10.0914 1.31562 10.0914 0.681244 9.70078 0.290619C9.31016 -0.100006 8.67578 -0.100006 8.28516 0.290619L4.99453 3.58437L1.70078 0.293744C1.31016 -0.0968812 0.675781 -0.0968812 0.285156 0.293744C-0.105469 0.684369 -0.105469 1.31874 0.285156 1.70937L3.57891 4.99999L0.288281 8.29374C-0.102344 8.68437 -0.102344 9.31874 0.288281 9.70937C0.678906 10.1 1.31328 10.1 1.70391 9.70937L4.99453 6.41562L8.28828 9.70624C8.67891 10.0969 9.31328 10.0969 9.70391 9.70624C10.0945 9.31562 10.0945 8.68124 9.70391 8.29062L6.41016 4.99999L9.70078 1.70624Z" fill="currentColor"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {notification.description}
                      </p>
                      
                      {/* Action */}
                      {notification.action && (
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              notification.action?.handler();
                              markAsRead(notification.id);
                            }}
                            className="text-purple-600 font-medium text-base hover:text-purple-700 transition-colors"
                          >
                            {notification.action.label}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

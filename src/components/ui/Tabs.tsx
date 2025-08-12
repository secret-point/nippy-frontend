import React from 'react'

export interface TabItem {
  id: string
  label: string
  content?: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: 'default' | 'underline' | 'bordered'
  className?: string
}

const variantClasses = {
  default: {
    container: 'flex border-b border-gray-200',
    tab: 'px-3 py-2 text-sm font-medium transition-colors',
    active: 'text-purple-600 border-purple-600',
    inactive: 'text-gray-500 border-transparent hover:text-gray-700',
    indicator: 'border-b-2'
  },
  underline: {
    container: 'flex',
    tab: 'flex h-14 px-5 justify-center items-center gap-3',
    active: 'text-purple-600 font-bold',
    inactive: 'text-gray-600 font-medium',
    indicator: 'flex w-full h-14 px-3 justify-center items-center gap-2 border-b-2 border-purple-600'
  },
  bordered: {
    container: 'flex border-b border-gray-200',
    tab: 'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
    active: 'text-purple-600 border-purple-600',
    inactive: 'text-gray-500 border-transparent hover:text-gray-700',
    indicator: ''
  }
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  className = ''
}) => {
  const classes = variantClasses[variant]

  return (
    <div className={className}>
      <div className={classes.container}>
        {tabs.map((tab) => (
          <div key={tab.id} className={variant === 'underline' ? 'flex flex-col justify-center items-center relative' : ''}>
            <button
              onClick={() => onTabChange(tab.id)}
              className={`
                ${classes.tab}
                ${activeTab === tab.id ? classes.active : classes.inactive}
                ${variant === 'bordered' ? classes.indicator : ''}
              `}
            >
              {variant === 'underline' ? (
                <span className={`text-center text-lg leading-[27px] ${
                  activeTab === tab.id ? 'font-bold' : 'font-medium'
                }`}>
                  {tab.label}
                </span>
              ) : (
                tab.label
              )}
            </button>
            {variant === 'underline' && activeTab === tab.id && (
              <div className={classes.indicator}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface TabContentProps {
  tabs: TabItem[]
  activeTab: string
  className?: string
}

export const TabContent: React.FC<TabContentProps> = ({
  tabs,
  activeTab,
  className = ''
}) => {
  const activeTabData = tabs.find(tab => tab.id === activeTab)
  
  return (
    <div className={className}>
      {activeTabData?.content}
    </div>
  )
}

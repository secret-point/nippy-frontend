import React from 'react'
import Button from './Button'

interface ActionItem {
  id: string
  count: number
  description: string
  onAction: () => void
}

interface ActionRequiredProps {
  // Template for backend data fetching
  items?: ActionItem[]
}

// Mock data - replace with API call
const defaultItems: ActionItem[] = [
  {
    id: 'pending-payouts',
    count: 5,
    description: 'Pending payouts require approval',
    onAction: () => console.log('Handle pending payouts')
  },
  {
    id: 'refund-requests',
    count: 2,
    description: 'Refund requests need review',
    onAction: () => console.log('Handle refund requests')
  },
  {
    id: 'payment-disputes',
    count: 3,
    description: 'Disputes with payment issues',
    onAction: () => console.log('Handle payment disputes')
  },
  {
    id: 'payment-discrepancies',
    count: 4,
    description: 'Jobs flagged for payment discrepancies',
    onAction: () => console.log('Handle payment discrepancies')
  }
]

export const ActionRequired: React.FC<ActionRequiredProps> = ({ items = defaultItems }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-5">
        <h3 className="text-lg font-medium text-black mb-4">Action Required</h3>
        
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between py-6 ${index === items.length - 1 ? '' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-base font-normal">{item.count}</span>
                </div>
                <span className="text-black text-base font-medium">{item.description}</span>
              </div>
              
              <Button 
                variant="link" 
                onClick={item.onAction}
                className="text-purple-600 hover:text-purple-700"
              >
                Take action ��
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

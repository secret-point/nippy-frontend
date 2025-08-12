import React from 'react'

interface ChartProps {
  title: string
  data?: number[]
  labels?: string[]
}

// Mock data for demonstration
const defaultData = [85, 70, 65, 75, 80, 45, 85]
const defaultLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const Chart: React.FC<ChartProps> = ({ 
  title, 
  data = defaultData, 
  labels = defaultLabels 
}) => {
  const maxValue = Math.max(...data)
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[380px]">
      <h3 className="text-lg font-medium text-black mb-3">{title}</h3>
      
      <div className="h-[274px] p-8 bg-white">
        <div className="flex h-full">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between items-end pr-1 text-xs text-gray-500">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="flex-1 relative ml-4">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px bg-gray-200 opacity-60" />
              ))}
            </div>
            
            {/* Vertical grid lines */}
            <div className="absolute inset-0 flex justify-between">
              {labels.map((_, i) => (
                <div key={i} className="w-px bg-gray-200 opacity-60" />
              ))}
            </div>
            
            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between px-4">
              {data.map((value, index) => {
                const height = (value / maxValue) * 100
                return (
                  <div key={index} className="flex-1 flex justify-center">
                    <div 
                      className="w-9 bg-purple-600 rounded-t-lg opacity-80"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between items-center mt-2 ml-9 text-xs text-gray-500">
          {labels.map((label, index) => (
            <span key={index} className="flex-1 text-center">{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

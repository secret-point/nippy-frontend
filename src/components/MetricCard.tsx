import React from 'react'
import { MetricTrend } from '../types'

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend: MetricTrend
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
          {icon}
        </div>
        
        <div className="flex-1">
          <p className="text-gray-500 text-base font-normal">{title}</p>
          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-2xl font-bold text-black">{value}</h3>
            <div className="flex items-center gap-1">
              <svg 
                width="4" 
                height="12" 
                viewBox="0 0 4 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={trend.isPositive ? 'text-green-500' : 'text-red-500'}
              >
                {trend.isPositive ? (
                  <path d="M0.255859 2.57599C0.650526 2.24532 0.99186 1.90399 1.27986 1.55199C1.56786 1.19999 1.80253 0.837323 1.98386 0.463989H2.27186C2.64519 1.19999 3.22119 1.90399 3.99986 2.57599V3.13599C3.63719 2.96532 3.31719 2.79466 3.03986 2.62399C2.77319 2.45332 2.54919 2.28799 2.36786 2.12799H1.88786C1.71719 2.28799 1.49319 2.45332 1.21586 2.62399C0.949193 2.79466 0.629193 2.96532 0.255859 3.13599V2.57599ZM1.79186 2.04799H2.46386V11.536H1.79186V2.04799Z" fill="currentColor"/>
                ) : (
                  <path d="M0.255859 9.42401C0.650526 9.75468 0.99186 10.096 1.27986 10.448C1.56786 10.8 1.80253 11.1627 1.98386 11.536H2.27186C2.64519 10.8 3.22119 10.096 3.99986 9.42401V8.86401C3.63719 9.03468 3.31719 9.20534 3.03986 9.37601C2.77319 9.54668 2.54919 9.71201 2.36786 9.87201H1.88786C1.71719 9.71201 1.49319 9.54668 1.21586 9.37601C0.949193 9.20534 0.629193 9.03468 0.255859 8.86401V9.42401ZM1.79186 9.95201H2.46386V0.46401H1.79186V9.95201Z" fill="currentColor"/>
                )}
              </svg>
              <span className={`text-sm font-normal ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.value}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

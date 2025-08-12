import React from 'react'
import { Card } from '../components/ui'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = "This page is coming soon..." 
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Card>
        <p className="text-gray-600">{description}</p>
      </Card>
    </div>
  )
}

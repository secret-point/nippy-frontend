import React from 'react'

interface SimpleModalProps {
  children: React.ReactNode
  onClose: () => void
}

export const SimpleModal: React.FC<SimpleModalProps> = ({ children, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0"
        onClick={handleBackdropClick}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

import React, { useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  className?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search services",
  value = "",
  onChange,
  onClear,
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  const handleClear = () => {
    onChange?.("")
    onClear?.()
  }

  const getBorderStyle = () => {
    if (isFocused) {
      return "border-transparent shadow-[0_0_0_2px_rgba(0,0,0,0.25)]"
    }
    if (isHovered) {
      return "border-gray-400"
    }
    if (value) {
      return "border-gray-900"
    }
    return "border-gray-300"
  }

  const getIconColor = () => {
    if (isFocused || value) {
      return "text-gray-900"
    }
    if (isHovered) {
      return "text-gray-900"
    }
    return "text-gray-400"
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 px-3 py-2 bg-white rounded-lg border transition-all duration-150 ${getBorderStyle()}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg 
          className={`w-5 h-5 transition-colors ${getIconColor()}`} 
          viewBox="0 0 20 20" 
          fill="none"
        >
          <path 
            d="M13 13L17 17M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" 
            stroke="currentColor" 
            strokeWidth="1.5"
          />
        </svg>
        
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-500"
        />
        
        {value && (
          <button
            onClick={handleClear}
            className="p-0.5 rounded hover:bg-gray-100 transition-colors"
          >
            <svg 
              className="w-5 h-5 text-gray-900" 
              viewBox="0 0 20 20" 
              fill="none"
            >
              <path 
                d="M5 5L15 15M5 15L15 5" 
                stroke="currentColor" 
                strokeWidth="1.5"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

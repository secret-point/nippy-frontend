interface InputProps {
  type?: 'text' | 'email' | 'password'
  placeholder: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  required?: boolean
  disabled?: boolean
}

export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  className = '' ,
  required = false,
  disabled = false
}: InputProps) {
  return (
    <div className={`flex px-3 py-2 items-center gap-2 self-stretch rounded-xl border border-black/15 bg-transparent ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 text-black/60 font-poppins text-base font-normal leading-6 placeholder-black/60 bg-transparent outline-none"
        required={required}
        disabled={disabled}
      />
    </div>
  )
}

interface CheckboxProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export default function Checkbox({ label, checked = false, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2 self-stretch">
      <div 
        className="w-[18px] h-[18px] border border-black/15 rounded bg-transparent cursor-pointer flex items-center justify-center"
        onClick={() => onChange?.(!checked)}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="#5F42A1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <label className="flex-1 text-black font-poppins text-sm font-normal leading-[21px] cursor-pointer">
        {label}
      </label>
    </div>
  )
}

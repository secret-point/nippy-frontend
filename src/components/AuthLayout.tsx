import { ReactNode } from 'react'
import { Logo } from './Logo'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center px-4 py-8">
      <div className="flex w-full max-w-[560px] flex-col items-center gap-10">
        <Logo />
        
        <div className="flex flex-col items-center gap-4 self-stretch">
          <h1 className="self-stretch text-[#0B0C0E] text-center font-manrope text-[40px] font-bold leading-[48px] tracking-[-0.4px]">
            {title}
          </h1>
          <p className="self-stretch text-[#3A404A] text-center font-poppins text-lg font-normal leading-[27px]">
            {subtitle}
          </p>
        </div>
        
        {children}
      </div>
    </div>
  )
}

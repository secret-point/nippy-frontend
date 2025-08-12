interface GoogleSignInButtonProps {
  onClick?: () => void
}

export default function GoogleSignInButton({ onClick }: GoogleSignInButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex h-10 px-3 py-2.5 justify-center items-center gap-2.5 self-stretch rounded-xl border border-black/15 bg-white hover:bg-gray-50 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M17.64 9.20456C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8196H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20456Z" fill="#4285F4"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.96409 10.7099C3.78409 10.1699 3.68182 9.59307 3.68182 8.99989C3.68182 8.40671 3.78409 7.82989 3.96409 7.28989V4.95807H0.957273C0.347727 6.17307 0 7.54762 0 8.99989C0 10.4522 0.347727 11.8267 0.957273 13.0417L3.96409 10.7099Z" fill="#FBBC05"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
      </svg>
      <span className="text-[#1F1F1F] font-medium text-sm">Sign in with Google</span>
    </button>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { freelancersAPI } from '../services/freelancersAPI' // TODO: Implement API integration
import api from '../config/api'

interface FreelancerCard {
  id: string
  name: string
  rating: number
  reviewCount: number
  skills: string[]
  description: string
  startingPrice: string
  image?: string
  badge?: string
  isNewFreelancer?: boolean
}

interface ServiceCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

// Helper function to get service icon
const getServiceIcon = (serviceType?: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'video_editing': (
      <svg className="w-6 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 5.25V18C15.75 18.414 15.5 18.773 15.117 18.901C14.734 19.029 14.316 18.993 13.973 18.805L10.223 16.305L9.667 15.934V15.266V8.734V8.066L10.223 7.695L13.973 5.195C14.316 5.007 14.734 4.971 15.117 5.099C15.5 5.227 15.75 5.586 15.75 6V5.25Z" fill="#7C3AED"/>
        <path d="M0.75 5.5C0.75 4.12109 1.87109 3 3.25 3H13.25C14.6289 3 15.75 4.12109 15.75 5.5V15.5C15.75 16.8789 14.6289 18 13.25 18H3.25C1.87109 18 0.75 16.8789 0.75 15.5V5.5Z" fill="#7C3AED"/>
      </svg>
    ),
    'graphic_design': (
      <svg className="w-6 h-5" fill="#7C3AED" stroke="currentColor" viewBox="0 0 24 20">
        <path d="M2 4.75C2 3.37109 3.12109 2.25 4.5 2.25H19.5C20.8789 2.25 22 3.37109 22 4.75V17.25C22 18.6289 20.8789 19.75 19.5 19.75H4.5C3.12109 19.75 2 18.6289 2 17.25V4.75ZM14.6484 8.91016C14.4727 8.65234 14.1836 8.5 13.875 8.5C13.5664 8.5 13.2734 8.65234 13.1016 8.91016L9.70312 13.8945L8.66797 12.6016C8.48828 12.3789 8.21875 12.25 7.9375 12.25C7.65625 12.25 7.38281 12.3789 7.20703 12.6016L4.70703 15.7266C4.48047 16.0078 4.4375 16.3945 4.59375 16.7188C4.75 17.043 5.07812 17.25 5.4375 17.25H9.1875H10.4375H18.5625C18.9102 17.25 19.2305 17.0586 19.3906 16.75C19.5508 16.4414 19.5312 16.0703 19.3359 15.7852L14.6484 8.91016ZM6.375 8.5C6.87228 8.5 7.34919 8.30246 7.70083 7.95083C8.05246 7.59919 8.25 7.12228 8.25 6.625C8.25 6.12772 8.05246 5.65081 7.70083 5.29917C7.34919 4.94754 6.87228 4.75 6.375 4.75C5.87772 4.75 5.40081 4.94754 5.04917 5.29917C4.69754 5.65081 4.5 6.12772 4.5 6.625C4.5 7.12228 4.69754 7.59919 5.04917 7.95083C5.40081 8.30246 5.87772 8.5 6.375 8.5Z"/>
      </svg>
    ),
    'logo_design': (
      <svg className="w-6 h-5" fill="#7C3AED" viewBox="0 0 24 21">
        <path d="M19.5 1C18.875 1 14.5 2.25 14.5 7.875V12.25C14.5 13.6289 15.6211 14.75 17 14.75H18.25V19.75C18.25 20.4414 18.8086 21 19.5 21C20.1914 21 20.75 20.4414 20.75 19.75V14.75V10.375V2.25C20.75 1.55859 20.1914 1 19.5 1ZM5.75 1.625C5.75 1.30469 5.51172 1.03906 5.19141 1.00391C4.87109 0.96875 4.58594 1.17969 4.51562 1.48828L3.33203 6.8125C3.27734 7.05859 3.25 7.30859 3.25 7.55859C3.25 9.35156 4.62109 10.8242 6.375 10.9844V19.75C6.375 20.4414 6.93359 21 7.625 21C8.31641 21 8.875 20.4414 8.875 19.75V10.9844C10.6289 10.8242 12 9.35156 12 7.55859C12 7.30859 11.9727 7.05859 11.918 6.8125L10.7344 1.48828C10.6641 1.17578 10.3711 0.96875 10.0547 1.00391C9.73828 1.03906 9.5 1.30469 9.5 1.625V6.86719C9.5 7.07812 9.32812 7.25 9.11719 7.25C8.91797 7.25 8.75391 7.09766 8.73438 6.89844L8.24609 1.57031C8.21875 1.24609 7.94922 1 7.625 1C7.30078 1 7.03125 1.24609 7.00391 1.57031L6.51953 6.89844C6.5 7.09766 6.33594 7.25 6.13672 7.25C5.92578 7.25 5.75391 7.07812 5.75391 6.86719V1.625H5.75Z"/>
      </svg>
    ),
    'social_media': (
      <svg className="w-6 h-5" fill="#7C3AED" viewBox="0 0 24 21">
        <path d="M12.0068 6.50684C9.52246 6.50684 7.51855 8.51074 7.51855 10.9951C7.51855 13.4795 9.52246 15.4834 12.0068 15.4834C14.4912 15.4834 16.4951 13.4795 16.4951 10.9951C16.4951 8.51074 14.4912 6.50684 12.0068 6.50684ZM12.0068 13.9131C10.4014 13.9131 9.08887 12.6045 9.08887 10.9951C9.08887 9.38574 10.3975 8.07715 12.0068 8.07715C13.6162 8.07715 14.9248 9.38574 14.9248 10.9951C14.9248 12.6045 13.6123 13.9131 12.0068 13.9131ZM17.7256 6.32324C17.7256 6.90527 17.2568 7.37012 16.6787 7.37012C16.0967 7.37012 15.6318 6.90137 15.6318 6.32324C15.6318 5.74512 16.1006 5.27637 16.6787 5.27637C17.2568 5.27637 17.7256 5.74512 17.7256 6.32324ZM20.6982 7.38574C20.6318 5.9834 20.3115 4.74121 19.2842 3.71777C18.2607 2.69434 17.0186 2.37402 15.6162 2.30371C14.1709 2.22168 9.83887 2.22168 8.39355 2.30371C6.99512 2.37012 5.75293 2.69043 4.72559 3.71387C3.69824 4.7373 3.38184 5.97949 3.31152 7.38184C3.22949 8.82715 3.22949 13.1592 3.31152 14.6045C3.37793 16.0068 3.69824 17.249 4.72559 18.2725C5.75293 19.2959 6.99121 19.6162 8.39355 19.6865C9.83887 19.7686 14.1709 19.7686 15.6162 19.6865C17.0186 19.6201 18.2607 19.2998 19.2842 18.2725C20.3076 17.249 20.6279 16.0068 20.6982 14.6045C20.7803 13.1592 20.7803 8.83105 20.6982 7.38574ZM18.8311 16.1553C18.5264 16.9209 17.9365 17.5107 17.167 17.8193C16.0146 18.2764 13.2803 18.1709 12.0068 18.1709C10.7334 18.1709 7.99512 18.2725 6.84668 17.8193C6.08105 17.5146 5.49121 16.9248 5.18262 16.1553C4.72559 15.0029 4.83105 12.2686 4.83105 10.9951C4.83105 9.72168 4.72949 6.9834 5.18262 5.83496C5.4873 5.06934 6.07715 4.47949 6.84668 4.1709C7.99902 3.71387 10.7334 3.81934 12.0068 3.81934C13.2803 3.81934 16.0186 3.71777 17.167 4.1709C17.9326 4.47559 18.5225 5.06543 18.8311 5.83496C19.2881 6.9873 19.1826 9.72168 19.1826 10.9951C19.1826 12.2686 19.2881 15.0068 18.8311 16.1553Z"/>
      </svg>
    ),
    'branding': (
      <svg className="w-6 h-5" fill="#7C3AED" viewBox="0 0 24 21">
        <path d="M22.1418 5.05469L19.9035 1.51172C19.7043 1.19531 19.3488 1 18.9699 1H5.03238C4.65348 1 4.29801 1.19531 4.09879 1.51172L1.8566 5.05469C0.700353 6.88281 1.72379 9.42578 3.88395 9.71875C4.0402 9.73828 4.20035 9.75 4.3566 9.75C5.37613 9.75 6.28238 9.30469 6.90348 8.61719C7.52457 9.30469 8.43082 9.75 9.45035 9.75C10.4699 9.75 11.3761 9.30469 11.9972 8.61719C12.6183 9.30469 13.5246 9.75 14.5441 9.75C15.5675 9.75 16.4699 9.30469 17.091 8.61719C17.716 9.30469 18.6183 9.75 19.6379 9.75C19.798 9.75 19.9543 9.73828 20.1105 9.71875C22.2785 9.42969 23.3058 6.88672 22.1457 5.05469H22.1418ZM20.2707 10.957H20.2668C20.0597 10.9844 19.8488 11 19.6339 11C19.1496 11 18.6847 10.9258 18.2511 10.793V16H5.75113V10.7891C5.31363 10.9258 4.84488 11 4.36051 11C4.14567 11 3.93082 10.9844 3.72379 10.957H3.71988C3.55973 10.9336 3.40348 10.9062 3.25113 10.8672V16V18.5C3.25113 19.8789 4.37223 21 5.75113 21H18.2511C19.63 21 20.7511 19.8789 20.7511 18.5V16V10.8672C20.5949 10.9062 20.4386 10.9375 20.2707 10.957Z"/>
      </svg>
    )
  };

  return iconMap[serviceType || ''] || (
    // Default icon for unknown service types
    <svg className="w-6 h-5" fill="#7C3AED" viewBox="0 0 24 24">
      <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
    </svg>
  );
};

const FreelancerCard = ({ freelancer }: { freelancer: FreelancerCard }) => {
  return (
    <div className="flex w-80 flex-col items-center border border-gray-200 bg-white rounded-2xl overflow-hidden">
      <div className="flex w-full h-48 justify-between items-start p-3 relative">
        {freelancer.badge && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            freelancer.badge === 'Top Rated' 
              ? 'bg-blue-600 text-white' 
              : 'bg-green-600 text-white'
          }`}>
            {freelancer.badge}
          </div>
        )}
        {freelancer.isNewFreelancer && (
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-teal-600 text-white">
            New Freelancer
          </div>
        )}
        <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
          <svg className="w-5 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.055 14.631L6.978 14.559L1.503 9.475C0.544 8.584 0 7.334 0 6.025V5.922C0 3.722 1.563 1.834 3.725 1.422C4.956 1.184 6.216 1.468 7.219 2.175C7.5 2.375 7.763 2.606 8 2.872C8.131 2.722 8.272 2.584 8.422 2.456C8.538 2.356 8.656 2.262 8.781 2.175C9.784 1.468 11.044 1.184 12.275 1.418C14.438 1.831 16 3.722 16 5.922V6.025C16 7.334 15.456 8.584 14.497 9.475L9.022 14.559L8.944 14.631C8.688 14.869 8.35 15.003 8 15.003C7.65 15.003 7.313 14.872 7.055 14.631Z" fill="#374151"/>
          </svg>
        </button>
      </div>
      
      <div className="flex h-[340px] max-h-[340px] p-4 flex-col justify-between items-end self-stretch">
        <div className="flex flex-col items-start gap-5 self-stretch">
          <div className="flex items-center gap-3 self-stretch">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex flex-col items-start gap-1 flex-1">
              <div className="flex justify-center items-center gap-2 self-stretch">
                <h3 className="flex-1 text-gray-900 font-bold text-xl leading-7 tracking-tight">
                  {freelancer.name}
                </h3>
              </div>
              <div className="flex items-start gap-1 self-stretch">
                <div className="flex items-center gap-1">
                  <svg className="w-[13.5px] h-3" fill="none" stroke="currentColor" viewBox="0 0 14 13">
                    <path d="M7.424 0.922C7.3 0.664 7.037 0.5 6.749 0.5C6.461 0.5 6.201 0.664 6.074 0.922L4.567 4.023L1.201 4.52C0.92 4.562 0.686 4.759 0.599 5.028C0.512 5.298 0.583 5.595 0.784 5.795L3.226 8.211L2.65 11.626C2.603 11.907 2.72 12.193 2.952 12.359C3.184 12.526 3.491 12.547 3.744 12.413L6.751 10.808L9.758 12.413C10.012 12.547 10.319 12.528 10.551 12.359C10.783 12.191 10.9 11.907 10.853 11.626L10.274 8.211L12.716 5.795C12.918 5.595 12.99 5.298 12.901 5.028C12.812 4.759 12.58 4.562 12.299 4.52L8.931 4.023L7.424 0.922Z" fill="#FBBF24"/>
                  </svg>
                  <span className="text-gray-900 text-sm font-medium">{freelancer.rating}</span>
                </div>
                <span className="text-gray-400 text-sm">({freelancer.reviewCount})</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 self-stretch flex-wrap">
            {freelancer.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 rounded-full bg-purple-50 text-purple-600 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <p className="self-stretch text-gray-600 text-base leading-6">
            {freelancer.description}
          </p>
        </div>
        
        <div className="flex justify-between items-center self-stretch">
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-gray-500 text-sm">Starting from</span>
            <span className="text-gray-900 text-base font-medium">{freelancer.startingPrice}</span>
          </div>
          <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-base font-medium rounded-xl transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}

const ServiceCard = ({ service }: { service: ServiceCard }) => {
  return (
    <div className="flex w-[200px] h-[232px] p-5 items-center border border-gray-200 bg-white rounded-xl">
      <div className="flex flex-col items-start gap-[18px] flex-1">
        <div className="flex w-12 h-12 p-[14px] justify-center items-center rounded-full bg-purple-50">
          <div className="flex w-6 h-5 justify-center items-center text-purple-600">
            {service.icon}
          </div>
        </div>
        
        <div className="flex flex-col items-start gap-[18px] self-stretch">
          <div className="flex flex-col items-start gap-1 self-stretch">
            <h3 className="self-stretch text-gray-900 font-bold text-xl leading-7 tracking-tight">
              {service.title}
            </h3>
            <p className="self-stretch text-gray-600 text-base leading-6">
              {service.description}
            </p>
          </div>
          
          <button className="flex justify-center items-center gap-2 text-black font-medium text-base rounded-xl">
            <span>Explore</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 21">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.933 20.5L9.184 18.592L15.258 11.893H0V9.107H15.258L9.184 2.419L10.933 0.5L20 10.5L10.933 20.5Z" fill="#7C3AED"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export const ClientDashboard = () => {
  const [showStartGuide, setShowStartGuide] = useState(true)
  const [freelancers, setFreelancers] = useState<FreelancerCard[]>([])
  const [services, setServices] = useState<ServiceCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load featured freelancers and popular services in parallel
        const [freelancersResponse, servicesResponse] = await Promise.all([
          api.get('/client/dashboard/featured-freelancers?limit=4'),
          api.get('/client/dashboard/popular-services?limit=4')
        ])

        if (freelancersResponse.data.success) {
          setFreelancers(freelancersResponse.data.data)
        }

        if (servicesResponse.data.success) {
          // Transform API service data to match frontend format
          const transformedServices = servicesResponse.data.data.map((service: any) => ({
            id: service.id,
            title: service.title,
            description: service.description,
            icon: getServiceIcon(service.serviceType || service.icon) // Use helper function
          }))
          setServices(transformedServices)
        }
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
        
        // Fallback to empty arrays to show loading state
        setFreelancers([])
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="p-11 min-h-screen">
      <div className="max-w-[1104px] mx-auto space-y-[50px]">
        {/* Intro Card */}
        <div className="flex p-8 flex-col gap-2 border border-black/15 bg-white rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-10 flex-wrap">
            <div className="flex min-w-[350px] items-start gap-4 flex-1">
              <div className="flex w-[72px] h-[72px] p-4 justify-center items-center rounded-full bg-purple-100">
                <span className="text-purple-700 font-bold text-4xl">A</span>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <div className="space-y-3">
                  <h1 className="text-black font-bold text-3xl leading-[42px] tracking-tight">
                    Hi Alex!
                  </h1>
                  <p className="text-gray-600 text-lg leading-7">
                    Ready to bring your ad idea to life? Let's make it simple.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <button className="flex px-6 py-3 justify-center items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 21">
                  <path d="M11.5385 2.03846C11.5385 1.1875 10.851 0.5 10 0.5C9.14904 0.5 8.46154 1.1875 8.46154 2.03846V8.96154H1.53846C0.6875 8.96154 0 9.64904 0 10.5C0 11.351 0.6875 12.0385 1.53846 12.0385H8.46154V18.9615C8.46154 19.8125 9.14904 20.5 10 20.5C10.851 20.5 11.5385 19.8125 11.5385 18.9615V12.0385H18.4615C19.3125 12.0385 20 11.351 20 10.5C20 9.64904 19.3125 8.96154 18.4615 8.96154H11.5385V2.03846Z" fill="white"/>
                </svg>
                Post a Job
              </button>
              <button 
                onClick={() => navigate('/browse-freelancers')}
                className="flex px-6 py-3 justify-center items-center gap-3 bg-black/5 hover:bg-black/10 text-black font-medium rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 21">
                  <path d="M4.5 0.5C5.16304 0.5 5.79893 0.796316 6.26777 1.32376C6.73661 1.85121 7 2.56658 7 3.3125C7 4.05842 6.73661 4.77379 6.26777 5.30124C5.79893 5.82868 5.16304 6.125 4.5 6.125C3.83696 6.125 3.20107 5.82868 2.73223 5.30124C2.26339 4.77379 2 4.05842 2 3.3125C2 2.56658 2.26339 1.85121 2.73223 1.32376C3.20107 0.796316 3.83696 0.5 4.5 0.5ZM16 0.5C16.663 0.5 17.2989 0.796316 17.7678 1.32376C18.2366 1.85121 18.5 2.56658 18.5 3.3125C18.5 4.05842 18.2366 4.77379 17.7678 5.30124C17.2989 5.82868 16.663 6.125 16 6.125C15.337 6.125 14.7011 5.82868 14.2322 5.30124C13.7634 4.77379 13.5 4.05842 13.5 3.3125C13.5 2.56658 13.7634 1.85121 14.2322 1.32376C14.7011 0.796316 15.337 0.5 16 0.5ZM0 11.0012C0 8.93047 1.49375 7.25 3.33437 7.25H4.66875C5.16562 7.25 5.6375 7.37305 6.0625 7.59102C6.02187 7.84414 6.00313 8.10781 6.00313 8.375C6.00313 9.71797 6.52812 10.9238 7.35625 11.75C7.35 11.75 7.34375 11.75 7.33437 11.75H0.665625C0.3 11.75 0 11.4125 0 11.0012ZM12.6656 11.75C12.6594 11.75 12.6531 11.75 12.6438 11.75C13.475 10.9238 13.9969 9.71797 13.9969 8.375C13.9969 8.10781 13.975 7.84766 13.9375 7.59102C14.3625 7.36953 14.8344 7.25 15.3313 7.25H16.6656C18.5063 7.25 20 8.93047 20 11.0012C20 11.416 19.7 11.75 19.3344 11.75H12.6656ZM7 8.375C7 7.47989 7.31607 6.62145 7.87868 5.98851C8.44129 5.35558 9.20435 5 10 5C10.7956 5 11.5587 5.35558 12.1213 5.98851C12.6839 6.62145 13 7.47989 13 8.375C13 9.27011 12.6839 10.1286 12.1213 10.7615C11.5587 11.3944 10.7956 11.75 10 11.75C9.20435 11.75 8.44129 11.3944 7.87868 10.7615C7.31607 10.1286 7 9.27011 7 8.375ZM4 17.5613C4 14.9738 5.86562 12.875 8.16562 12.875H11.8344C14.1344 12.875 16 14.9738 16 17.5613C16 18.0781 15.6281 18.5 15.1656 18.5H4.83437C4.375 18.5 4 18.0816 4 17.5613Z" fill="#7C3AED"/>
                </svg>
                Browse Freelancers
              </button>
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        {showStartGuide && (
          <div className="p-8 flex-col gap-7 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            <div className="flex p-3 justify-between items-center">
              <h2 className="flex-1 text-gray-600 font-bold text-3xl leading-[42px] tracking-tight">
                Not sure where to start?
              </h2>
              <button 
                onClick={() => setShowStartGuide(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.886 3.882c.374-.374.374-.975 0-1.349-.374-.374-.975-.374-1.349 0L8.002 6.998 3.467 2.533c-.374-.374-.975-.374-1.349 0-.374.374-.374.975 0 1.349L6.653 8.347l-4.535 4.535c-.374.374-.374.975 0 1.349.374.374.975.374 1.349 0l4.535-4.535 4.535 4.535c.374.374.975.374 1.349 0 .374-.374.374-.975 0-1.349L9.351 8.347l4.535-4.465z" fill="#A78BFA"/>
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center items-start gap-10 flex-wrap">
              <div className="flex min-w-60 px-4 flex-col items-center gap-4 flex-1">
                <div className="flex w-16 h-16 p-5 justify-center items-center rounded-full bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <svg className="w-[18px] h-6 text-purple-600" fill="currentColor" viewBox="0 0 18 24">
                    <path d="M4.5 4.5V12C4.5 14.4844 6.51562 16.5 9 16.5C11.4844 16.5 13.5 14.4844 13.5 12H9.75C9.3375 12 9 11.6625 9 11.25C9 10.8375 9.3375 10.5 9.75 10.5H13.5V9H9.75C9.3375 9 9 8.6625 9 8.25C9 7.8375 9.3375 7.5 9.75 7.5H13.5V6H9.75C9.3375 6 9 5.6625 9 5.25C9 4.8375 9.3375 4.5 9.75 4.5H13.5C13.5 2.01562 11.4844 0 9 0C6.51562 0 4.5 2.01562 4.5 4.5ZM15 11.25V12C15 15.3141 12.3141 18 9 18C5.68594 18 3 15.3141 3 12V10.125C3 9.50156 2.49844 9 1.875 9C1.25156 9 0.75 9.50156 0.75 10.125V12C0.75 16.1766 3.85312 19.6266 7.875 20.175V21.75H5.625C5.00156 21.75 4.5 22.2516 4.5 22.875C4.5 23.4984 5.00156 24 5.625 24H9H12.375C12.9984 24 13.5 23.4984 13.5 22.875C13.5 22.2516 12.9984 21.75 12.375 21.75H10.125V20.175C14.1469 19.6266 17.25 16.1766 17.25 12V10.125C17.25 9.50156 16.7484 9 16.125 9C15.5016 9 15 9.50156 15 10.125V11.25Z" fill="#7C3AED"/>
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-gray-900 text-center font-medium text-lg">Post a Job</h3>
                  <p className="text-gray-600 text-center text-base">
                    Tell us what you need (text, voice, or photo)
                  </p>
                </div>
              </div>
              
              <div className="flex min-w-60 px-4 flex-col items-center gap-4 flex-1">
                <div className="flex w-16 h-16 p-5 justify-center items-center rounded-full bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <svg className="w-7 h-6 text-purple-600" fill="currentColor" viewBox="0 0 28 24">
                    <path d="M11.5016 2.00156L9.73438 2.6625C9.59375 2.71406 9.5 2.85 9.5 3C9.5 3.15 9.59375 3.28594 9.73438 3.3375L11.5016 3.99844L12.1625 5.76562C12.2141 5.90625 12.35 6 12.5 6C12.65 6 12.7859 5.90625 12.8375 5.76562L13.4984 3.99844L15.2656 3.3375C15.4062 3.28594 15.5 3.15 15.5 3C15.5 2.85 15.4062 2.71406 15.2656 2.6625L13.4984 2.00156L12.8375 0.234375C12.7859 0.09375 12.65 0 12.5 0C12.35 0 12.2141 0.09375 12.1625 0.234375L11.5016 2.00156ZM2.66094 18.5344C1.78437 19.4109 1.78437 20.8359 2.66094 21.7172L4.28281 23.3391C5.15937 24.2156 6.58438 24.2156 7.46563 23.3391L25.3391 5.46094C26.2156 4.58437 26.2156 3.15937 25.3391 2.27812L23.7172 0.660937C22.8406 -0.215625 21.4156 -0.215625 20.5344 0.660937L2.66094 18.5344ZM23.2156 3.87187L18.2938 8.79375L17.2016 7.70156L22.1234 2.77969L23.2156 3.87187ZM0.851562 5.49375C0.640625 5.57344 0.5 5.775 0.5 6C0.5 6.225 0.640625 6.42656 0.851562 6.50625L3.5 7.5L4.49375 10.1484C4.57344 10.3594 4.775 10.5 5 10.5C5.225 10.5 5.42656 10.3594 5.50625 10.1484L6.5 7.5L9.14844 6.50625C9.35938 6.42656 9.5 6.225 9.5 6C9.5 5.775 9.35938 5.57344 9.14844 5.49375L6.5 4.5L5.50625 1.85156C5.42656 1.64062 5.225 1.5 5 1.5C4.775 1.5 4.57344 1.64062 4.49375 1.85156L3.5 4.5L0.851562 5.49375ZM17.3516 17.4937C17.1406 17.5734 17 17.775 17 18C17 18.225 17.1406 18.4266 17.3516 18.5062L20 19.5L20.9938 22.1484C21.0734 22.3594 21.275 22.5 21.5 22.5C21.725 22.5 21.9266 22.3594 22.0062 22.1484L23 19.5L25.6484 18.5062C25.8594 18.4266 26 18.225 26 18C26 17.775 25.8594 17.5734 25.6484 17.4937L23 16.5L22.0062 13.8516C21.9266 13.6406 21.725 13.5 21.5 13.5C21.275 13.5 21.0734 13.6406 20.9938 13.8516L20 16.5L17.3516 17.4937Z" fill="#7C3AED"/>
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-gray-900 text-center font-medium text-lg">Get Matched</h3>
                  <p className="text-gray-600 text-center text-base">
                    We'll suggest the best creatives
                  </p>
                </div>
              </div>
              
              <div className="flex min-w-60 px-4 flex-col items-center gap-4 flex-1">
                <div className="flex w-16 h-16 p-5 justify-center items-center rounded-full bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <svg className="w-7 h-6 text-purple-600" fill="currentColor" viewBox="0 0 28 24">
                    <path d="M11.5016 2.00156L9.73438 2.6625C9.59375 2.71406 9.5 2.85 9.5 3C9.5 3.15 9.59375 3.28594 9.73438 3.3375L11.5016 3.99844L12.1625 5.76562C12.2141 5.90625 12.35 6 12.5 6C12.65 6 12.7859 5.90625 12.8375 5.76562L13.4984 3.99844L15.2656 3.3375C15.4062 3.28594 15.5 3.15 15.5 3C15.5 2.85 15.4062 2.71406 15.2656 2.6625L13.4984 2.00156L12.8375 0.234375C12.7859 0.09375 12.65 0 12.5 0C12.35 0 12.2141 0.09375 12.1625 0.234375L11.5016 2.00156ZM2.66094 18.5344C1.78437 19.4109 1.78437 20.8359 2.66094 21.7172L4.28281 23.3391C5.15937 24.2156 6.58438 24.2156 7.46563 23.3391L25.3391 5.46094C26.2156 4.58437 26.2156 3.15937 25.3391 2.27812L23.7172 0.660937C22.8406 -0.215625 21.4156 -0.215625 20.5344 0.660937L2.66094 18.5344ZM23.2156 3.87187L18.2938 8.79375L17.2016 7.70156L22.1234 2.77969L23.2156 3.87187ZM0.851562 5.49375C0.640625 5.57344 0.5 5.775 0.5 6C0.5 6.225 0.640625 6.42656 0.851562 6.50625L3.5 7.5L4.49375 10.1484C4.57344 10.3594 4.775 10.5 5 10.5C5.225 10.5 5.42656 10.3594 5.50625 10.1484L6.5 7.5L9.14844 6.50625C9.35938 6.42656 9.5 6.225 9.5 6C9.5 5.775 9.35938 5.57344 9.14844 5.49375L6.5 4.5L5.50625 1.85156C5.42656 1.64062 5.225 1.5 5 1.5C4.775 1.5 4.57344 1.64062 4.49375 1.85156L3.5 4.5L0.851562 5.49375ZM17.3516 17.4937C17.1406 17.5734 17 17.775 17 18C17 18.225 17.1406 18.4266 17.3516 18.5062L20 19.5L20.9938 22.1484C21.0734 22.3594 21.275 22.5 21.5 22.5C21.725 22.5 21.9266 22.3594 22.0062 22.1484L23 19.5L25.6484 18.5062C25.8594 18.4266 26 18.225 26 18C26 17.775 25.8594 17.5734 25.6484 17.4937L23 16.5L22.0062 13.8516C21.9266 13.6406 21.725 13.5 21.5 13.5C21.275 13.5 21.0734 13.6406 20.9938 13.8516L20 16.5L17.3516 17.4937Z" fill="#7C3AED"/>
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-gray-900 text-center font-medium text-lg">Review & Pay</h3>
                  <p className="text-gray-600 text-center text-base">
                    Preview work and pay securely
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tip */}
        <div className="p-8 items-start gap-2 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex pr-4 items-start gap-4 flex-1 flex-wrap">
              <div className="flex w-10 h-10 p-3 justify-center items-center rounded-full bg-white">
                <svg className="w-3 h-4 text-purple-600" fill="currentColor" viewBox="0 0 12 16">
                  <path d="M8.5 12C8.8 11.0031 9.42188 10.1531 10.0375 9.30625C10.2 9.08437 10.3625 8.8625 10.5188 8.6375C11.1375 7.74687 11.5 6.66875 11.5 5.50313C11.5 2.4625 9.0375 0 6 0C2.9625 0 0.5 2.4625 0.5 5.5C0.5 6.66563 0.8625 7.74687 1.48125 8.63437C1.6375 8.85938 1.8 9.08125 1.9625 9.30313C2.58125 10.15 3.20312 11.0031 3.5 11.9969H8.5V12ZM6 16C7.38125 16 8.5 14.8813 8.5 13.5V13H3.5V13.5C3.5 14.8813 4.61875 16 6 16ZM3.5 5.5C3.5 5.775 3.275 6 3 6C2.725 6 2.5 5.775 2.5 5.5C2.5 3.56562 4.06562 2 6 2C6.275 2 6.5 2.225 6.5 2.5C6.5 2.775 6.275 3 6 3C4.61875 3 3.5 4.11875 3.5 5.5Z" fill="#7C3AED"/>
                </svg>
              </div>
              <div className="flex min-w-60 px-0 py-1 flex-col items-start gap-2 flex-1">
                <h3 className="text-purple-800 font-bold text-xl leading-7">Quick Tip</h3>
                <p className="text-purple-700 text-base leading-5">
                  Not sure what you need? Try recording a voice note and it can be turned into a job brief.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex w-[114px] h-9 px-4 py-2 justify-center items-center rounded-full border-2 border-purple-200 bg-white">
                <span className="text-purple-600 text-center text-sm">Record Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Freelancers Section */}
        <div className="p-8 flex-col gap-8 bg-white border border-gray-200 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              <h2 className="min-w-[290px] flex-1 text-gray-900 font-bold text-2xl leading-[34px] tracking-tight">
                Freelancers you might like
              </h2>
              <div className="flex w-[116px] h-10 p-2 flex-col items-start gap-2">
                <button className="flex justify-center items-center gap-2 self-stretch rounded-xl">
                  <span className="text-black text-base font-medium">View All</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 21 20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.433 20L9.684 18.092L15.758 11.393H0.5V8.607H15.758L9.684 1.919L11.433 0L20.5 10L11.433 20Z" fill="#7C3AED"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 overflow-x-auto">
            {loading ? (
              // Loading skeleton for freelancers
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex w-80 h-[500px] flex-col items-center border border-gray-200 bg-gray-100 rounded-2xl animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-t-2xl"></div>
                    <div className="flex flex-col gap-4 p-4 w-full">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : error ? (
              <div className="flex items-center justify-center w-full py-8">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : freelancers.length > 0 ? (
              freelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-8">
                <p className="text-gray-600">No featured freelancers available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Services */}
        <div className="p-8 flex-col gap-8 bg-white border border-gray-200 rounded-2xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
          <div className="flex w-full px-0 py-1 items-center">
            <h2 className="text-gray-900 font-bold text-2xl leading-[34px] tracking-tight">
              Popular Services
            </h2>
          </div>
          
          <div className="flex items-center gap-8 flex-wrap">
            {loading ? (
              // Loading skeleton for services
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex w-[200px] h-[232px] p-5 items-center border border-gray-200 bg-gray-100 rounded-xl animate-pulse">
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : error ? (
              <div className="flex items-center justify-center w-full py-8">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Failed to load services</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : services.length > 0 ? (
              services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-8">
                <p className="text-gray-600">No popular services available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

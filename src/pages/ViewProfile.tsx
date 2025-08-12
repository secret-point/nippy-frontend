import { useState } from 'react'

interface ProfileData {
  name: string
  rating: number
  reviewCount: number
  description: string
  skills: string[]
  location: string
  responseTime: string
  startingPrice: string
  profileImage?: string
  hasOnlineStatus?: boolean
}

interface PortfolioItem {
  id: string
  title: string
  category: string
  image?: string
}

interface StatData {
  label: string
  value: string
}

interface TestimonialData {
  id: string
  rating: number
  text: string
  authorName: string
  authorTitle: string
  authorImage?: string
}

interface SimilarFreelancer {
  id: string
  name: string
  rating: number
  reviewCount: number
  skills: string[]
  description: string
  startingPrice: string
  badge?: string
  hasImage?: boolean
}

const profileData: ProfileData = {
  name: 'Sarah Williams',
  rating: 4.8,
  reviewCount: 124,
  description: 'Experienced brand designer specializing in logo design and visual identity systems for startups and small businesses.',
  skills: ['Logo Design', 'Brand Identity', 'Social Media Ads', 'Packaging Design', 'Menu Boards'],
  location: 'Chicago, IL',
  responseTime: 'Response: within a day',
  startingPrice: 'Starting at $120',
  hasOnlineStatus: true
}

const portfolioItems: PortfolioItem[] = [
  { id: '1', title: 'Brand Identity Project', category: 'Branding' },
  { id: '2', title: 'Logo Design Collection', category: 'Logo Design' },
  { id: '3', title: 'Social Media Campaign', category: 'Social Media' },
  { id: '4', title: 'Pure Glow Packaging', category: 'Packaging Design, Product Branding' },
  { id: '5', title: 'Restaurant Menu Design', category: 'Menu Design' },
  { id: '6', title: 'Corporate Identity', category: 'Branding' }
]

const statsData: StatData[] = [
  { label: 'Years Experience', value: '8+' },
  { label: 'Projects Completed', value: '200+' },
  { label: 'Client Reviews', value: '126' },
  { label: 'Satisfaction Rate', value: '98%' }
]

const testimonials: TestimonialData[] = [
  {
    id: '1',
    rating: 5,
    text: '"Sarah created an amazing logo and brand identity for my new café. She understood exactly what I was looking for and delivered beyond my expectations. The designs have received so many compliments from customers!"',
    authorName: 'Michael Brown',
    authorTitle: 'Bean & Brew Café'
  },
  {
    id: '2',
    rating: 5,
    text: '"Sarah created an amazing logo and brand identity for my new café. She understood exactly what I was looking for and delivered beyond my expectations. The designs have received so many compliments from customers!"',
    authorName: 'Emma Wilson',
    authorTitle: 'Luma Fashion'
  },
  {
    id: '3',
    rating: 5,
    text: '"Sarah designed beautiful menu boards for our restaurant that perfectly captured our brand\'s essence. She was professional, responsive, and delivered the project ahead of schedule!"',
    authorName: 'Roberto Gianni',
    authorTitle: 'Taste of Italy Restaurant'
  }
]

const similarFreelancers: SimilarFreelancer[] = [
  {
    id: '1',
    name: 'James Wilson',
    rating: 4.9,
    reviewCount: 234,
    skills: ['Menu Design', 'Logo', 'Posters'],
    description: 'Helping businesses grow with social ads and motion graphics tailored for impact and recognition.',
    startingPrice: '$10',
    badge: 'Top Rated'
  },
  {
    id: '2',
    name: 'Emma Johnson',
    rating: 4.7,
    reviewCount: 567,
    skills: ['Web Development', 'E-commerce', 'SEO Strategies'],
    description: 'Creating responsive websites that drive traffic and increase sales through optimized user experiences.',
    startingPrice: '$15',
    hasImage: true
  },
  {
    id: '3',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    hasImage: true
  }
]

const StarRating = ({ rating: _, size = 'small' }: { rating: number; size?: 'small' | 'medium' }) => {
  const starSize = size === 'small' ? 'w-[18px] h-4' : 'w-5 h-5'
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={starSize} fill="#FACC15" viewBox="0 0 18 16">
          <path d="M9.90645 0.5625C9.74083 0.21875 9.39083 0 9.00645 0C8.62208 0 8.2752 0.21875 8.10645 0.5625L6.09708 4.69688L1.60958 5.35938C1.23458 5.41563 0.922076 5.67812 0.806451 6.0375C0.690826 6.39687 0.784576 6.79375 1.05333 7.05937L4.30958 10.2812L3.54083 14.8344C3.47833 15.2094 3.63458 15.5906 3.94395 15.8125C4.25333 16.0344 4.6627 16.0625 5.0002 15.8844L9.00958 13.7437L13.019 15.8844C13.3565 16.0625 13.7658 16.0375 14.0752 15.8125C14.3846 15.5875 14.5408 15.2094 14.4783 14.8344L13.7065 10.2812L16.9627 7.05937C17.2315 6.79375 17.3283 6.39687 17.2096 6.0375C17.0908 5.67812 16.7815 5.41563 16.4065 5.35938L11.9158 4.69688L9.90645 0.5625Z"/>
        </svg>
      ))}
    </div>
  )
}

const SimilarFreelancerCard = ({ freelancer }: { freelancer: SimilarFreelancer }) => {
  const [saved, setSaved] = useState(false)

  return (
    <div className="flex w-72 flex-col items-center border border-gray-200 bg-white rounded-2xl overflow-hidden">
      <div className="flex w-full h-48 justify-between items-start p-3 relative bg-gray-100">
        {freelancer.badge && (
          <div className="px-2 py-1 rounded-full text-xs font-medium text-white bg-blue-600">
            {freelancer.badge}
          </div>
        )}
        <button 
          onClick={() => setSaved(!saved)}
          className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 16">
            <path 
              d="M2.30156 9.07747L7.24258 13.701C7.44766 13.8928 7.71836 13.9997 8 13.9997C8.28164 13.9997 8.55234 13.8928 8.75742 13.701L13.6984 9.07747C14.5297 8.30186 15 7.21381 15 6.07644V5.91748C15 4.00175 13.6191 2.36831 11.7352 2.05313C10.4883 1.84484 9.21953 2.2532 8.32812 3.14666L8 3.47554L7.67188 3.14666C6.78047 2.2532 5.51172 1.84484 4.26484 2.05313C2.38086 2.36831 1 4.00175 1 5.91748V6.07644C1 7.21381 1.47031 8.30186 2.30156 9.07747Z" 
              fill={saved ? "#EF4444" : "#374151"}
            />
          </svg>
        </button>
      </div>

      <div className="flex h-[340px] max-h-[340px] p-4 flex-col justify-between items-end self-stretch">
        <div className="flex flex-col items-start gap-5 self-stretch">
          <div className="flex items-center gap-3 self-stretch">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex flex-col items-start gap-1 flex-1">
              <h3 className="text-gray-900 font-bold text-xl leading-7 tracking-tight">
                {freelancer.name}
              </h3>
              <div className="flex items-center gap-1">
                <svg className="w-[13.5px] h-3" fill="#FBBF24" viewBox="0 0 14 13">
                  <path d="M7.424 0.922C7.3 0.664 7.037 0.5 6.749 0.5C6.461 0.5 6.201 0.664 6.074 0.922L4.567 4.023L1.201 4.52C0.92 4.562 0.686 4.759 0.599 5.028C0.512 5.298 0.583 5.595 0.784 5.795L3.226 8.211L2.65 11.626C2.603 11.907 2.72 12.193 2.952 12.359C3.184 12.526 3.491 12.547 3.744 12.413L6.751 10.808L9.758 12.413C10.012 12.547 10.319 12.528 10.551 12.359C10.783 12.191 10.9 11.907 10.853 11.626L10.274 8.211L12.716 5.795C12.918 5.595 12.99 5.298 12.901 5.028C12.812 4.759 12.58 4.562 12.299 4.52L8.931 4.023L7.424 0.922Z"/>
                </svg>
                <span className="text-gray-900 text-sm font-medium">{freelancer.rating}</span>
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

export const ViewProfile = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'about' | 'testimonials'>('portfolio')

  return (
    <div className="flex flex-col items-start gap-[50px] w-full max-w-[1104px] mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="flex items-center gap-8 self-stretch">
        <button className="flex px-6 py-2.5 justify-center items-center gap-3 rounded-xl bg-black/5 border border-black/5 shadow-sm">
          <svg className="w-5 h-5" fill="black" viewBox="0 0 20 20">
            <path d="M9.06705 20L10.8163 18.0922L4.74247 11.3934H20V8.60665H4.74247L10.8163 1.91854L9.06705 0L0 10L9.06705 20Z"/>
          </svg>
          <span className="text-black text-base font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-start gap-8 self-stretch">
        {/* Profile Header Section */}
        <div className="flex flex-col items-start self-stretch rounded-xl bg-white shadow-sm overflow-hidden">
          {/* Cover Background */}
          <div className="flex h-64 px-4 pb-4 flex-col justify-end items-end gap-2.5 self-stretch bg-purple-100 relative">
            <div className="flex h-[62px] justify-between items-start flex-shrink-0 self-stretch">
              {/* Profile Photo */}
              <div className="flex w-32 h-32 justify-end items-end gap-2.5 relative">
                <div className="flex w-32 h-32 p-1 justify-center items-center rounded-full border-4 border-white bg-gray-100 shadow-lg">
                  <div className="w-30 h-30 rounded-full bg-gray-200"></div>
                </div>
                {profileData.hasOnlineStatus && (
                  <div className="w-6 h-6 rounded-full border-4 border-white bg-green-500 absolute bottom-0 right-0"></div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex pb-4 items-center gap-2">
                <button className="flex w-8 h-8 p-1.5 flex-col justify-center items-center rounded-full bg-white">
                  <svg className="w-[14px] h-4" fill="#374151" viewBox="0 0 14 16">
                    <path d="M11 7C12.6562 7 14 5.65625 14 4C14 2.34375 12.6562 1 11 1C9.34375 1 8 2.34375 8 4C8 4.125 8.00625 4.25 8.02188 4.37187L5.08125 5.84062C4.54375 5.31875 3.80938 5 3 5C1.34375 5 0 6.34375 0 8C0 9.65625 1.34375 11 3 11C3.80938 11 4.54375 10.6813 5.08125 10.1594L8.02188 11.6281C8.00625 11.75 8 11.8719 8 12C8 13.6562 9.34375 15 11 15C12.6562 15 14 13.6562 14 12C14 10.3438 12.6562 9 11 9C10.1906 9 9.45625 9.31875 8.91875 9.84062L5.97813 8.37187C5.99375 8.25 6 8.12813 6 8C6 7.87187 5.99375 7.75 5.97813 7.62813L8.91875 6.15938C9.45625 6.68125 10.1906 7 11 7Z"/>
                  </svg>
                </button>
                <button className="flex w-8 h-8 p-1.5 justify-center items-center rounded-full bg-white">
                  <svg className="w-4 h-4" fill="#EF4444" viewBox="0 0 16 16">
                    <path d="M1.4875 9.38669L7.13438 14.6586C7.36875 14.8773 7.67812 14.9992 8 14.9992C8.32187 14.9992 8.63125 14.8773 8.86563 14.6586L14.5125 9.38669C15.4625 8.50232 16 7.26169 16 5.96482V5.78357C16 3.59919 14.4219 1.73669 12.2688 1.37732C10.8438 1.13982 9.39375 1.60544 8.375 2.62419L8 2.99919L7.625 2.62419C6.60625 1.60544 5.15625 1.13982 3.73125 1.37732C1.57812 1.73669 0 3.59919 0 5.78357V5.96482C0 7.26169 0.5375 8.50232 1.4875 9.38669Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex px-8 py-6 flex-col items-center self-stretch">
            <div className="flex items-center content-center gap-10 self-stretch flex-wrap">
              <div className="flex min-w-[350px] items-start gap-5 flex-1">
                <div className="flex flex-col items-start gap-3 flex-1">
                  <div className="flex flex-col items-start gap-3 self-stretch">
                    <h1 className="text-gray-900 font-bold text-xl leading-7 tracking-tight">
                      {profileData.name}
                    </h1>
                    <div className="flex items-center content-center gap-2.5 self-stretch flex-wrap">
                      <div className="flex items-center">
                        <StarRating rating={profileData.rating} />
                        <span className="ml-2.5 text-gray-600 text-base flex-1">
                          {profileData.rating} ({profileData.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <p className="self-stretch text-gray-600 text-base leading-6">
                      {profileData.description}
                    </p>
                    <div className="flex items-start content-start gap-2 self-stretch flex-wrap">
                      {profileData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 rounded-full bg-purple-50 text-purple-600 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center content-center gap-6 self-stretch flex-wrap">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="#3A404A" viewBox="0 0 16 17">
                          <path d="M8.00188 9.9463C6.58187 9.9463 5.42188 8.79297 5.42188 7.3663C5.42188 5.93964 6.58187 4.79297 8.00188 4.79297C9.42188 4.79297 10.5819 5.9463 10.5819 7.37297C10.5819 8.79964 9.42188 9.9463 8.00188 9.9463ZM8.00188 5.79297C7.13521 5.79297 6.42188 6.49964 6.42188 7.37297C6.42188 8.2463 7.12854 8.95297 8.00188 8.95297C8.87521 8.95297 9.58188 8.2463 9.58188 7.37297C9.58188 6.49964 8.86854 5.79297 8.00188 5.79297Z"/>
                          <path d="M8.00109 15.674C7.01443 15.674 6.02109 15.3007 5.24776 14.5607C3.28109 12.6673 1.10776 9.64732 1.92776 6.05399C2.66776 2.79398 5.51443 1.33398 8.00109 1.33398C8.00109 1.33398 8.0011 1.33398 8.00776 1.33398C10.4944 1.33398 13.3411 2.79398 14.0811 6.06065C14.8944 9.65399 12.7211 12.6673 10.7544 14.5607C9.98109 15.3007 8.98776 15.674 8.00109 15.674ZM8.00109 2.33398C6.06109 2.33398 3.56776 3.36732 2.90776 6.27398C2.18776 9.41399 4.16109 12.1207 5.94776 13.834C7.10109 14.9473 8.90776 14.9473 10.0611 13.834C11.8411 12.1207 13.8144 9.41399 13.1078 6.27398C12.4411 3.36732 9.9411 2.33398 8.00109 2.33398Z"/>
                        </svg>
                        <span className="text-gray-700 text-sm">{profileData.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="#3A404A" viewBox="0 0 16 17">
                          <path d="M8.00261 15.6673C4.04927 15.6673 0.835938 12.454 0.835938 8.50065C0.835938 4.54732 4.04927 1.33398 8.00261 1.33398C11.9559 1.33398 15.1693 4.54732 15.1693 8.50065C15.1693 12.454 11.9559 15.6673 8.00261 15.6673ZM8.00261 2.33398C4.60261 2.33398 1.83594 5.10065 1.83594 8.50065C1.83594 11.9007 4.60261 14.6673 8.00261 14.6673C11.4026 14.6673 14.1693 11.9007 14.1693 8.50065C14.1693 5.10065 11.4026 2.33398 8.00261 2.33398Z"/>
                          <path d="M10.4711 11.1192C10.3845 11.1192 10.2978 11.0992 10.2178 11.0459L8.15115 9.81253C7.63781 9.50586 7.25781 8.83253 7.25781 8.23919V5.50586C7.25781 5.23253 7.48448 5.00586 7.75781 5.00586C8.03115 5.00586 8.25781 5.23253 8.25781 5.50586V8.23919C8.25781 8.47919 8.45781 8.83253 8.66448 8.95253L10.7311 10.1859C10.9711 10.3259 11.0445 10.6325 10.9045 10.8725C10.8045 11.0325 10.6378 11.1192 10.4711 11.1192Z"/>
                        </svg>
                        <span className="text-gray-700 text-sm">{profileData.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="#3A404A" viewBox="0 0 16 17">
                          <path d="M8.93344 12.1134H7.2601C6.16677 12.1134 5.2801 11.1934 5.2801 10.0601C5.2801 9.78672 5.50677 9.56005 5.7801 9.56005C6.05344 9.56005 6.2801 9.78672 6.2801 10.0601C6.2801 10.6401 6.7201 11.1134 7.2601 11.1134H8.93344C9.36677 11.1134 9.72677 10.7267 9.72677 10.2601C9.72677 9.68005 9.5201 9.56672 9.1801 9.44672L6.49344 8.50005C5.97344 8.32005 5.27344 7.93339 5.27344 6.74005C5.27344 5.71339 6.0801 4.88672 7.06677 4.88672H8.7401C9.83344 4.88672 10.7201 5.80672 10.7201 6.94005C10.7201 7.21339 10.4934 7.44005 10.2201 7.44005C9.94677 7.44005 9.7201 7.21339 9.7201 6.94005C9.7201 6.36005 9.2801 5.88672 8.7401 5.88672H7.06677C6.63344 5.88672 6.27344 6.27339 6.27344 6.74005C6.27344 7.32005 6.4801 7.43339 6.8201 7.55339L9.50677 8.50005C10.0268 8.68005 10.7268 9.06672 10.7268 10.2601C10.7201 11.2801 9.9201 12.1134 8.93344 12.1134Z"/>
                          <path d="M8 13C7.72667 13 7.5 12.7733 7.5 12.5V4.5C7.5 4.22667 7.72667 4 8 4C8.27333 4 8.5 4.22667 8.5 4.5V12.5C8.5 12.7733 8.27333 13 8 13Z"/>
                          <path d="M8.00261 15.6673C4.04927 15.6673 0.835938 12.454 0.835938 8.50065C0.835938 4.54732 4.04927 1.33398 8.00261 1.33398C11.9559 1.33398 15.1693 4.54732 15.1693 8.50065C15.1693 12.454 11.9559 15.6673 8.00261 15.6673ZM8.00261 2.33398C4.60261 2.33398 1.83594 5.10065 1.83594 8.50065C1.83594 11.9007 4.60261 14.6673 8.00261 14.6673C11.4026 14.6673 14.1693 11.9007 14.1693 8.50065C14.1693 5.10065 11.4026 2.33398 8.00261 2.33398Z"/>
                        </svg>
                        <span className="text-gray-700 text-sm">{profileData.startingPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="flex px-4 py-2.5 items-center gap-2 border border-purple-600 bg-white rounded-xl text-purple-600 text-base">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 17">
                  <path d="M11.9173 15.0798C11.7106 15.0798 11.504 15.0265 11.3173 14.9132L8.64396 13.3265C8.36396 13.3198 8.08396 13.2998 7.81729 13.2598C7.63729 13.2332 7.48395 13.1132 7.41729 12.9398C7.35062 12.7665 7.38396 12.5798 7.50396 12.4398C7.94396 11.9265 8.17062 11.3132 8.17062 10.6598C8.17062 9.0465 6.75062 7.73315 5.00396 7.73315C4.35062 7.73315 3.72395 7.91318 3.19729 8.25985C3.05062 8.35318 2.87062 8.36651 2.71062 8.29317C2.55729 8.21984 2.44396 8.07315 2.42396 7.89982C2.40396 7.71315 2.39062 7.5265 2.39062 7.33317C2.39062 4.0265 5.25729 1.33984 8.77729 1.33984C12.2973 1.33984 15.164 4.0265 15.164 7.33317C15.164 9.1465 14.324 10.8132 12.844 11.9532L13.0706 13.7665C13.124 14.2199 12.924 14.6465 12.544 14.8932C12.3573 15.0132 12.1373 15.0798 11.9173 15.0798ZM8.77062 12.3198C8.86395 12.3132 8.95729 12.3399 9.03729 12.3932L11.8306 14.0532C11.904 14.0998 11.964 14.0798 12.004 14.0532C12.0373 14.0332 12.0906 13.9798 12.0773 13.8865L11.8173 11.7798C11.7973 11.5932 11.8773 11.4132 12.024 11.3065C13.384 10.3532 14.164 8.89982 14.164 7.31982C14.164 4.56649 11.7506 2.3265 8.77729 2.3265C5.91729 2.3265 3.57062 4.40652 3.39729 7.01986C3.89729 6.82652 4.43729 6.71985 4.99729 6.71985C7.29729 6.71985 9.16396 8.47982 9.16396 10.6465C9.17063 11.2332 9.03062 11.7998 8.77062 12.3198Z"/>
                  <path d="M3.05709 15.6665C2.88376 15.6665 2.71708 15.6199 2.56375 15.5199C2.26375 15.3266 2.10376 14.9932 2.14376 14.6399L2.27709 13.6132C1.37709 12.8799 0.84375 11.7932 0.84375 10.6532C0.84375 9.3532 1.52376 8.13987 2.66376 7.41321C3.35042 6.96654 4.16375 6.72656 5.01042 6.72656C7.31042 6.72656 9.17708 8.48653 9.17708 10.6532C9.17708 11.5332 8.85708 12.3999 8.27042 13.0865C7.51708 13.9999 6.39042 14.5332 5.15042 14.5732L3.52375 15.5399C3.37709 15.6265 3.21709 15.6665 3.05709 15.6665ZM5.00375 7.72656C4.35042 7.72656 3.72375 7.90655 3.19708 8.25321C2.34375 8.79988 1.83709 9.6932 1.83709 10.6532C1.83709 11.5799 2.29042 12.4266 3.09042 12.9732C3.24376 13.0799 3.32375 13.2599 3.30375 13.4465L3.15708 14.5865L4.75042 13.6399C4.83042 13.5932 4.91709 13.5665 5.00375 13.5665C5.98375 13.5665 6.91042 13.1466 7.49709 12.4332C7.93709 11.9132 8.17042 11.2999 8.17042 10.6465C8.17042 9.03986 6.75042 7.72656 5.00375 7.72656Z"/>
                </svg>
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="flex flex-col items-start self-stretch">
          <div className="flex px-8 flex-col items-start gap-2.5 self-stretch border-b border-gray-200">
            <div className="flex p-2.5 flex-col items-start gap-2.5">
              <div className="flex items-center self-stretch rounded-[10px] bg-white">
                <div className="flex flex-col justify-center items-center relative">
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`flex h-10 px-4 justify-center items-center gap-2.5 ${
                      activeTab === 'portfolio' ? 'text-purple-600' : 'text-gray-600'
                    }`}
                  >
                    <span className={`text-center text-base leading-6 ${
                      activeTab === 'portfolio' ? 'font-bold' : 'font-medium'
                    }`}>Portfolio</span>
                  </button>
                  {activeTab === 'portfolio' && (
                    <div className="flex w-[100px] h-10 px-3 justify-center items-center gap-2 border-b-2 border-purple-600"></div>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center relative">
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`flex h-10 px-4 justify-center items-center gap-2.5 ${
                      activeTab === 'about' ? 'text-purple-600' : 'text-gray-600'
                    }`}
                  >
                    <span className={`text-center text-base leading-6 ${
                      activeTab === 'about' ? 'font-bold' : 'font-medium'
                    }`}>About</span>
                  </button>
                  {activeTab === 'about' && (
                    <div className="flex w-[70px] h-10 px-3 justify-center items-center gap-2 border-b-2 border-purple-600"></div>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center">
                  <button
                    onClick={() => setActiveTab('testimonials')}
                    className={`flex h-10 px-4 justify-center items-center gap-2.5 ${
                      activeTab === 'testimonials' ? 'text-purple-600' : 'text-gray-600'
                    }`}
                  >
                    <span className={`text-center text-base leading-6 ${
                      activeTab === 'testimonials' ? 'font-bold' : 'font-medium'
                    }`}>Testimonials(24)</span>
                  </button>
                  {activeTab === 'testimonials' && (
                    <div className="flex w-[140px] h-10 px-3 justify-center items-center gap-2 border-b-2 border-purple-600"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'portfolio' && (
            <div className="flex px-8 py-6 flex-col items-start gap-2.5 self-stretch">
              <div className="flex pb-6 flex-col items-start gap-6 self-stretch">
                <div className="flex items-start content-start gap-4 self-stretch flex-wrap">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="w-96 h-64 rounded-lg bg-gray-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                      {item.category && (
                        <div className="absolute bottom-0 left-0 p-4">
                          <h4 className="text-white text-base font-medium mb-1">{item.title}</h4>
                          <p className="text-gray-200 text-sm">{item.category}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center content-center gap-1 self-stretch flex-wrap">
                  <button className="flex justify-center items-center gap-2 text-purple-600 text-sm font-medium">
                    <span>View All Work</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 21">
                      <path d="M9.4527 15.9367C9.98731 16.4656 10.8555 16.4656 11.3901 15.9367L19.6017 7.81327C20.1363 7.2844 20.1363 6.42552 19.6017 5.89665C19.067 5.36778 18.1988 5.36778 17.6642 5.89665L10.4193 13.0639L3.1743 5.90088C2.6397 5.37201 1.7715 5.37201 1.23689 5.90088C0.702286 6.42975 0.702286 7.28863 1.23689 7.8175L9.44843 15.9409L9.4527 15.9367Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="flex px-8 py-6 flex-col items-start gap-6 self-stretch border-t border-gray-200">
              <h2 className="text-gray-900 font-bold text-xl leading-7 tracking-tight">About Sarah</h2>
              <div className="flex flex-col items-start gap-8 self-stretch">
                <div className="flex flex-col items-start gap-8 self-stretch">
                  <p className="self-stretch text-gray-600 text-base leading-6">
                    Hi there! I'm Sarah, a passionate brand designer with over 8 years of experience working with startups and small businesses. I specialize in creating memorable visual identities that help businesses stand out in their markets.
                  </p>
                  <p className="self-stretch text-gray-600 text-base leading-6">
                    My design approach focuses on understanding your business goals and target audience to create designs that not only look great but also drive results. I believe that good design should be accessible to businesses of all sizes, which is why I've dedicated my career to helping small businesses compete with larger companies through strategic visual communication.
                  </p>
                  <p className="self-stretch text-gray-600 text-base leading-6">
                    When I'm not designing, you can find me exploring local art galleries, experimenting with new cooking recipes, or hiking with my dog, Max.
                  </p>
                </div>
                <div className="flex items-center content-center gap-4 self-stretch flex-wrap">
                  {statsData.map((stat) => (
                    <div key={stat.label} className="flex min-w-[200px] max-w-[248px] px-4 py-[18px] flex-col items-start gap-2.5 flex-1 rounded-lg bg-gray-50">
                      <div className="flex flex-col items-start gap-1 self-stretch">
                        <div className="text-purple-600 text-lg font-bold leading-7">{stat.value}</div>
                        <div className="text-gray-600 text-sm leading-5">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="flex px-8 py-6 flex-col items-start gap-6 self-stretch border-t border-gray-200">
              <div className="flex items-center gap-6 self-stretch">
                <h2 className="flex-1 text-gray-900 font-bold text-xl leading-7 tracking-tight">Client Testimonials</h2>
                <div className="flex w-16 h-[34px] justify-center items-start gap-2">
                  <button className="flex w-7 h-[34px] p-2 flex-col justify-center items-center border border-gray-200 rounded-full">
                    <svg className="w-2.5 h-4" fill="#4B5563" viewBox="0 0 10 16">
                      <path d="M0.292969 7.29414C-0.0976562 7.68477 -0.0976562 8.31914 0.292969 8.70977L6.29297 14.7098C6.68359 15.1004 7.31797 15.1004 7.70859 14.7098C8.09922 14.3191 8.09922 13.6848 7.70859 13.2941L2.41484 8.00039L7.70547 2.70664C8.09609 2.31602 8.09609 1.68164 7.70547 1.29102C7.31484 0.900391 6.68047 0.900391 6.28984 1.29102L0.289844 7.29102L0.292969 7.29414Z"/>
                    </svg>
                  </button>
                  <button className="flex w-7 h-[34px] p-2 flex-col justify-center items-center border border-gray-200 rounded-full">
                    <svg className="w-2.5 h-4" fill="#4B5563" viewBox="0 0 10 16">
                      <path d="M9.70859 7.29414C10.0992 7.68477 10.0992 8.31914 9.70859 8.70977L3.70859 14.7098C3.31797 15.1004 2.68359 15.1004 2.29297 14.7098C1.90234 14.3191 1.90234 13.6848 2.29297 13.2941L7.58672 8.00039L2.29609 2.70664C1.90547 2.31602 1.90547 1.68164 2.29609 1.29102C2.68672 0.900391 3.32109 0.900391 3.71172 1.29102L9.71172 7.29102L9.70859 7.29414Z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 self-stretch overflow-x-auto">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex h-[294px] min-w-[300px] max-w-[336px] p-4 flex-col items-start gap-4 flex-1 rounded-lg bg-gray-50">
                    <StarRating rating={testimonial.rating} />
                    <div className="flex flex-col items-start gap-1 self-stretch">
                      <p className="self-stretch text-gray-600 text-base leading-6">{testimonial.text}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="flex w-[119px] flex-col items-start gap-1">
                        <div className="text-gray-900 text-base font-medium leading-6">{testimonial.authorName}</div>
                        <div className="text-gray-600 text-sm leading-5">{testimonial.authorTitle}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similar Freelancers Section */}
        <div className="flex px-8 py-6 flex-col items-start gap-6 self-stretch rounded-xl bg-white shadow-sm">
          <div className="flex justify-end items-center content-center gap-4 self-stretch flex-wrap">
            <h2 className="min-w-[188px] flex-1 text-gray-900 font-bold text-2xl leading-[34px] tracking-tight">
              Similar Freelancers You Might Like
            </h2>
          </div>
          <div className="flex flex-col items-start gap-9 self-stretch">
            <div className="flex items-center gap-6 self-stretch overflow-x-auto">
              {similarFreelancers.map((freelancer) => (
                <SimilarFreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RatingBreakdown {
  stars: number
  percentage: number
  width: string
}

interface ReviewData {
  id: string
  authorName: string
  authorTitle: string
  rating: number
  date: string
  text: string
  skills: string[]
  authorImage?: string
}

const profileData = {
  name: 'Sarah Williams',
  rating: 4.8,
  reviewCount: 124,
  location: 'Chicago, IL',
  responseTime: 'Response: within a day',
  startingPrice: 'Starting at $120',
  skills: ['Logo Design', 'Brand Identity', 'Social Media Ads', 'Packaging Design', 'Menu Boards'],
  hasOnlineStatus: true
}

const ratingBreakdown: RatingBreakdown[] = [
  { stars: 5, percentage: 85, width: '145px' },
  { stars: 4, percentage: 12, width: '45px' },
  { stars: 3, percentage: 2, width: '15px' },
  { stars: 2, percentage: 1, width: '8px' },
  { stars: 1, percentage: 0, width: '8px' }
]

const reviews: ReviewData[] = [
  {
    id: '1',
    authorName: 'Michael Thompson',
    authorTitle: 'CEO, Elevate Studios',
    rating: 5,
    date: 'June 12, 2023',
    text: 'Sarah is an exceptional designer who truly understands how to translate business needs into beautiful, functional designs. She took our vague ideas and turned them into a cohesive brand identity that perfectly represents our company. Her communication was outstanding throughout the entire process, and she delivered everything ahead of schedule. I can\'t recommend her enough!',
    skills: ['Brand Identity', 'Logo Design']
  },
  {
    id: '2',
    authorName: 'Emma Wilson',
    authorTitle: 'Marketing Director, Luma Fashion',
    rating: 5,
    date: 'May 28, 2023',
    text: 'Working with Sarah was a dream! She designed our e-commerce website and the results exceeded all expectations. Her eye for detail and understanding of user experience is remarkable. She was incredibly responsive to feedback and made revisions quickly. Our conversion rate has increased by 35% since launching the new design. Sarah is now our go-to designer for all projects.',
    skills: ['E-commerce Design', 'UI/UX']
  },
  {
    id: '3',
    authorName: 'David Chen',
    authorTitle: 'Founder, TechFlow',
    rating: 4,
    date: 'May 15, 2023',
    text: 'Sarah designed our mobile app interface and did a fantastic job overall. Her designs were clean, modern, and user-friendly. The only reason for 4 stars instead of 5 is that we needed a few more revision rounds than expected to get to the final result. That said, I would still recommend Sarah and would work with her again on future projects.',
    skills: ['App Design', 'UI/UX']
  },
  {
    id: '4',
    authorName: 'Sophia Rodriguez',
    authorTitle: 'Creative Director, Artisan Collective',
    rating: 5,
    date: 'April 30, 2023',
    text: 'I\'ve worked with many designers over the years, but Sarah stands out for her creativity and professionalism. She designed our event materials (posters, social media graphics, and printed program) for our annual art exhibition, and the results were stunning. She captured the essence of our event perfectly and delivered everything on time despite our tight deadline. Looking forward to collaborating again!',
    skills: ['Event Design', 'Print Design', 'Social Media']
  },
  {
    id: '5',
    authorName: 'James Peterson',
    authorTitle: 'Owner, Craft Coffee Co.',
    rating: 5,
    date: 'April 15, 2023',
    text: 'Sarah created our cafe\'s menu design and branding materials. She has a unique ability to understand a business\'s vibe and translate that into design. Our customers frequently compliment our menus and packaging. Sarah was easy to work with, responsive, and delivered high-quality work. The only small issue was a slight delay in the final delivery, but the quality made up for it.',
    skills: ['Menu Design', 'Branding', 'Packaging']
  }
]

const StarRating = ({ rating, size = 'small' }: { rating: number; size?: 'small' | 'medium' }) => {
  const starSize = size === 'small' ? 'w-[18px] h-4' : 'w-5 h-5'
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={starSize} fill={i < rating ? "#FACC15" : "#E5E7EB"} viewBox="0 0 18 16">
          <path d="M9.90645 0.5625C9.74083 0.21875 9.39083 0 9.00645 0C8.62208 0 8.2752 0.21875 8.10645 0.5625L6.09708 4.69688L1.60958 5.35938C1.23458 5.41563 0.922076 5.67812 0.806451 6.0375C0.690826 6.39687 0.784576 6.79375 1.05333 7.05937L4.30958 10.2812L3.54083 14.8344C3.47833 15.2094 3.63458 15.5906 3.94395 15.8125C4.25333 16.0344 4.6627 16.0625 5.0002 15.8844L9.00958 13.7437L13.019 15.8844C13.3565 16.0625 13.7658 16.0375 14.0752 15.8125C14.3846 15.5875 14.5408 15.2094 14.4783 14.8344L13.7065 10.2812L16.9627 7.05937C17.2315 6.79375 17.3283 6.39687 17.2096 6.0375C17.0908 5.67812 16.7815 5.41563 16.4065 5.35938L11.9158 4.69688L9.90645 0.5625Z"/>
        </svg>
      ))}
    </div>
  )
}

export const ViewProfileReviews = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy] = useState('Most Relevant') // setSortBy not used yet
  const [category] = useState('All Categories') // setCategory not used yet

  const handleBack = () => {
    navigate(-1)
  }

  const handleViewProfile = () => {
    navigate('/profile/sarah-williams')
  }

  return (
    <div className="flex flex-col items-start gap-[50px] w-full max-w-[1104px] mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="flex items-center gap-8 self-stretch">
        <button
          onClick={handleBack}
          className="flex px-6 py-2.5 justify-center items-center gap-3 rounded-xl bg-black/5 border border-black/5 shadow-sm hover:bg-black/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="black" viewBox="0 0 20 20">
            <path d="M9.06705 20L10.8163 18.0922L4.74247 11.3934H20V8.60665H4.74247L10.8163 1.91854L9.06705 0L0 10L9.06705 20Z"/>
          </svg>
          <span className="text-black text-base font-medium">Back</span>
        </button>
      </div>

      {/* Profile Container */}
      <div className="flex flex-col items-start self-stretch">
        {/* Profile Header */}
        <div className="flex px-8 py-6 items-start content-start gap-6 self-stretch flex-wrap rounded-t-xl border-b border-gray-200 bg-white">
          <div className="flex min-w-[300px] max-w-[840px] items-start content-start gap-6 flex-1 flex-wrap">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-200"></div>
              {profileData.hasOnlineStatus && (
                <div className="w-4 h-4 rounded-full border-2 border-white bg-green-500 absolute bottom-0 right-0"></div>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex items-center content-center gap-10 flex-1 flex-wrap">
              <div className="flex flex-col items-start gap-3 flex-1">
                <div className="flex flex-col items-start gap-4 self-stretch">
                  <h1 className="text-gray-900 font-bold text-xl leading-7 tracking-tight">
                    {profileData.name}
                  </h1>
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
                </div>
              </div>
            </div>
          </div>
          
          {/* Rating Section */}
          <div className="flex min-w-[160px] flex-col items-end gap-6">
            <div className="flex items-start gap-[18px]">
              <div className="text-black font-bold text-[32px] leading-[130%] tracking-tight">
                {profileData.rating}
              </div>
              <div className="flex flex-col justify-center items-start gap-2.5">
                <StarRating rating={profileData.rating} />
                <div className="text-gray-600 text-base">{profileData.reviewCount} reviews</div>
              </div>
            </div>
            <button
              onClick={handleViewProfile}
              className="flex px-6 py-2.5 justify-center items-center gap-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="text-black text-base">View Profile</span>
            </button>
          </div>
        </div>

        {/* Rating Summary and Filter Reviews */}
        <div className="flex px-6 py-6 flex-col items-start gap-2.5 self-stretch border-b border-gray-200 bg-white">
          <div className="flex items-start content-start gap-10 self-stretch flex-wrap">
            {/* Rating Summary */}
            <div className="flex min-w-[350px] max-w-[500px] flex-col items-start gap-5 flex-1">
              <h2 className="text-gray-900 text-lg font-medium">Rating Summary</h2>
              <div className="flex items-center content-center gap-4 self-stretch flex-wrap">
                <div className="flex w-[92px] flex-col items-center gap-3.5">
                  <div className="text-gray-900 text-center font-bold text-[32px] leading-[130%] tracking-tight">
                    {profileData.rating}
                  </div>
                  <div className="flex flex-col items-center gap-2 self-stretch">
                    <StarRating rating={profileData.rating} />
                    <div className="text-gray-500 text-center text-sm">{profileData.reviewCount} reviews</div>
                  </div>
                </div>
                
                {/* Rating Distribution */}
                <div className="flex w-[243px] flex-col items-start gap-1">
                  {ratingBreakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3 self-stretch">
                      <div className="w-6 text-gray-600 text-sm">{item.stars}★</div>
                      <div className="flex w-[170px] flex-col items-start gap-2.5 rounded-full bg-gray-200">
                        <div 
                          className="h-2.5 rounded-full bg-yellow-400"
                          style={{ width: item.width }}
                        ></div>
                      </div>
                      <div className="text-gray-600 text-sm">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Reviews */}
            <div className="flex min-w-[346px] max-w-[516px] flex-col items-start gap-2.5 flex-1">
              <h2 className="text-gray-900 text-lg font-medium">Filter Reviews</h2>
              <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <label className="text-gray-600 text-base font-medium">Sort By</label>
                  <div className="flex px-4 py-3 justify-between items-center self-stretch rounded-lg border border-gray-200">
                    <span className="text-gray-500 text-sm">{sortBy}</span>
                    <svg className="w-6 h-6" fill="#737373" viewBox="0 0 24 24">
                      <path d="M12.0034 16.8006C11.3034 16.8006 10.6034 16.5306 10.0734 16.0006L3.55344 9.48062C3.26344 9.19062 3.26344 8.71062 3.55344 8.42063C3.84344 8.13063 4.32344 8.13063 4.61344 8.42063L11.1334 14.9406C11.6134 15.4206 12.3934 15.4206 12.8734 14.9406L19.3934 8.42063C19.6834 8.13063 20.1634 8.13063 20.4534 8.42063C20.7434 8.71062 20.7434 9.19062 20.4534 9.48062L13.9334 16.0006C13.4034 16.5306 12.7034 16.8006 12.0034 16.8006Z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <label className="text-gray-600 text-base font-medium">Project Category</label>
                  <div className="flex px-4 py-3 justify-between items-center self-stretch rounded-lg border border-gray-200">
                    <span className="text-gray-500 text-sm">{category}</span>
                    <svg className="w-6 h-6" fill="#737373" viewBox="0 0 24 24">
                      <path d="M12.0034 16.8006C11.3034 16.8006 10.6034 16.5306 10.0734 16.0006L3.55344 9.48062C3.26344 9.19062 3.26344 8.71062 3.55344 8.42063C3.84344 8.13063 4.32344 8.13063 4.61344 8.42063L11.1334 14.9406C11.6134 15.4206 12.3934 15.4206 12.8734 14.9406L19.3934 8.42063C19.6834 8.13063 20.1634 8.13063 20.4534 8.42063C20.7434 8.71062 20.7434 9.19062 20.4534 9.48062L13.9334 16.0006C13.4034 16.5306 12.7034 16.8006 12.0034 16.8006Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="flex px-6 py-[21px] flex-col items-center gap-[26px] self-stretch bg-white">
          <h2 className="text-gray-900 font-bold text-xl leading-7">Client Testimonials ({profileData.reviewCount})</h2>
          
          <div className="flex flex-col items-start gap-[26px] self-stretch">
            {reviews.map((review) => (
              <div key={review.id} className="flex p-6 flex-col items-start gap-4 self-stretch rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-col items-start gap-4 self-stretch">
                  <div className="flex items-start content-start gap-6 self-stretch flex-wrap">
                    <div className="flex min-w-[270px] items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                      <div className="flex flex-col items-start">
                        <div className="text-gray-900 text-base font-semibold">{review.authorName}</div>
                        <div className="text-gray-600 text-sm">{review.authorTitle}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <StarRating rating={review.rating} />
                      <div className="text-gray-500 text-right text-sm">{review.date}</div>
                    </div>
                  </div>
                  <p className="self-stretch text-gray-600 text-base leading-6">{review.text}</p>
                </div>
                <div className="flex items-start content-start gap-2 self-stretch flex-wrap">
                  {review.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center items-center pb-0.5">
            <div className="flex items-center gap-3">
              <button className="flex w-8 px-3 py-2.5 justify-center items-center gap-2.5 rounded border border-gray-200 opacity-50">
                <svg className="w-2 h-3" fill="#6B7280" viewBox="0 0 9 12">
                  <path d="M0.977539 5.47012C0.68457 5.76309 0.68457 6.23887 0.977539 6.53184L5.47754 11.0318C5.77051 11.3248 6.24629 11.3248 6.53926 11.0318C6.83223 10.7389 6.83223 10.2631 6.53926 9.97012L2.56895 5.9998L6.53691 2.02949C6.82988 1.73652 6.82988 1.26074 6.53691 0.967773C6.24395 0.674805 5.76816 0.674805 5.4752 0.967773L0.975195 5.46777L0.977539 5.47012Z"/>
                </svg>
              </button>
              <button 
                className={`flex w-8 px-3 py-1 flex-col justify-center items-center gap-2.5 rounded ${currentPage === 1 ? 'bg-purple-600 text-white' : 'border border-gray-200 text-black'}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              {[2, 3, 4, 5].map((page) => (
                <button 
                  key={page}
                  className={`flex w-8 px-3 py-1 justify-center items-center gap-2.5 rounded ${currentPage === page ? 'bg-purple-600 text-white' : 'border border-gray-200 text-black'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button className="flex w-8 px-3 py-2.5 justify-center items-center gap-2.5 rounded border border-gray-200">
                <svg className="w-2 h-3" fill="#374151" viewBox="0 0 9 12">
                  <path d="M8.03926 5.47012C8.33223 5.76309 8.33223 6.23887 8.03926 6.53184L3.53926 11.0318C3.24629 11.3248 2.77051 11.3248 2.47754 11.0318C2.18457 10.7389 2.18457 10.2631 2.47754 9.97012L6.44785 5.9998L2.47988 2.02949C2.18691 1.73652 2.18691 1.26074 2.47988 0.967773C2.77285 0.674805 3.24863 0.674805 3.5416 0.967773L8.0416 5.46777L8.03926 5.47012Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

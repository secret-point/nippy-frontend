import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton, HeartIcon } from '../components/ui'

interface FreelancerData {
  id: string
  name: string
  rating: number
  reviewCount: number
  skills: string[]
  description: string
  startingPrice: string
  badge?: string
  isSaved?: boolean
  hasImage?: boolean
}

interface ProjectHistory {
  id: string
  freelancerName: string
  freelancerRating: number
  freelancerReviewCount: number
  freelancerSkills: string[]
  projectTitle: string
  completionDate: string
  projectRating: number
  deliveredFiles: string[]
  userReview: string
  isExpanded?: boolean
}

const mockFreelancers: FreelancerData[] = [
  {
    id: '1',
    name: 'James Wilson',
    rating: 4.9,
    reviewCount: 234,
    skills: ['Menu Design', 'Logo', 'Posters'],
    description: 'Helping businesses grow with social ads and motion graphics tailored for impact and recognition.',
    startingPrice: '$10',
    badge: 'Top Rated',
    isSaved: true
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

const previouslyWorkedProjects: ProjectHistory[] = [
  {
    id: 'p1',
    freelancerName: 'Sarah Williams',
    freelancerRating: 4.8,
    freelancerReviewCount: 124,
    freelancerSkills: ['Motion Design', 'Video Editing', 'After Effects'],
    projectTitle: 'Summer Promo Video – May 2024',
    completionDate: 'May 15, 2024',
    projectRating: 5.0,
    deliveredFiles: ['video1.mp4', 'video2.mp4', 'assets.zip'],
    userReview: '"Sarah did an amazing job with our summer promo video. She understood our brand perfectly and delivered ahead of schedule. The quality exceeded our expectations!"',
    isExpanded: true
  },
  {
    id: 'p2',
    freelancerName: 'Sarah Williams',
    freelancerRating: 4.8,
    freelancerReviewCount: 124,
    freelancerSkills: ['Motion Design', 'Video Editing', 'After Effects'],
    projectTitle: 'Brand Intro Animation – February 2024',
    completionDate: 'February 23, 2024',
    projectRating: 4.5,
    deliveredFiles: ['animation.mp4', 'sources.ae'],
    userReview: '',
    isExpanded: false
  },
  {
    id: 'p3',
    freelancerName: 'Michael Chen',
    freelancerRating: 5.0,
    freelancerReviewCount: 87,
    freelancerSkills: ['UI/UX Design', 'Web Design', 'Figma'],
    projectTitle: 'Website Redesign – April 2024',
    completionDate: 'April 10, 2024',
    projectRating: 5.0,
    deliveredFiles: ['design.fig', 'assets.zip', 'prototype.html', 'style-guide.pdf'],
    userReview: '"Michael completely transformed our website. His attention to detail and understanding of our brand was exceptional. The new design has already increased our conversion rate by 30%!"',
    isExpanded: true
  }
]

const savedFreelancers: FreelancerData[] = [
  {
    id: 's1',
    name: 'James Wilson',
    rating: 4.9,
    reviewCount: 234,
    skills: ['Menu Design', 'Logo', 'Posters'],
    description: 'Helping businesses grow with social ads and motion graphics tailored for impact and recognition.',
    startingPrice: '$10',
    badge: 'Top Rated',
    isSaved: true
  },
  {
    id: 's2',
    name: 'Emma Johnson',
    rating: 4.7,
    reviewCount: 567,
    skills: ['Web Development', 'E-commerce', 'SEO Strategies'],
    description: 'Creating responsive websites that drive traffic and increase sales through optimized user experiences.',
    startingPrice: '$15',
    badge: 'Quick Delivery',
    hasImage: true,
    isSaved: true
  },
  {
    id: 's3',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    badge: 'New Freelancer',
    hasImage: true,
    isSaved: true
  },
  {
    id: 's4',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    hasImage: true,
    isSaved: true
  },
  {
    id: 's5',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    badge: 'Top Rated',
    hasImage: true,
    isSaved: true
  }
]

const discoverTalentFreelancers: FreelancerData[] = [
  {
    id: '4',
    name: 'James Wilson',
    rating: 4.9,
    reviewCount: 234,
    skills: ['Menu Design', 'Logo', 'Posters'],
    description: 'Helping businesses grow with social ads and motion graphics tailored for impact and recognition.',
    startingPrice: '$10',
    badge: 'Top Rated',
    isSaved: true
  },
  {
    id: '5',
    name: 'Emma Johnson',
    rating: 4.7,
    reviewCount: 567,
    skills: ['Web Development', 'E-commerce', 'SEO Strategies'],
    description: 'Creating responsive websites that drive traffic and increase sales through optimized user experiences.',
    startingPrice: '$15',
    hasImage: true
  },
  {
    id: '6',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    hasImage: true
  },
  {
    id: '7',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    hasImage: true
  },
  {
    id: '8',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    hasImage: true
  },
  {
    id: '9',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    badge: 'Top Rated'
  },
  {
    id: '10',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    hasImage: true
  },
  {
    id: '11',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    hasImage: true
  },
  {
    id: '12',
    name: 'Michael Smith',
    rating: 4.8,
    reviewCount: 890,
    skills: ['Graphic Design', 'Branding', 'Illustrations'],
    description: 'Transforming ideas into visual stories that resonate with audiences and elevate brand presence.',
    startingPrice: '$20',
    badge: 'Top Rated'
  }
]

const FreelancerCard = ({ freelancer }: { freelancer: FreelancerData }) => {
  const [saved, setSaved] = useState(freelancer.isSaved || false)
  const navigate = useNavigate()

  const toggleSave = () => {
    setSaved(!saved)
  }

  const handleViewProfile = () => {
    navigate(`/profile/${freelancer.name.toLowerCase().replace(' ', '-')}/reviews`)
  }

  return (
    <div className="flex w-72 flex-col items-center border border-gray-200 bg-white rounded-2xl overflow-hidden">
      <div className="flex w-full h-48 justify-between items-start p-3 relative bg-gray-100">
        {freelancer.badge && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
            freelancer.badge === 'Top Rated' ? 'bg-blue-600' :
            freelancer.badge === 'Quick Delivery' ? 'bg-green-600' :
            freelancer.badge === 'New Freelancer' ? 'bg-teal-600' :
            'bg-blue-600'
          }`}>
            {freelancer.badge}
          </div>
        )}
        <IconButton
          icon={<HeartIcon filled={saved} />}
          onClick={toggleSave}
          variant="save"
          aria-label={saved ? "Remove from saved" : "Save freelancer"}
        />
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
          <button
            onClick={handleViewProfile}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-base font-medium rounded-xl transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}

const NavigationArrows = () => {
  return (
    <div className="flex w-9 h-4 justify-center items-start gap-2">
      <button className="flex w-[14px] h-4 flex-col justify-center items-center">
        <svg className="w-[14px] h-4" fill="none" stroke="currentColor" viewBox="0 0 14 16">
          <path d="M0.293 7.294C-0.098 7.685 -0.098 8.319 0.293 8.71L5.293 13.71C5.684 14.1 6.318 14.1 6.709 13.71C7.099 13.319 7.099 12.685 6.709 12.294L3.412 9H13C13.552 9 14 8.554 14 8C14 7.447 13.552 7 13 7H3.415L6.705 3.707C7.096 3.316 7.096 2.682 6.705 2.291C6.315 1.9 5.68 1.9 5.29 2.291L0.29 7.291L0.293 7.294Z" fill="#9CA3AF"/>
        </svg>
      </button>
      <button className="flex w-[14px] h-4 flex-col justify-center items-center">
        <svg className="w-[14px] h-4" fill="none" stroke="currentColor" viewBox="0 0 14 16">
          <path d="M13.706 8.707C14.097 8.316 14.097 7.682 13.706 7.291L8.706 2.291C8.316 1.9 7.681 1.9 7.291 2.291C6.9 2.682 6.9 3.316 7.291 3.707L10.588 7H1C0.447 7 0 7.447 0 8C0 8.553 0.447 9 1 9H10.584L7.294 12.294C6.903 12.685 6.903 13.319 7.294 13.71C7.684 14.1 8.319 14.1 8.709 13.71L13.709 8.71L13.706 8.707Z" fill="#6D28D9"/>
        </svg>
      </button>
    </div>
  )
}

const ProjectCard = ({ project, isExpanded, onToggleExpand }: {
  project: ProjectHistory
  isExpanded: boolean
  onToggleExpand: (id: string) => void
}) => {
  const navigate = useNavigate()

  const handleViewProfile = () => {
    navigate(`/profile/${project.freelancerName.toLowerCase().replace(' ', '-')}/reviews`)
  }

  return (
    <div className="flex flex-col items-start border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Freelancer Header */}
      <div className="flex px-6 py-6 flex-col items-start gap-2.5 self-stretch border-b border-gray-200">
        <div className="flex items-center content-center gap-10 self-stretch flex-wrap">
          <div className="flex min-w-[350px] items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-gray-200"></div>
            <div className="flex flex-col items-start gap-3 flex-1">
              <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex h-6 flex-col justify-center self-stretch">
                  <h3 className="text-gray-900 font-bold text-xl leading-7 tracking-tight">
                    {project.freelancerName}
                  </h3>
                </div>
                <div className="flex items-center content-center gap-2.5 self-stretch flex-wrap">
                  <div className="flex items-center">
                    <div className="flex w-[18px] h-4 justify-center items-center">
                      <svg className="w-[18px] h-4" fill="#FACC15" viewBox="0 0 18 16">
                        <path d="M9.90645 0.5625C9.74083 0.21875 9.39083 0 9.00645 0C8.62208 0 8.2752 0.21875 8.10645 0.5625L6.09708 4.69688L1.60958 5.35938C1.23458 5.41563 0.922076 5.67812 0.806451 6.0375C0.690826 6.39687 0.784576 6.79375 1.05333 7.05937L4.30958 10.2812L3.54083 14.8344C3.47833 15.2094 3.63458 15.5906 3.94395 15.8125C4.25333 16.0344 4.6627 16.0625 5.0002 15.8844L9.00958 13.7437L13.019 15.8844C13.3565 16.0625 13.7658 16.0375 14.0752 15.8125C14.3846 15.5875 14.5408 15.2094 14.4783 14.8344L13.7065 10.2812L16.9627 7.05937C17.2315 6.79375 17.3283 6.39687 17.2096 6.0375C17.0908 5.67812 16.7815 5.41563 16.4065 5.35938L11.9158 4.69688L9.90645 0.5625Z"/>
                      </svg>
                    </div>
                    <span className="text-gray-600 text-base flex-1">{project.freelancerRating} ({project.freelancerReviewCount} reviews)</span>
                  </div>
                </div>
                <div className="flex items-start content-start gap-2 self-stretch flex-wrap">
                  {project.freelancerSkills.map((skill) => (
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleViewProfile}
              className="px-4 py-2.5 justify-center items-center border border-gray-300 bg-white rounded-md text-purple-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              View Profile
            </button>
            <button className="px-4 py-2.5 justify-center items-center bg-purple-600 rounded-md text-white text-sm font-medium">
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="flex px-6 py-6 flex-col items-start gap-6 self-stretch">
        <div className="flex items-center content-center gap-10 self-stretch flex-wrap">
          <div className="flex min-w-[350px] items-start gap-4 flex-1">
            <div className="flex flex-col items-start gap-3 flex-1">
              <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex items-start content-start gap-3 self-stretch flex-wrap">
                  <h4 className="text-gray-900 text-lg font-medium">{project.projectTitle}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                    Completed
                  </span>
                </div>
                <p className="text-gray-600 text-sm">Completed on {project.completionDate}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex w-[90px] h-4 justify-center items-start">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-[18px] h-4" fill="#FACC15" viewBox="0 0 18 16">
                  <path d="M9.90645 0.5625C9.74083 0.21875 9.39083 0 9.00645 0C8.62208 0 8.2752 0.21875 8.10645 0.5625L6.09708 4.69688L1.60958 5.35938C1.23458 5.41563 0.922076 5.67812 0.806451 6.0375C0.690826 6.39687 0.784576 6.79375 1.05333 7.05937L4.30958 10.2812L3.54083 14.8344C3.47833 15.2094 3.63458 15.5906 3.94395 15.8125C4.25333 16.0344 4.6627 16.0625 5.0002 15.8844L9.00958 13.7437L13.019 15.8844C13.3565 16.0625 13.7658 16.0375 14.0752 15.8125C14.3846 15.5875 14.5408 15.2094 14.4783 14.8344L13.7065 10.2812L16.9627 7.05937C17.2315 6.79375 17.3283 6.39687 17.2096 6.0375C17.0908 5.67812 16.7815 5.41563 16.4065 5.35938L11.9158 4.69688L9.90645 0.5625Z"/>
                </svg>
              ))}
            </div>
            <span className="text-gray-600 text-base">{project.projectRating}</span>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Action Buttons */}
            <div className="flex items-center content-center gap-4 flex-wrap">
              <button className="flex items-center gap-2 text-purple-600 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 17">
                  <path d="M4.8426 13.0932C4.78927 13.0932 4.73594 13.0865 4.68261 13.0798C4.28261 13.0265 3.94261 12.7732 3.77594 12.4132L2.93593 10.5665C1.6026 9.57982 0.835938 8.10651 0.835938 6.50651C0.835938 3.65984 3.3026 1.33984 6.33594 1.33984C8.47594 1.33984 10.4293 2.51317 11.3159 4.33317C11.6559 5.0065 11.8359 5.73984 11.8359 6.50651C11.8359 9.27984 9.49594 11.5532 6.57594 11.6665L5.73594 12.6799C5.50928 12.9399 5.1826 13.0932 4.8426 13.0932ZM6.33594 2.33317C3.85594 2.33317 1.83594 4.19984 1.83594 6.49984C1.83594 7.81317 2.48927 9.0265 3.6226 9.8265C3.69593 9.87983 3.75593 9.94649 3.78927 10.0265L4.68261 11.9932C4.71594 12.0665 4.78261 12.0865 4.81594 12.0865C4.84927 12.0932 4.91594 12.0865 4.96261 12.0332L5.94927 10.8465C6.0426 10.7332 6.18261 10.6665 6.33594 10.6665C8.81594 10.6665 10.8359 8.79984 10.8359 6.49984C10.8359 5.89317 10.6959 5.31315 10.4226 4.77315C9.70261 3.28649 8.09594 2.33317 6.33594 2.33317Z"/>
                </svg>
                View Past Chat
              </button>
              <button className="flex items-center gap-2 text-purple-600 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 17">
                  <path d="M12.19 15.6673H3.80338C1.53671 15.6673 1.41671 14.4207 1.31671 13.414L1.05004 10.074C0.990045 9.42732 1.17671 8.78065 1.59004 8.26065C2.08338 7.66065 2.78338 7.33398 3.53671 7.33398H12.4567C13.1967 7.33398 13.8967 7.66065 14.37 8.22732L14.4834 8.38065C14.8434 8.87398 15.0034 9.47398 14.9434 10.0807L14.6767 13.4073C14.5767 14.4207 14.4567 15.6673 12.19 15.6673ZM3.53671 8.33398C3.09004 8.33398 2.66338 8.53398 2.38338 8.88065L2.33671 8.92732C2.12338 9.20065 2.01004 9.58732 2.05004 9.98732L2.31671 13.3273C2.41004 14.3007 2.45004 14.6673 3.80338 14.6673H12.19C13.55 14.6673 13.5834 14.3007 13.6767 13.3207L13.9434 9.98065C13.9834 9.58732 13.87 9.19398 13.61 8.88732L13.5434 8.80732C13.2434 8.49398 12.8634 8.33398 12.45 8.33398H3.53671Z"/>
                </svg>
                Download All Files
              </button>
              {project.id === 'p3' && (
                <button className="flex items-center gap-2 text-purple-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 17">
                    <path d="M11.776 15.6142C11.4227 15.6142 10.9694 15.5009 10.4027 15.1675L8.40935 13.9875C8.20268 13.8675 7.80268 13.8675 7.60268 13.9875L5.60268 15.1675C4.42268 15.8675 3.72935 15.5875 3.41602 15.3609C3.10935 15.1342 2.62935 14.5542 2.94268 13.2209L3.41602 11.1742C3.46935 10.9609 3.36268 10.5942 3.20268 10.4342L1.54935 8.78086C0.722683 7.95419 0.789349 7.24753 0.902683 6.90086C1.01602 6.55419 1.37602 5.94086 2.52268 5.74753L4.64935 5.39419C4.84935 5.36086 5.13602 5.14753 5.22268 4.96753L6.40268 2.61419C6.93602 1.54086 7.63602 1.38086 8.00268 1.38086C8.36935 1.38086 9.06935 1.54086 9.60268 2.61419L10.776 4.96086C10.8694 5.14086 11.156 5.35419 11.356 5.38753L13.4827 5.74086C14.636 5.93419 14.996 6.54753 15.1027 6.89419C15.2094 7.24086 15.276 7.94753 14.456 8.77419L12.8027 10.4342C12.6427 10.5942 12.5427 10.9542 12.5894 11.1742L13.0627 13.2209C13.3694 14.5542 12.896 15.1342 12.5894 15.3609C12.4227 15.4809 12.156 15.6142 11.776 15.6142ZM8.00268 12.8942C8.32935 12.8942 8.65602 12.9742 8.91602 13.1275L10.9094 14.3075C11.4894 14.6542 11.856 14.6542 11.996 14.5542C12.136 14.4542 12.236 14.1009 12.0894 13.4475L11.616 11.4009C11.4894 10.8475 11.696 10.1342 12.096 9.72753L13.7494 8.07419C14.076 7.74753 14.2227 7.42753 14.156 7.20753C14.0827 6.98753 13.776 6.80753 13.3227 6.73419L11.196 6.38086C10.6827 6.29419 10.1227 5.88086 9.88935 5.41419L8.71602 3.06753C8.50268 2.64086 8.23602 2.38753 8.00268 2.38753C7.76935 2.38753 7.50268 2.64086 7.29602 3.06753L6.11602 5.41419C5.88268 5.88086 5.32268 6.29419 4.80935 6.38086L2.68935 6.73419C2.23602 6.80753 1.92935 6.98753 1.85602 7.20753C1.78268 7.42753 1.93602 7.75419 2.26268 8.07419L3.91602 9.72753C4.31602 10.1275 4.52268 10.8475 4.39602 11.4009L3.92268 13.4475C3.76935 14.1075 3.87602 14.4542 4.01602 14.5542C4.15602 14.6542 4.51602 14.6475 5.10268 14.3075L7.09602 13.1275C7.34935 12.9742 7.67602 12.8942 8.00268 12.8942Z"/>
                  </svg>
                  Write Additional Review
                </button>
              )}
            </div>

            {/* Delivered Files */}
            <div className="flex flex-col items-start gap-3.5 self-stretch">
              <h5 className="text-gray-600 text-sm font-medium">Delivered Files</h5>
              <div className="flex items-start content-start gap-3.5 self-stretch flex-wrap">
                {project.deliveredFiles.map((_, index) => (
                  <div key={index} className="w-[230px] h-24 rounded-md bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-5" fill="white" viewBox="0 0 24 20">
                      <path d="M11.999 3.125C9.45215 3.125 7.3584 4.28125 5.75293 5.76953C4.24902 7.16797 3.20996 8.82812 2.67871 10C3.20996 11.1719 4.24902 12.832 5.74902 14.2305C7.3584 15.7187 9.45215 16.875 11.999 16.875C14.5459 16.875 16.6396 15.7187 18.2451 14.2305C19.749 12.832 20.7881 11.1719 21.3193 10C20.7881 8.82812 19.749 7.16797 18.249 5.76953C16.6396 4.28125 14.5459 3.125 11.999 3.125ZM4.47559 4.39844C6.31543 2.6875 8.84277 1.25 11.999 1.25C15.1553 1.25 17.6826 2.6875 19.5225 4.39844C21.3506 6.09766 22.5732 8.125 23.1553 9.51953C23.2842 9.82812 23.2842 10.1719 23.1553 10.4805C22.5732 11.875 21.3506 13.9062 19.5225 15.6016C17.6826 17.3125 15.1553 18.75 11.999 18.75C8.84277 18.75 6.31543 17.3125 4.47559 15.6016C2.64746 13.9062 1.4248 11.875 0.84668 10.4805C0.717773 10.1719 0.717773 9.82812 0.84668 9.51953C1.4248 8.125 2.64746 6.09375 4.47559 4.39844ZM11.999 13.125C13.7256 13.125 15.124 11.7266 15.124 10C15.124 8.27344 13.7256 6.875 11.999 6.875C11.9717 6.875 11.9482 6.875 11.9209 6.875C11.9717 7.07422 11.999 7.28516 11.999 7.5C11.999 8.87891 10.8779 10 9.49902 10C9.28418 10 9.07324 9.97266 8.87402 9.92188C8.87402 9.94922 8.87402 9.97266 8.87402 10C8.87402 11.7266 10.2725 13.125 11.999 13.125ZM11.999 5C13.3251 5 14.5969 5.52678 15.5346 6.46447C16.4722 7.40215 16.999 8.67392 16.999 10C16.999 11.3261 16.4722 12.5979 15.5346 13.5355C14.5969 14.4732 13.3251 15 11.999 15C10.6729 15 9.40117 14.4732 8.46349 13.5355C7.52581 12.5979 6.99902 11.3261 6.99902 10C6.99902 8.67392 7.52581 7.40215 8.46349 6.46447C9.40117 5.52678 10.6729 5 11.999 5Z"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* User Review */}
            {project.userReview && (
              <div className="flex flex-col items-start gap-5 self-stretch">
                <h5 className="text-gray-600 text-sm font-medium">Your Review</h5>
                <p className="text-black text-xs self-stretch">{project.userReview}</p>
              </div>
            )}
          </>
        )}

        {/* Toggle Details Button */}
        <div className="flex justify-center items-center content-center gap-1 self-stretch flex-wrap">
          <button
            onClick={() => onToggleExpand(project.id)}
            className="flex justify-center items-center gap-2 text-purple-600 text-sm font-medium"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 21 21">
              <path d={isExpanded
                ? "M9.9527 5.8973C10.4873 5.36843 11.3555 5.36843 11.8901 5.8973L20.1017 14.0207C20.6363 14.5496 20.6363 15.4085 20.1017 15.9373C19.567 16.4662 18.6988 16.4662 18.1642 15.9373L10.9193 8.77011L3.6743 15.9331C3.1397 16.462 2.2715 16.462 1.73689 15.9331C1.20229 15.4042 1.20229 14.5454 1.73689 14.0165L9.94843 5.89307L9.9527 5.8973Z"
                : "M9.9527 15.9367C10.4873 16.4656 11.3555 16.4656 11.8901 15.9367L20.1017 7.81327C20.6363 7.2844 20.6363 6.42552 20.1017 5.89665C19.567 5.36778 18.6988 5.36778 18.1642 5.89665L10.9193 13.0639L3.6743 5.90088C3.1397 5.37201 2.2715 5.37201 1.73689 5.90088C1.20229 6.42975 1.20229 7.28863 1.73689 7.8175L9.94843 15.9409L9.9527 15.9367Z"
              } fill="#5F42A1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export const BrowseFreelancers = () => {
  // const navigate = useNavigate() // Unused for now
  const [activeTab, setActiveTab] = useState<'discover' | 'saved' | 'previously'>('discover')
  const [activeFilters, setActiveFilters] = useState({
    services: ['Ad Banner', 'Short Video Ad', 'Branding'],
    ratings: ['4 Stars & above'],
    recommended: []
  })
  const [filterStates, setFilterStates] = useState({
    services: true,
    ratings: true,
    recommended: false
  })
  // const [previouslyWorkedFilters, setPreviouslyWorkedFilters] = useState({
  //   sortBy: 'Most Recent',
  //   projectType: 'All',
  //   dateRange: 'All Time'
  // }) // Unused for now
  const [expandedProjects, setExpandedProjects] = useState<string[]>(['p1', 'p3'])

  const handleTabChange = (tab: 'discover' | 'saved' | 'previously') => {
    setActiveTab(tab)
    if (tab === 'saved' || tab === 'previously') {
      // Reset filters for saved and previously worked tabs
      setActiveFilters({ services: [], ratings: [], recommended: [] })
      setFilterStates({ services: false, ratings: false, recommended: false })
    } else {
      // Restore filters for discover tab
      setActiveFilters({
        services: ['Ad Banner', 'Short Video Ad', 'Branding'],
        ratings: ['4 Stars & above'],
        recommended: []
      })
      setFilterStates({ services: true, ratings: true, recommended: false })
    }
  }

  return (
    <div className="flex flex-col items-start gap-8 w-full max-w-[1045px] mx-auto p-11">
      {/* Header */}
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <div className="flex justify-between items-center content-center gap-5 self-stretch flex-wrap">
          <h1 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-tight tracking-tight">
            {activeTab === 'previously' ? 'Explore Freelancers' : 'Browse Freelancers'}
          </h1>
          <div className="flex w-full sm:w-[216px] flex-col items-start gap-2.5">
            <div className="flex h-9 px-3 py-[14px] flex-col justify-center items-start gap-2.5 self-stretch rounded-lg border border-gray-300 bg-white">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 13L17 17M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" stroke="#8D8D8D"/>
                </svg>
                <span className="text-gray-400 text-sm leading-[21px]">Search services</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-2.5 flex-col items-start gap-2.5">
          <div className="flex justify-center items-center self-stretch rounded-[10px] bg-white">
            <div className="flex flex-col justify-center items-center relative">
              <button
                onClick={() => handleTabChange('discover')}
                className={`flex h-14 px-5 justify-center items-center gap-3 ${
                  activeTab === 'discover' ? 'text-purple-600' : 'text-gray-600'
                }`}
              >
                <span className={`text-center text-lg leading-[27px] ${
                  activeTab === 'discover' ? 'font-bold' : 'font-medium'
                }`}>Discover</span>
              </button>
              {activeTab === 'discover' && (
                <div className="flex w-[121px] h-1 px-3 justify-center items-center gap-2 border-b-2 border-purple-600"></div>
              )}
            </div>
            <div className="flex flex-col justify-center items-center relative">
              <button
                onClick={() => handleTabChange('saved')}
                className={`flex h-14 px-5 justify-center items-center gap-3 ${
                  activeTab === 'saved' ? 'text-purple-600' : 'text-gray-600'
                }`}
              >
                <span className={`text-center text-lg leading-[27px] ${
                  activeTab === 'saved' ? 'font-bold' : 'font-medium'
                }`}>Saved</span>
              </button>
              {activeTab === 'saved' && (
                <div className="flex w-[98px] h-1 px-3 justify-center items-center gap-2 border-b-2 border-purple-600"></div>
              )}
            </div>
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={() => handleTabChange('previously')}
                className={`flex h-14 px-5 justify-center items-center gap-3 ${
                  activeTab === 'previously' ? 'text-purple-600' : 'text-gray-600'
                }`}
              >
                <span className={`text-center text-lg leading-[27px] ${
                  activeTab === 'previously' ? 'font-bold' : 'font-medium'
                }`}>Previously worked</span>
              </button>
              {activeTab === 'previously' && (
                <div className="flex w-full h-1 px-3 justify-center items-center gap-2 border-b-2 border-purple-600"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex px-8 py-4 flex-col items-start gap-5 self-stretch rounded border-0 border-gray-200 bg-white">
        <div className="flex flex-col items-start gap-5 self-stretch">
          {/* Filter Buttons Row */}
          <div className="flex items-center content-center gap-1 self-stretch flex-wrap">
            <div className="flex items-center content-center gap-2 flex-1 flex-wrap">
              {/* Services Filter */}
              <button
                onClick={() => setFilterStates(prev => ({ ...prev, services: !prev.services }))}
                className={`flex h-9 px-3 py-2 items-center gap-1 rounded-lg ${
                  filterStates.services
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex pr-1 justify-center items-center gap-2.5">
                  <span className="text-sm leading-[21px]">Services</span>
                </div>
                {filterStates.services && activeFilters.services.length > 0 && (
                  <div className="flex w-5 h-5 px-1 flex-col justify-center items-center gap-2.5 rounded-[13px] bg-gray-100">
                    <span className="text-[#10B981] text-center text-xs font-semibold leading-none">
                      {activeFilters.services.length}
                    </span>
                  </div>
                )}
                <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 8L10.5 12.5L15 8" stroke={filterStates.services ? "white" : "#9D9D9D"} strokeWidth="1.5"/>
                </svg>
              </button>

              {/* Ratings Filter */}
              <button
                onClick={() => setFilterStates(prev => ({ ...prev, ratings: !prev.ratings }))}
                className={`flex h-9 px-3 py-2 items-center gap-3 rounded-lg ${
                  filterStates.ratings
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex justify-center items-center gap-2.5">
                  <span className="text-sm leading-[21px]">Ratings</span>
                </div>
                <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 8L10.5 12.5L15 8" stroke={filterStates.ratings ? "white" : "#9D9D9D"} strokeWidth="1.5"/>
                </svg>
              </button>

              {/* Recommended Filter */}
              <button
                onClick={() => setFilterStates(prev => ({ ...prev, recommended: !prev.recommended }))}
                className={`flex h-9 px-3 py-2 items-center gap-3 rounded-lg ${
                  filterStates.recommended
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex justify-center items-center gap-2.5">
                  <span className="text-sm leading-[21px]">Recommended</span>
                </div>
                <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 8L10.5 12.5L15 8" stroke={filterStates.recommended ? "white" : "#9D9D9D"} strokeWidth="1.5"/>
                </svg>
              </button>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setActiveFilters({ services: [], ratings: [], recommended: [] })
                  setFilterStates({ services: false, ratings: false, recommended: false })
                }}
                className="flex px-5 py-2 justify-center items-center gap-2 rounded-xl hover:bg-gray-50"
              >
                <span className="text-black text-base font-medium leading-6">Clear Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Tags Row - Only show on discover tab */}
          {activeTab === 'discover' && (
            <div className="flex items-start content-start gap-2 self-stretch flex-wrap">
              {activeFilters.services.map((service) => (
                <div key={service} className="flex h-6 px-3 py-2 items-center gap-2 rounded-xl border border-[#14A155] bg-white">
                  <span className="text-gray-700 text-xs leading-none">{service}</span>
                  <button
                    onClick={() => setActiveFilters(prev => ({
                      ...prev,
                      services: prev.services.filter(s => s !== service)
                    }))}
                  >
                    <svg className="w-3.5 h-3.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3.5 3.5L10.5 10.5M3.5 10.5L10.5 3.5" stroke="black" strokeOpacity="0.4" strokeWidth="1.3125"/>
                    </svg>
                  </button>
                </div>
              ))}
              {activeFilters.ratings.map((rating) => (
                <div key={rating} className="flex h-6 px-3 py-2 items-center gap-2 rounded-xl border border-[#14A155] bg-white">
                  <span className="text-gray-700 text-xs leading-none">{rating}</span>
                  <button
                    onClick={() => setActiveFilters(prev => ({
                      ...prev,
                      ratings: prev.ratings.filter(r => r !== rating)
                    }))}
                  >
                    <svg className="w-3.5 h-3.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3.5 3.5L10.5 10.5M3.5 10.5L10.5 3.5" stroke="black" strokeOpacity="0.4" strokeWidth="1.3125"/>
                    </svg>
                  </button>
                </div>
              ))}
              {activeFilters.recommended.map((item) => (
                <div key={item} className="flex h-6 px-3 py-2 items-center gap-2 rounded-xl border border-[#14A155] bg-white">
                  <span className="text-gray-700 text-xs leading-none">{item}</span>
                  <button
                    onClick={() => setActiveFilters(prev => ({
                      ...prev,
                      recommended: prev.recommended.filter(i => i !== item)
                    }))}
                  >
                    <svg className="w-3.5 h-3.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3.5 3.5L10.5 10.5M3.5 10.5L10.5 3.5" stroke="black" strokeOpacity="0.4" strokeWidth="1.3125"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'discover' && (
        <div className="flex flex-col items-start gap-15 self-stretch">
          <div className="flex px-8 py-6 flex-col items-start gap-6 self-stretch rounded-xl border-0 border-gray-200 bg-white shadow-sm">
            <div className="flex justify-end items-center content-center gap-4 self-stretch flex-wrap">
              <h2 className="min-w-[188px] flex-1 text-gray-800 font-bold text-2xl leading-[34px] tracking-tight">
                Recommended for you
              </h2>
              <NavigationArrows />
            </div>

            <div className="flex items-center gap-6 overflow-x-auto pb-4">
              {mockFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))}
            </div>
          </div>

          {/* Discover Talent Section */}
          <div className="flex px-8 py-6 flex-col items-start gap-6 self-stretch rounded-xl border-0 border-gray-200 bg-white shadow-sm">
            <div className="flex justify-end items-center content-center gap-4 self-stretch flex-wrap">
              <h2 className="min-w-[188px] flex-1 text-gray-800 font-bold text-2xl leading-[34px] tracking-tight">
                Discover Talent
              </h2>
            </div>

            <div className="flex flex-col items-start gap-9 self-stretch">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {discoverTalentFreelancers.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="flex flex-col items-start gap-15 self-stretch">
          <div className="flex px-8 py-6 flex-col items-start gap-6 self-stretch rounded-xl border-0 border-gray-200 bg-white shadow-sm">
            <div className="flex justify-end items-center content-center gap-4 self-stretch flex-wrap">
              <h2 className="min-w-[188px] flex-1 text-gray-800 font-bold text-2xl leading-[34px] tracking-tight">
                Saved Freelancer Profiles (5)
              </h2>
            </div>

            <div className="flex flex-col items-start gap-9 self-stretch">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {savedFreelancers.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'previously' && (
        <div className="flex flex-col items-start gap-8 self-stretch">
          {/* Previously Worked Header and Filters */}
          <div className="flex flex-col items-start gap-8 self-stretch">
            <h2 className="text-gray-900 font-bold text-3xl leading-tight tracking-tight">
              Previously Worked
            </h2>

            {/* Filter Options */}
            <div className="flex items-center content-center gap-3.5 self-stretch flex-wrap">
              <div className="flex px-3 py-2 items-center gap-3 rounded-lg border border-gray-300">
                <span className="text-gray-700 text-sm">Sort by: Most Recent</span>
                <svg className="w-5 h-5" fill="none" stroke="#3A404A" strokeWidth="1.5" viewBox="0 0 20 21">
                  <path d="M6 8.5L10.5 13L15 8.5"/>
                </svg>
              </div>
              <div className="flex px-3 py-2 items-center gap-3 rounded-lg border border-gray-300">
                <span className="text-gray-700 text-sm">Project Type: All</span>
                <svg className="w-5 h-5" fill="none" stroke="#3A404A" strokeWidth="1.5" viewBox="0 0 20 21">
                  <path d="M6 8.5L10.5 13L15 8.5"/>
                </svg>
              </div>
              <div className="flex px-3 py-2 items-center gap-3 rounded-lg border border-gray-300">
                <span className="text-gray-700 text-sm">Date Range: All Time</span>
                <svg className="w-5 h-5" fill="none" stroke="#3A404A" strokeWidth="1.5" viewBox="0 0 20 21">
                  <path d="M6 8.5L10.5 13L15 8.5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Project List */}
          <div className="flex flex-col items-start gap-7 self-stretch">
            {previouslyWorkedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={expandedProjects.includes(project.id)}
                onToggleExpand={(id) => {
                  setExpandedProjects(prev =>
                    prev.includes(id)
                      ? prev.filter(p => p !== id)
                      : [...prev, id]
                  )
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

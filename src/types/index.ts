// Centralized type definitions

export type UserRole = 'super_admin' | 'moderator' | 'client' | 'freelancer'
export type AuthPage = 'login' | 'reset-password' | 'check-email'
export type JobStatus = 'Open' | 'In Progress' | 'Completed' | 'Flagged'
export type UserStatus = 'Active' | 'Pending' | 'Suspended'
export type UserType = 'Freelancer' | 'Client'
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded'

export interface User {
  id: string
  name: string
  email: string
  userType: UserType
  status: UserStatus
  rating: number
  joinedDate: string
  avatar: string
  disputes?: Dispute[]
  flags?: Flag[]
  firstName?: string
  lastName?: string
  phone?: string
  businessType?: string
  country?: string
  city?: string
  timezone?: string
  language?: string
}

export interface Job {
  id: string
  title: string
  client: string
  status: JobStatus
  price: string
  postedDate: string
  flags?: Flag[]
  alerts?: Alert[]
  freelancer?: string
  category?: string
  description?: string
  skills?: string[]
  timeline?: {
    posted: string
    deadline: string
    completed?: string
  }
}

export interface Flag {
  type: string
  reason: string
  flaggedBy: string
  flaggedDate: string
}

export interface Alert {
  type: 'warning' | 'info' | 'error'
  text: string
}

export interface Dispute {
  type: string
  count: number
  status: string
}

export interface FreelancerData {
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

export interface ProfileData {
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

export interface PortfolioItem {
  id: string
  title: string
  category: string
  image?: string
}

export interface TestimonialData {
  id: string
  rating: number
  text: string
  authorName: string
  authorTitle: string
  authorImage?: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  reviewerName: string
  reviewerAvatar?: string
  jobTitle: string
  completedDate: string
  helpful?: number
}

export interface ProjectHistory {
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

export interface DashboardMetrics {
  activeUsers: number
  activeUsersTrend: number
  openJobs: number
  openJobsTrend: number
  revenue: number
  revenueTrend: number
  activeDisputes: number
  activeDisputesTrend: number
}

export interface ActionItem {
  id: string
  type: 'pending-payouts' | 'refund-requests' | 'payment-disputes' | 'payment-discrepancies'
  count: number
  description: string
}

export interface ChartData {
  labels: string[]
  data: number[]
}

export interface RecentActivity {
  id: string
  title: string
  subtitle: string
  timestamp: string
}

export interface MetricTrend {
  value: string
  isPositive: boolean
}

export interface FilterOption {
  label: string
  value: string
}

export interface Payment {
  id: string
  amount: string
  status: PaymentStatus
  date: string
  job: string
}

export interface ChatMessage {
  id: string
  company: string
  message: string
  date: string
  hasUnread?: boolean
}

export interface BusinessType {
  id: string
  label: string
  selected: boolean
}

export interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  businessType: string;
  country: string;
  city: string;
  timezone: string;
  language: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newFreelancerProposals: boolean;
  jobStatusUpdates: boolean;
  newMessageAlertsWeb: boolean;
  newMessageAlertsEmail: boolean;
  messageReadReceipts: boolean;
  platformUpdates: boolean;
  promotionsOffers: boolean;
  pushNotifications: boolean;
  desktopNotifications: boolean;
  mobilePushNotifications: boolean;
  notificationFrequency: "realtime" | "daily" | "weekly";
  quietHoursEnabled: boolean;
  quietHoursWeekends: boolean;
  quietHoursFrom: string;
  quietHoursTo: string;
  notificationSound: "on" | "off";
}

export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "paypal";
  display: string;
  details: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "completed" | "processed" | "pending";
}

export interface Device {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet";
  browser: string;
  location: string;
  lastLogin: string;
  isCurrentDevice: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  suspiciousLoginDetection: boolean;
  loginNotifications: boolean;
  rememberDevices: boolean;
  sessionTimeout: boolean;
  sessionTimeoutValue: string;
}
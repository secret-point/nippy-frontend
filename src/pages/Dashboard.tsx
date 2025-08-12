import { useEffect, useState } from 'react'
import { MetricCard } from '../components/MetricCard'
import { Chart } from '../components/Chart'
import { RecentActivity } from '../components/RecentActivity'
import { dashboardAPI } from '../services/dashboardApi'
import { DashboardMetrics, ChartData, RecentActivity as ActivityData } from '../types'

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [jobsData, setJobsData] = useState<ChartData | null>(null)
  const [revenueData, setRevenueData] = useState<ChartData | null>(null)
  const [recentSignups, setRecentSignups] = useState<ActivityData[]>([])
  const [recentJobs, setRecentJobs] = useState<ActivityData[]>([])
  const [recentDisputes, setRecentDisputes] = useState<ActivityData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [metricsData, jobsChart, revenueChart, signups, jobs, disputes] = await Promise.all([
          dashboardAPI.getMetrics(),
          dashboardAPI.getJobsPostedChart(),
          dashboardAPI.getRevenueChart(),
          dashboardAPI.getRecentSignups(),
          dashboardAPI.getRecentJobs(),
          dashboardAPI.getRecentDisputes()
        ])

        setMetrics(metricsData)
        setJobsData(jobsChart)
        setRevenueData(revenueChart)
        setRecentSignups(signups)
        setRecentJobs(jobs)
        setRecentDisputes(disputes)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading || !metrics || !jobsData || !revenueData) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-black mb-2">Dashboard Overview</h1>
          <p className="text-lg text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  const dashboardMetrics = [
    {
      title: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      trend: { value: `${metrics.activeUsersTrend}%`, isPositive: metrics.activeUsersTrend > 0 },
      icon: (
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.75 1.33337C4.785 1.33337 3.1875 2.75337 3.1875 4.50004C3.1875 6.21337 4.695 7.60004 6.66 7.66004C6.72 7.65337 6.78 7.65337 6.825 7.66004C6.84 7.66004 6.8475 7.66004 6.8625 7.66004C6.87 7.66004 6.87 7.66004 6.8775 7.66004C8.7975 7.60004 10.305 6.21337 10.3125 4.50004C10.3125 2.75337 8.715 1.33337 6.75 1.33337Z" fill="currentColor"/>
          <path d="M10.5602 9.4333C8.46771 8.1933 5.05521 8.1933 2.94771 9.4333C1.99521 9.99996 1.47021 10.7666 1.47021 11.5866C1.47021 12.4066 1.99521 13.1666 2.94021 13.7266C3.99021 14.3533 5.37021 14.6666 6.75021 14.6666C8.13021 14.6666 9.51021 14.3533 10.5602 13.7266C11.5052 13.16 12.0302 12.4 12.0302 11.5733C12.0227 10.7533 11.5052 9.9933 10.5602 9.4333Z" fill="currentColor"/>
          <path d="M14.9925 4.89332C15.1125 6.18665 14.0775 7.31999 12.645 7.47332C12.6375 7.47332 12.6375 7.47332 12.63 7.47332H12.6075C12.5625 7.47332 12.5175 7.47332 12.48 7.48665C11.7525 7.51998 11.085 7.31332 10.5825 6.93332C11.355 6.31998 11.7975 5.39999 11.7075 4.39999C11.655 3.85998 11.445 3.36665 11.63 2.94665C11.915 2.81999 12.245 2.73999 12.5825 2.71332C13.5525 2.59999 14.865 3.57332 14.9925 4.89332Z" fill="currentColor"/>
          <path d="M16.4927 11.0601C16.4327 11.7067 15.9677 12.2667 15.1877 12.6467C14.4377 13.0134 13.4927 13.1867 12.5552 13.1667C13.0952 12.7334 13.4102 12.1934 13.4702 11.6201C13.5452 10.7934 13.1027 10.0001 12.2177 9.36673C11.7152 9.01339 11.1302 8.73339 10.4927 8.52673C12.1502 8.10006 14.2352 8.38673 15.5177 9.30673C16.2077 9.80006 17.0602 10.4201 16.4927 11.0601Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Open Jobs',
      value: metrics.openJobs.toLocaleString(),
      trend: { value: `${metrics.openJobsTrend}%`, isPositive: metrics.openJobsTrend > 0 },
      icon: (
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.46875 1.5H11.5312C11.6859 1.5 11.8125 1.6125 11.8125 1.75V3H6.1875V1.75C6.1875 1.6125 6.31406 1.5 6.46875 1.5ZM4.5 1.75V3H2.25C1.00898 3 0 3.89687 0 5V8H6.75H11.25H18V5C18 3.89687 16.991 3 15.75 3H13.5V1.75C13.5 0.784375 12.6176 0 11.5312 0H6.46875C5.38242 0 4.5 0.784375 4.5 1.75ZM18 9H11.25V10C11.25 10.5531 10.7473 11 10.125 11H7.875C7.25273 11 6.75 10.5531 6.75 10V9H0V13C0 14.1031 1.00898 15 2.25 15H15.75C16.991 15 18 14.1031 18 13V9Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Revenue (MTD)',
      value: `$${metrics.revenue.toLocaleString()}`,
      trend: { value: `${metrics.revenueTrend}%`, isPositive: metrics.revenueTrend > 0 },
      icon: (
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2C0.896875 2 0 2.76875 0 3.71429V4.57143H18V3.71429C18 2.76875 17.1031 2 16 2H2ZM18 7.14286H0V12.2857C0 13.2312 0.896875 14 2 14H16C17.1031 14 18 13.2312 18 12.2857V7.14286ZM3.5 10.5714H5.5C5.775 10.5714 6 10.7643 6 11C6 11.2357 5.775 11.4286 5.5 11.4286H3.5C3.225 11.4286 3 11.2357 3 11C3 10.7643 3.225 10.5714 3.5 10.5714ZM7 11C7 10.7643 7.225 10.5714 7.5 10.5714H11.5C11.775 10.5714 12 10.7643 12 11C12 11.2357 11.775 11.4286 11.5 11.4286H7.5C7.225 11.4286 7 11.2357 7 11Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Active Disputes',
      value: metrics.activeDisputes.toString(),
      trend: { value: `${Math.abs(metrics.activeDisputesTrend)}%`, isPositive: metrics.activeDisputesTrend > 0 },
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.25 5.25H9.75V10.5H8.25V5.25ZM8.25 11.25H9.75V12.75H8.25V11.25Z" fill="currentColor"/>
          <path d="M16.2803 5.46975L12.5303 1.71975C12.4607 1.64997 12.3781 1.59463 12.2871 1.55691C12.1961 1.5192 12.0985 1.49986 12 1.5H6C5.90149 1.49986 5.80393 1.5192 5.71293 1.55691C5.62192 1.59463 5.53928 1.64997 5.46975 1.71975L1.71975 5.46975C1.64997 5.53928 1.59463 5.62192 1.55691 5.71293C1.5192 5.80393 1.49986 5.90149 1.5 6V12C1.5 12.1995 1.57875 12.39 1.71975 12.5303L5.46975 16.2803C5.53928 16.35 5.62192 16.4054 5.71293 16.4431C5.80393 16.4808 5.90149 16.5001 6 16.5H12C12.1995 16.5 12.39 16.4213 12.5303 16.2803L16.2803 12.5303C16.35 12.4607 16.4054 12.3781 16.4431 12.2871C16.4808 12.1961 16.5001 12.0985 16.5 12V6C16.5001 5.90149 16.4808 5.80393 16.4431 5.71293C16.4054 5.62192 16.35 5.53928 16.2803 5.46975ZM15 11.6895L11.6895 15H6.3105L3 11.6895V6.3105L6.3105 3H11.6895L15 6.3105V11.6895Z" fill="currentColor"/>
        </svg>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">Dashboard Overview</h1>
        <p className="text-lg text-gray-600">Platform statistics and key metrics</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Action Required */}
      {/* <ActionRequired /> */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart 
          title="Jobs Posted (This Week)" 
          data={jobsData.data}
        />
        <Chart 
          title="Revenue (This Week)" 
          data={revenueData.data}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity 
          title="Recent Signups" 
          iconType="user"
          items={recentSignups.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            icon: <UserIcon />
          }))}
        />
        <RecentActivity 
          title="Recent Jobs" 
          iconType="job"
          items={recentJobs.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            icon: <JobIcon />
          }))}
        />
        <RecentActivity 
          title="Recent Disputes" 
          iconType="dispute"
          items={recentDisputes.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            icon: <JobIcon />
          }))}
        />
      </div>
    </div>
  )
}

// Icon components
const UserIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM9 16.2C5.336 16.2 2.4 13.264 2.4 9.6C2.4 8.064 3.264 6.768 4.5 5.904V7.2H5.4V5.904C6.636 6.768 7.5 8.064 7.5 9.6C7.5 11.136 6.636 12.432 5.4 13.296V12H4.5V13.296C3.264 12.432 2.4 11.136 2.4 9.6C2.4 5.336 5.336 2.4 9 2.4C12.664 2.4 15.6 5.336 15.6 9.6C15.6 13.264 12.664 16.2 9 16.2ZM9 4.5C7.61929 4.5 6.5 5.61929 6.5 7C6.5 8.38071 7.61929 9.5 9 9.5C10.3807 9.5 11.5 8.38071 11.5 7C11.5 5.61929 10.3807 4.5 9 4.5Z" fill="currentColor"/>
  </svg>
)

const JobIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM9 16.2C5.336 16.2 2.4 13.264 2.4 9.6C2.4 8.064 3.264 6.768 4.5 5.904V7.2H5.4V5.904C6.636 6.768 7.5 8.064 7.5 9.6C7.5 11.136 6.636 12.432 5.4 13.296V12H4.5V13.296C3.264 12.432 2.4 11.136 2.4 9.6C2.4 5.336 5.336 2.4 9 2.4C12.664 2.4 15.6 5.336 15.6 9.6C15.6 13.264 12.664 16.2 9 16.2ZM9 4.5C7.61929 4.5 6.5 5.61929 6.5 7C6.5 8.38071 7.61929 9.5 9 9.5C10.3807 9.5 11.5 8.38071 11.5 7C11.5 5.61929 10.3807 4.5 9 4.5Z" fill="currentColor"/>
  </svg>
)

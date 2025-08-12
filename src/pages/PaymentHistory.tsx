import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { paymentAPI, Payment, PaymentStats } from '../services/paymentAPI'

interface PaymentRecord {
  id: string
  freelancer: {
    name: string
    role: string
    avatar?: string
  }
  amount: string
  date: string
  status: 'Paid' | 'Pending' | 'Refunded'
}

interface PaymentHistoryState {
  payments: Payment[]
  stats: PaymentStats | null
  loading: boolean
  error: string | null
}

export const PaymentHistory: React.FC = () => {
  const navigate = useNavigate()
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // API state
  const [state, setState] = useState<PaymentHistoryState>({
    payments: [],
    stats: null,
    loading: true,
    error: null
  })

  const statusOptions = ['All', 'Paid', 'Pending', 'Refunded']

  // Load payment data
  useEffect(() => {
    loadPaymentData()
  }, [])

  const loadPaymentData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const [paymentsResponse, statsResponse] = await Promise.all([
        paymentAPI.getPayments(),
        paymentAPI.getPaymentStats()
      ])
      
      setState(prev => ({
        ...prev,
        payments: paymentsResponse.payments,
        stats: statsResponse,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load payment data. Please try again.',
        loading: false
      }))
    }
  }

  // Convert Payment to PaymentRecord for table display
  const convertPaymentToRecord = (payment: Payment): PaymentRecord => ({
    id: payment.id,
    freelancer: {
      name: payment.client?.firstName && payment.client?.lastName 
        ? `${payment.client.firstName} ${payment.client.lastName}` 
        : payment.client?.email || 'Unknown',
      role: payment.description || payment.order?.id || 'No Project',
      avatar: undefined // No avatar in Payment interface
    },
    amount: `$${payment.amount.toFixed(2)}`,
    date: new Date(payment.createdAt).toLocaleDateString(),
    status: payment.status === 'completed' ? 'Paid' : 
            payment.status === 'pending' ? 'Pending' : 
            payment.status === 'refunded' ? 'Refunded' : 'Pending'
  })

  const getFilteredPayments = () => {
    return state.payments
      .map(convertPaymentToRecord)
      .filter(payment => {
        const matchesStatus = selectedStatus === 'All' || payment.status === selectedStatus
        const matchesSearch = !searchQuery || 
          payment.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.amount.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
      })
  }

  const handleExport = () => {
    const filteredPayments = getFilteredPayments()
    const csvData = filteredPayments.map(payment => ({
      'Freelancer': payment.freelancer.name,
      'Project': payment.freelancer.role,
      'Amount': payment.amount,
      'Status': payment.status,
      'Date': payment.date
    }))
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Refunded':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'Pending':
        return (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M6 1V6L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      case 'Refunded':
        return (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M9 6H3M3 6L6 3M3 6L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return null
    }
  }

  const filteredPayments = getFilteredPayments()
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{state.error}</p>
          </div>
          <button 
            onClick={loadPaymentData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600">Track and manage all your payments and transactions</p>
      </div>

      {/* Statistics Cards */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${state.stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                <p className="text-2xl font-bold text-gray-900">${state.stats.totalPayouts.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refunds</p>
                <p className="text-2xl font-bold text-gray-900">${state.stats.totalRefunds.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 14.5h2.5A2.5 2.5 0 0021 16V8a2.5 2.5 0 00-2.5-2.5H16" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">${state.stats.pendingPayments.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M13.125 10.3125V15.625H2.5V10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.8125 4.375V13.125L5.9375 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.8125 13.125L9.6875 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 15.625V10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export CSV
            </button>
            
            <button 
              onClick={() => navigate('/add-payment-method')}
              className="flex items-center gap-3 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 21" fill="none">
                <path d="M15 11.125H5C4.65833 11.125 4.375 10.8417 4.375 10.5C4.375 10.1583 4.65833 9.875 5 9.875H15C15.3417 9.875 15.625 10.1583 15.625 10.5C15.625 10.8417 15.3417 11.125 15 11.125Z" fill="white"/>
                <path d="M10 16.125C9.65833 16.125 9.375 15.8417 9.375 15.5V5.5C9.375 5.15833 9.65833 4.875 10 4.875C10.3417 4.875 10.625 5.15833 10.625 5.5V15.5C10.625 15.8417 10.3417 16.125 10 16.125Z" fill="white"/>
              </svg>
              Add Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {paginatedPayments.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No payments found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Freelancer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {payment.freelancer.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={payment.freelancer.avatar} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-600">
                                  {payment.freelancer.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{payment.freelancer.name}</div>
                            <div className="text-sm text-gray-500">{payment.freelancer.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-purple-600 hover:text-purple-900">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredPayments.length)}</span> of{' '}
                        <span className="font-medium">{filteredPayments.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1
                          const isCurrentPage = page === currentPage
                          
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                isCurrentPage
                                  ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-5 h-5 text-purple-600 mt-0.5">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M18.125 10C18.125 7.84512 17.269 5.77849 15.7452 4.25476C14.2215 2.73102 12.1549 1.875 10 1.875C7.84512 1.875 5.77849 2.73102 4.25476 4.25476C2.73102 5.77849 1.875 7.84512 1.875 10C1.875 12.1549 2.73102 14.2215 4.25476 15.7452C5.77849 17.269 7.84512 18.125 10 18.125C12.1549 18.125 14.2215 17.269 15.7452 15.7452C17.269 14.2215 18.125 12.1549 18.125 10Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Need help with payments?
            </h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about payments, refunds, or invoices, our support team is ready to assist you.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M11.332 15.1666H4.66537C1.72536 15.1666 0.832031 14.2733 0.832031 11.3333V4.66665C0.832031 1.72665 1.72536 0.833313 4.66537 0.833313H5.66537C6.83203 0.833313 7.1987 1.21331 7.66537 1.83331L8.66537 3.16665C8.88537 3.45998 8.9187 3.49998 9.33203 3.49998H11.332C14.272 3.49998 15.1654 4.39331 15.1654 7.33331V11.3333C15.1654 14.2733 14.272 15.1666 11.332 15.1666Z" fill="currentColor"/>
                </svg>
                Payment FAQs
              </button>
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M5.33203 14.8799C5.14537 14.8799 4.95202 14.8333 4.77869 14.74C4.39869 14.54 4.16537 14.1399 4.16537 13.7133V12.7667C2.15203 12.56 0.832031 11.0799 0.832031 8.95994V4.95998C0.832031 2.66665 2.37203 1.12665 4.66537 1.12665H11.332C13.6254 1.12665 15.1654 2.66665 15.1654 4.95998V8.95994C15.1654 11.2533 13.6254 12.7933 11.332 12.7933H8.81869L5.97868 14.6867C5.78535 14.8133 5.5587 14.8799 5.33203 14.8799Z" fill="currentColor"/>
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

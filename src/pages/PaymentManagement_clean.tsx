import React, { useState, useEffect, useRef } from 'react'

// TypeScript interfaces for payment data
interface PaymentStats {
  totalRevenue: number;
  totalPayouts: number;
  totalRefunds: number;
  pendingPayments: number;
}

interface Transaction {
  id: string;
  type: string;
  user: string;
  amount: string;
  status: string;
  date: string;
  description?: string;
  flags?: string[];
  disputeText?: string;
}

interface PaymentManagementState {
  transactions: Transaction[];
  stats: PaymentStats | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    type: string;
    dateFrom: string;
    dateTo: string;
    page: number;
    limit: number;
  };
}

// Create Payment Modal Component
const CreatePaymentModal = ({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
    currency: 'USD',
    method: 'stripe',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({
      orderId: '',
      amount: '',
      currency: 'USD',
      method: 'stripe',
      description: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create New Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <input
              type="text"
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Create Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [state, setState] = useState<PaymentManagementState>({
    transactions: [],
    stats: null,
    loading: true,
    error: null,
    filters: {
      status: '',
      type: '',
      dateFrom: '',
      dateTo: '',
      page: 1,
      limit: 20
    }
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Mock data for initial display
  const mockStats: PaymentStats = {
    totalRevenue: 125840.50,
    totalPayouts: 98234.20,
    totalRefunds: 3250.75,
    pendingPayments: 12
  };

  const mockTransactions: Transaction[] = [
    {
      id: '#PAY-001',
      type: 'Payment',
      user: 'John Doe',
      amount: '$2,500.00',
      status: 'Completed',
      date: '2024-01-15',
      description: 'Website development project'
    },
    {
      id: '#REF-002',
      type: 'Refund',
      user: 'Sarah Wilson',
      amount: '$850.00',
      status: 'Pending',
      date: '2024-01-14',
      description: 'Project cancellation refund',
      flags: ['Flagged']
    },
    {
      id: '#PAY-003',
      type: 'Payment',
      user: 'Mike Johnson',
      amount: '$1,200.00',
      status: 'Failed',
      date: '2024-01-13',
      description: 'Mobile app development',
      disputeText: 'Payment method declined'
    }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Load data on component mount
  useEffect(() => {
    loadPaymentData()
  }, [])

  const loadPaymentData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // Simulate API call with delay
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          transactions: mockTransactions,
          stats: mockStats,
          loading: false
        }))
      }, 1000)
    } catch (error) {
      console.error('Error loading payment data:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to load payment data. Please try again.',
        loading: false
      }))
    }
  }

  const tabs = [
    { id: 'all', label: 'All Transactions' },
    { id: 'payments', label: 'Payments' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'commissions', label: 'Commissions' },
    { id: 'flagged', label: 'Flagged' }
  ]

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case 'payments':
        return state.transactions.filter(t => t.type === 'Payment')
      case 'refunds':
        return state.transactions.filter(t => t.type === 'Refund')
      case 'commissions':
        return state.transactions.filter(t => t.type === 'Commission')
      case 'flagged':
        return state.transactions.filter(t => t.flags?.includes('Flagged'))
      default:
        return state.transactions
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50'
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'Failed':
        return 'text-red-600 bg-red-50'
      case 'Flagged':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Payment':
        return 'text-blue-600 bg-blue-50'
      case 'Refund':
        return 'text-red-600 bg-red-50'
      case 'Commission':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const handleAction = async (action: string, transactionId: string) => {
    try {
      console.log(`Performing action: ${action} on transaction: ${transactionId}`)
      
      // Simulate API calls
      switch (action) {
        case 'approve':
          alert(`Payment ${transactionId} approved successfully`)
          break
        case 'reject':
          alert(`Payment ${transactionId} rejected`)
          break
        case 'refund':
          alert(`Refund initiated for ${transactionId}`)
          break
        case 'simulate_success':
          alert(`Payment ${transactionId} simulation successful`)
          break
        case 'simulate_failure':
          alert(`Payment ${transactionId} simulation failed`)
          break
      }
      
      setShowActionMenu(null)
      loadPaymentData() // Reload data
    } catch (error) {
      console.error('Error performing action:', error)
      alert('Failed to perform action. Please try again.')
    }
  }

  const handleCreatePayment = async (paymentData: any) => {
    try {
      console.log('Creating payment:', paymentData)
      alert('Payment created successfully!')
      setShowCreateModal(false)
      loadPaymentData()
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('Failed to create payment. Please try again.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (state.loading && state.transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading payment data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Track and manage all financial transactions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Payment
          </button>
          <button
            onClick={loadPaymentData}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(state.stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(state.stats.totalPayouts)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 14v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Refunds</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(state.stats.totalRefunds)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{state.stats.pendingPayments}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{state.error}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.id !== 'all' && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {getFilteredTransactions().length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
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
              {getFilteredTransactions().map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                    {transaction.description && (
                      <div className="text-sm text-gray-500">{transaction.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                      {transaction.flags?.map((_, index) => (
                        <span key={index} className="ml-1 text-red-600">🚩</span>
                      ))}
                    </span>
                    {transaction.disputeText && (
                      <div className="text-xs text-red-600 mt-1">{transaction.disputeText}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === transaction.id ? null : transaction.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {showActionMenu === transaction.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            {transaction.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleAction('approve', transaction.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Approve Payment
                                </button>
                                <button
                                  onClick={() => handleAction('reject', transaction.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Reject Payment
                                </button>
                                <button
                                  onClick={() => handleAction('simulate_success', transaction.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                                >
                                  Simulate Success
                                </button>
                                <button
                                  onClick={() => handleAction('simulate_failure', transaction.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                >
                                  Simulate Failure
                                </button>
                              </>
                            )}
                            {transaction.status === 'Completed' && transaction.type === 'Payment' && (
                              <button
                                onClick={() => handleAction('refund', transaction.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                              >
                                Process Refund
                              </button>
                            )}
                            <button
                              onClick={() => window.open(`/payment/${transaction.id}`, '_blank')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {getFilteredTransactions().length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M28 16a4 4 0 11-8 0 4 4 0 018 0zM24 20a9 9 0 00-9 9v.5M32 20a9 9 0 019 9v.5" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
              <p className="mt-1 text-sm text-gray-500">No transactions found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Payment Modal */}
      <CreatePaymentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePayment}
      />
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { paymentAPI, Payment, PaymentStats } from '../services/paymentAPI'

// Payment Method Modal Component
// const AddPaymentMethodModal = ({ onClose, onSuccess }: {
//   onClose: () => void
//   onSuccess: () => void
// }) => {
//   const [step, setStep] = useState(1)
//   const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'paypal'>('card')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
  
//   const [cardData, setCardData] = useState({
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     cardholderName: '',
//     billingAddress: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: 'US'
//     }
//   })

//   const handleSubmit = async () => {
//     setLoading(true)
//     setError(null)
    
//     try {
//       // Simulate API call to add payment method
//       await new Promise(resolve => setTimeout(resolve, 2000))
      
//       // In real implementation, you would call your payment service
//       // await paymentAPI.addPaymentMethod({ type: paymentMethod, data: ... })
      
//       onSuccess()
//     } catch (err) {
//       setError('Failed to add payment method. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatCardNumber = (value: string) => {
//     // Remove all non-digit characters
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
//     // Add spaces every 4 digits
//     const matches = v.match(/\d{4,16}/g)
//     const match = (matches && matches[0]) || ''
//     const parts = []
    
//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4))
//     }
    
//     if (parts.length) {
//       return parts.join(' ')
//     } else {
//       return v
//     }
//   }

//   const formatExpiryDate = (value: string) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
//     if (v.length >= 2) {
//       return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '')
//     }
//     return v
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-900">Add Payment Method</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Progress Steps */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center space-x-4">
//             <div className={`flex items-center ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
//                 step >= 1 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
//               }`}>
//                 1
//               </div>
//               <span className="ml-2 font-medium">Choose Method</span>
//             </div>
//             <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
//             <div className={`flex items-center ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
//                 step >= 2 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
//               }`}>
//                 2
//               </div>
//               <span className="ml-2 font-medium">Enter Details</span>
//             </div>
//             <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
//             <div className={`flex items-center ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
//                 step >= 3 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
//               }`}>
//                 3
//               </div>
//               <span className="ml-2 font-medium">Confirm</span>
//             </div>
//           </div>
//         </div>

//         {/* Step 1: Choose Payment Method */}
//         {step === 1 && (
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Select your preferred payment method</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Credit/Debit Card */}
//               <div
//                 onClick={() => setPaymentMethod('card')}
//                 className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
//                   paymentMethod === 'card' 
//                     ? 'border-purple-600 bg-purple-50' 
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
//                     paymentMethod === 'card' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
//                   }`}>
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                         d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                     </svg>
//                   </div>
//                   <h4 className="font-medium text-gray-900 mb-1">Credit/Debit Card</h4>
//                   <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
//                 </div>
//                 {paymentMethod === 'card' && (
//                   <div className="absolute top-2 right-2">
//                     <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 )}
//               </div>

//               {/* Bank Account */}
//               <div
//                 onClick={() => setPaymentMethod('bank')}
//                 className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
//                   paymentMethod === 'bank' 
//                     ? 'border-purple-600 bg-purple-50' 
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
//                     paymentMethod === 'bank' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
//                   }`}>
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                         d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                   </div>
//                   <h4 className="font-medium text-gray-900 mb-1">Bank Account</h4>
//                   <p className="text-sm text-gray-500">Direct bank transfer (ACH)</p>
//                 </div>
//                 {paymentMethod === 'bank' && (
//                   <div className="absolute top-2 right-2">
//                     <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 )}
//               </div>

//               {/* PayPal */}
//               <div
//                 onClick={() => setPaymentMethod('paypal')}
//                 className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
//                   paymentMethod === 'paypal' 
//                     ? 'border-purple-600 bg-purple-50' 
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
//                     paymentMethod === 'paypal' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
//                   }`}>
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//                   <h4 className="font-medium text-gray-900 mb-1">PayPal</h4>
//                   <p className="text-sm text-gray-500">Pay with your PayPal account</p>
//                 </div>
//                 {paymentMethod === 'paypal' && (
//                   <div className="absolute top-2 right-2">
//                     <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 2: Enter Details */}
//         {step === 2 && paymentMethod === 'card' && (
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Card Details</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
//                 <input
//                   type="text"
//                   value={cardData.cardNumber}
//                   onChange={(e) => setCardData({...cardData, cardNumber: formatCardNumber(e.target.value)})}
//                   placeholder="1234 5678 9012 3456"
//                   maxLength={19}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//                   <input
//                     type="text"
//                     value={cardData.expiryDate}
//                     onChange={(e) => setCardData({...cardData, expiryDate: formatExpiryDate(e.target.value)})}
//                     placeholder="MM/YY"
//                     maxLength={5}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
//                   <input
//                     type="text"
//                     value={cardData.cvv}
//                     onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/[^0-9]/g, '').slice(0, 4)})}
//                     placeholder="123"
//                     maxLength={4}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
//                 <input
//                   type="text"
//                   value={cardData.cardholderName}
//                   onChange={(e) => setCardData({...cardData, cardholderName: e.target.value})}
//                   placeholder="John Doe"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>

//               <h4 className="text-lg font-medium text-gray-900 mt-6 mb-4">Billing Address</h4>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
//                 <input
//                   type="text"
//                   value={cardData.billingAddress.street}
//                   onChange={(e) => setCardData({...cardData, billingAddress: {...cardData.billingAddress, street: e.target.value}})}
//                   placeholder="123 Main Street"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                   <input
//                     type="text"
//                     value={cardData.billingAddress.city}
//                     onChange={(e) => setCardData({...cardData, billingAddress: {...cardData.billingAddress, city: e.target.value}})}
//                     placeholder="New York"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//                   <input
//                     type="text"
//                     value={cardData.billingAddress.state}
//                     onChange={(e) => setCardData({...cardData, billingAddress: {...cardData.billingAddress, state: e.target.value}})}
//                     placeholder="NY"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
//                   <input
//                     type="text"
//                     value={cardData.billingAddress.zipCode}
//                     onChange={(e) => setCardData({...cardData, billingAddress: {...cardData.billingAddress, zipCode: e.target.value}})}
//                     placeholder="10001"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                   <select
//                     value={cardData.billingAddress.country}
//                     onChange={(e) => setCardData({...cardData, billingAddress: {...cardData.billingAddress, country: e.target.value}})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   >
//                     <option value="US">United States</option>
//                     <option value="CA">Canada</option>
//                     <option value="GB">United Kingdom</option>
//                     <option value="AU">Australia</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex">
//               <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p className="text-red-700">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex items-center justify-between p-6 border-t border-gray-200">
//           <div className="flex items-center text-sm text-gray-500">
//             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//             Your payment information is secure and encrypted
//           </div>
          
//           <div className="flex gap-3">
//             {step > 1 && (
//               <button
//                 onClick={() => setStep(step - 1)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Back
//               </button>
//             )}
            
//             {step < 2 ? (
//               <button
//                 onClick={() => setStep(step + 1)}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//               >
//                 Continue
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {loading && (
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                 )}
//                 {loading ? 'Adding...' : 'Add Payment Method'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

interface PaymentRecord {
  id: string
  freelancer: {
    name: string
    role: string
    avatar?: string
  }
  job: {
    title: string
    description: string
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
  }, [selectedStatus, currentPage])

  const loadPaymentData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // Map frontend status to backend status
      const backendStatus = selectedStatus === 'All' ? undefined : 
        selectedStatus === 'Paid' ? 'completed' :
        selectedStatus === 'Pending' ? 'pending' :
        selectedStatus === 'Refunded' ? 'refunded' : undefined

      const [paymentsResponse, statsResponse] = await Promise.all([
        paymentAPI.getPayments({
          status: backendStatus,
          page: currentPage,
          limit: 10
        }),
        paymentAPI.getPaymentStats()
      ])

      setState(prev => ({
        ...prev,
        payments: paymentsResponse.payments,
        stats: statsResponse,
        loading: false
      }))
    } catch (error) {
      console.error('Error loading payment data:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to load payment data. Please try again.',
        loading: false
      }))
    }
  }

  // Convert API payment to display format
  const convertPaymentToRecord = (payment: Payment): PaymentRecord => {
    const clientName = payment.client ? 
      `${payment.client.firstName} ${payment.client.lastName}` : 
      'Unknown Client'
    
    const status = payment.status === 'completed' ? 'Paid' :
      payment.status === 'pending' ? 'Pending' :
      payment.status === 'refunded' ? 'Refunded' : 'Pending'

    return {
      id: payment.id,
      freelancer: {
        name: clientName,
        role: 'Client',
        avatar: undefined
      },
      job: {
        title: payment.description || 'Payment',
        description: `Order #${payment.orderId}`
      },
      amount: `$${payment.amount.toFixed(2)}`,
      date: new Date(payment.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      status
    }
  }

  const getFilteredPayments = (): PaymentRecord[] => {
    return state.payments
      .map(convertPaymentToRecord)
      .filter(payment => {
        if (selectedStatus !== 'All' && payment.status !== selectedStatus) {
          return false
        }
        if (searchQuery && !payment.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !payment.job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
        return true
      })
  }

  const handleExport = () => {
    const csvData = getFilteredPayments().map(payment => ({
      'Transaction ID': payment.id,
      'Client': payment.freelancer.name,
      'Description': payment.job.title,
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

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Payment History
            </h1>
            <p className="text-gray-600">
              Manage and track payments for your freelance projects section
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-purple-600 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 17" fill="none">
                <path d="M10.1723 15.3333H5.82568C2.55234 15.3333 1.15234 13.9333 1.15234 10.66V10.5733C1.15234 7.61334 2.31901 6.18667 4.93234 5.94001C5.19901 5.92001 5.45234 6.12001 5.47901 6.39334C5.50568 6.66667 5.30568 6.91334 5.02568 6.94001C2.93234 7.13334 2.15234 8.12001 2.15234 10.58V10.6667C2.15234 13.38 3.11234 14.34 5.82568 14.34H10.1723C12.8857 14.34 13.8457 13.38 13.8457 10.6667V10.58C13.8457 8.10667 13.0523 7.12001 10.919 6.94001C10.6457 6.91334 10.439 6.67334 10.4657 6.40001C10.4923 6.12667 10.7257 5.92001 11.0057 5.94667C13.659 6.17334 14.8457 7.60667 14.8457 10.5867V10.6733C14.8457 13.9333 13.4457 15.3333 10.1723 15.3333Z" fill="currentColor"/>
                <path d="M8 10.92C7.72667 10.92 7.5 10.6933 7.5 10.42V1.83333C7.5 1.55999 7.72667 1.33333 8 1.33333C8.27333 1.33333 8.5 1.55999 8.5 1.83333V10.42C8.5 10.7 8.27333 10.92 8 10.92Z" fill="currentColor"/>
                <path d="M8.0012 11.6667C7.87453 11.6667 7.74787 11.62 7.64787 11.52L5.41453 9.28666C5.2212 9.09333 5.2212 8.77333 5.41453 8.58C5.60786 8.38666 5.92786 8.38666 6.1212 8.58L8.0012 10.46L9.8812 8.58C10.0745 8.38666 10.3945 8.38666 10.5879 8.58C10.7812 8.77333 10.7812 9.09333 10.5879 9.28666L8.35453 11.52C8.25453 11.62 8.12787 11.6667 8.0012 11.6667Z" fill="currentColor"/>
              </svg>
              Export
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

      {/* Statistics Cards */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${state.stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                <p className="text-2xl font-bold text-gray-900">${state.stats.totalPayouts.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 14v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Refunds</p>
                <p className="text-2xl font-bold text-gray-900">${state.stats.totalRefunds.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
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

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Payment Status Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none">
              <path d="M16 16H0V0H16V16Z" stroke="#E5E7EB"/>
              <path d="M0.121712 1.71563C0.327962 1.27813 0.765462 1 1.24984 1H14.7498C15.2342 1 15.6717 1.27813 15.878 1.71563C16.0842 2.15313 16.0217 2.66875 15.7155 3.04375L9.99984 10.0281V14C9.99984 14.3781 9.78734 14.725 9.44671 14.8938C9.10609 15.0625 8.70296 15.0281 8.39984 14.8L6.39984 13.3C6.14671 13.1125 5.99984 12.8156 5.99984 12.5V10.0281L0.281087 3.04063C-0.0220383 2.66875 -0.0876633 2.15 0.121712 1.71563Z" fill="#6B7280"/>
            </svg>
            <span className="font-medium text-gray-900">Payment Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedStatus === status
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 w-full lg:w-80">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 17" fill="none">
              <path d="M12.7502 0.0599999V-1.5C12.7502 -1.91 12.4102 -2.25 12.0002 -2.25C11.5902 -2.25 11.2502 -1.91 11.2502 -1.5V0H4.75023V-1.5C4.75023 -1.91 4.41023 -2.25 4.00023 -2.25C3.59023 -2.25 3.25023 -1.91 3.25023 -1.5V0.0599999C0.550229 0.31 -0.759771 1.92 -0.959771 4.31C-0.979771 4.6 -0.739771 4.84 -0.459771 4.84H16.4602C16.7502 4.84 16.9902 4.59 16.9602 4.31C16.7602 1.92 15.4502 0.31 12.7502 0.0599999Z" fill="#737373"/>
              <path d="M16 6.34H0C-0.55 6.34 -1 6.79 -1 7.34V13.5C-1 16.5 0.5 18.5 4 18.5H12C15.5 18.5 17 16.5 17 13.5V7.34C17 6.79 16.55 6.34 16 6.34Z" fill="#737373"/>
            </svg>
            <span className="font-medium text-gray-900">Date Range</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-500 bg-gray-50">
              From
              <svg className="w-4 h-4 float-right mt-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M5.33203 3.83334C5.0587 3.83334 4.83203 3.60667 4.83203 3.33334V1.33334C4.83203 1.06 5.0587 0.833336 5.33203 0.833336C5.60536 0.833336 5.83203 1.06 5.83203 1.33334V3.33334C5.83203 3.60667 5.60536 3.83334 5.33203 3.83334Z" fill="#8790A0"/>
              </svg>
            </div>
            <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-500 bg-gray-50">
              To
              <svg className="w-4 h-4 float-right mt-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M5.33203 3.83334C5.0587 3.83334 4.83203 3.60667 4.83203 3.33334V1.33334C4.83203 1.06 5.0587 0.833336 5.33203 0.833336C5.60536 0.833336 5.83203 1.06 5.83203 1.33334V3.33334C5.83203 3.60667 5.60536 3.83334 5.33203 3.83334Z" fill="#8790A0"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 w-full lg:w-80">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none">
              <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" fill="#737373"/>
              <path d="M21.2986 22C21.1186 22 20.9386 21.93 20.8086 21.8L18.9486 19.94C18.6786 19.67 18.6786 19.23 18.9486 18.95C19.2186 18.68 19.6586 18.68 19.9386 18.95L21.7986 20.81C22.0686 21.08 22.0686 21.52 21.7986 21.8C21.6586 21.93 21.4786 22 21.2986 22Z" fill="#737373"/>
            </svg>
            <span className="font-medium text-gray-900">Search</span>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="none">
              <path d="M13 13L17 17M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <input
              type="text"
              placeholder="Search by freelancer or job title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

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

      {/* Loading State */}
      {state.loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading payment history...</span>
        </div>
      )}

      {/* Payment Table */}
      {!state.loading && (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-4 grid grid-cols-6 gap-4 text-sm font-medium text-gray-600">
          <div>Freelancer</div>
          <div>Job Title</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {getFilteredPayments().map((payment) => (
            <div key={payment.id} className="px-6 py-4 grid grid-cols-6 gap-4 items-center hover:bg-gray-50">
              {/* Freelancer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900">{payment.freelancer.name}</div>
                  <div className="text-sm text-gray-500">{payment.freelancer.role}</div>
                </div>
              </div>

              {/* Job */}
              <div>
                <div className="font-medium text-gray-900">{payment.job.title}</div>
                <div className="text-sm text-gray-500">{payment.job.description}</div>
              </div>

              {/* Amount */}
              <div className="font-medium text-gray-900">{payment.amount}</div>

              {/* Date */}
              <div className="text-gray-600">{payment.date}</div>

              {/* Status */}
              <div>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>

              {/* Action */}
              <div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" viewBox="0 0 24 25" fill="none">
                    <path opacity="0.4" d="M16.8 9.5H7.2C4 9.5 2 11.5 2 14.7V17.29C2 20.5 4 22.5 7.2 22.5H16.79C19.99 22.5 21.99 20.5 21.99 17.3V14.7C22 11.5 20 9.5 16.8 9.5Z" fill="currentColor"/>
                    <path d="M15.8798 12.93L12.5298 16.28C12.2398 16.57 11.7598 16.57 11.4698 16.28L8.11984 12.93C7.82984 12.64 7.82984 12.16 8.11984 11.87C8.40984 11.58 8.88984 11.58 9.17984 11.87L11.2498 13.94V3.25C11.2498 2.84 11.5898 2.5 11.9998 2.5C12.4098 2.5 12.7498 2.84 12.7498 3.25V13.94L14.8198 11.87C14.9698 11.72 15.1598 11.65 15.3498 11.65C15.5398 11.65 15.7298 11.72 15.8798 11.87C16.1798 12.16 16.1798 12.63 15.8798 12.93Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * 10 + 1, getFilteredPayments().length)} to {Math.min(currentPage * 10, getFilteredPayments().length)} of {getFilteredPayments().length} results
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 border border-gray-300 rounded ${
                currentPage === 1 ? 'text-gray-400 opacity-50 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-2 h-3" viewBox="0 0 8 12" fill="none">
                <path d="M0.469727 5.4703C0.176758 5.76327 0.176758 6.23905 0.469727 6.53202L4.96973 11.032C5.2627 11.325 5.73848 11.325 6.03145 11.032C6.32441 10.7391 6.32441 10.2633 6.03145 9.9703L2.06113 5.99999L6.0291 2.02968C6.32207 1.73671 6.32207 1.26093 6.0291 0.967957C5.73613 0.674988 5.26035 0.674988 4.96738 0.967957L0.467383 5.46796L0.469727 5.4703Z" fill="currentColor"/>
              </svg>
            </button>
            {Array.from({ length: Math.min(5, Math.ceil(getFilteredPayments().length / 10)) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-center ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(Math.min(Math.ceil(getFilteredPayments().length / 10), currentPage + 1))}
              disabled={currentPage >= Math.ceil(getFilteredPayments().length / 10)}
              className={`p-2 border border-gray-300 rounded ${
                currentPage >= Math.ceil(getFilteredPayments().length / 10) 
                  ? 'text-gray-400 opacity-50 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-2 h-3" viewBox="0 0 8 12" fill="none">
                <path d="M7.53145 5.4703C7.82441 5.76327 7.82441 6.23905 7.53145 6.53202L3.03145 11.032C2.73848 11.325 2.2627 11.325 1.96973 11.032C1.67676 10.7391 1.67676 10.2633 1.96973 9.9703L5.94004 5.99999L1.97207 2.02968C1.6791 1.73671 1.6791 1.26093 1.97207 0.967957C2.26504 0.674988 2.74082 0.674988 3.03379 0.967957L7.53379 5.46796L7.53145 5.4703Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      )}

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

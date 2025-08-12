import React, { useState } from 'react'

interface AddPaymentMethodProps {
  onClose: () => void
  onSuccess: () => void
}

interface PaymentMethodFormData {
  type: 'card' | 'bank' | 'paypal'
  card: {
    number: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    holderName: string
    billingAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  bank: {
    accountNumber: string
    routingNumber: string
    accountType: 'checking' | 'savings'
    bankName: string
    accountHolderName: string
  }
  paypal: {
    email: string
  }
}

export const AddPaymentMethod: React.FC<AddPaymentMethodProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    type: 'card',
    card: {
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      }
    },
    bank: {
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking',
      bankName: '',
      accountHolderName: ''
    },
    paypal: {
      email: ''
    }
  })

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real implementation:
      // await paymentAPI.addPaymentMethod(formData)
      
      onSuccess()
    } catch (err) {
      setError('Failed to add payment method. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    return parts.length ? parts.join(' ') : v
  }

  const updateCardData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      card: {
        ...prev.card,
        [field]: value
      }
    }))
  }

  const updateBankData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bank: {
        ...prev.bank,
        [field]: value
      }
    }))
  }

  const updatePaypalData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      paypal: {
        ...prev.paypal,
        [field]: value
      }
    }))
  }

  const validateForm = () => {
    if (formData.type === 'card') {
      return formData.card.number.replace(/\s/g, '').length >= 16 &&
             formData.card.expiryMonth &&
             formData.card.expiryYear &&
             formData.card.cvv.length >= 3 &&
             formData.card.holderName.trim() &&
             formData.card.billingAddress.street.trim() &&
             formData.card.billingAddress.city.trim() &&
             formData.card.billingAddress.zipCode.trim()
    } else if (formData.type === 'bank') {
      return formData.bank.accountNumber.trim() &&
             formData.bank.routingNumber.trim() &&
             formData.bank.bankName.trim() &&
             formData.bank.accountHolderName.trim()
    } else if (formData.type === 'paypal') {
      return formData.paypal.email.includes('@')
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Payment Method</h1>
          <p className="text-lg text-gray-600">Choose and configure your preferred payment method</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium ${
                step >= 1 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-3 font-medium">Choose Method</span>
            </div>
            <div className={`w-20 h-0.5 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium ${
                step >= 2 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-3 font-medium">Enter Details</span>
            </div>
            <div className={`w-20 h-0.5 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium ${
                step >= 3 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-3 font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Step 1: Choose Payment Method */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Credit/Debit Card */}
                <div
                  onClick={() => setFormData(prev => ({ ...prev, type: 'card' }))}
                  className={`relative border-2 rounded-xl p-8 cursor-pointer transition-all hover:shadow-md ${
                    formData.type === 'card' 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                      formData.type === 'card' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Credit/Debit Card</h3>
                    <p className="text-sm text-gray-600 mb-4">Visa, Mastercard, American Express</p>
                    <div className="flex justify-center space-x-2">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                      <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                    </div>
                  </div>
                  {formData.type === 'card' && (
                    <div className="absolute top-4 right-4">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bank Account */}
                <div
                  onClick={() => setFormData(prev => ({ ...prev, type: 'bank' }))}
                  className={`relative border-2 rounded-xl p-8 cursor-pointer transition-all hover:shadow-md ${
                    formData.type === 'bank' 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                      formData.type === 'bank' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Account</h3>
                    <p className="text-sm text-gray-600 mb-4">Direct bank transfer (ACH)</p>
                    <div className="text-xs text-gray-500">
                      <div>• Lower processing fees</div>
                      <div>• Secure & encrypted</div>
                    </div>
                  </div>
                  {formData.type === 'bank' && (
                    <div className="absolute top-4 right-4">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div
                  onClick={() => setFormData(prev => ({ ...prev, type: 'paypal' }))}
                  className={`relative border-2 rounded-xl p-8 cursor-pointer transition-all hover:shadow-md ${
                    formData.type === 'paypal' 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                      formData.type === 'paypal' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.432c-.36-.2-.77-.317-1.228-.317h-2.22a.641.641 0 0 0-.633.74l.65 4.119c.081.518.525.9 1.05.9h1.8c1.331 0 2.36-.318 3.036-1.308.426-.623.62-1.396.152-2.702z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">PayPal</h3>
                    <p className="text-sm text-gray-600 mb-4">Pay with your PayPal account</p>
                    <div className="text-xs text-gray-500">
                      <div>• Quick & easy setup</div>
                      <div>• Buyer protection</div>
                    </div>
                  </div>
                  {formData.type === 'paypal' && (
                    <div className="absolute top-4 right-4">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Enter Details */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Enter {formData.type === 'card' ? 'Card' : formData.type === 'bank' ? 'Bank Account' : 'PayPal'} Details
              </h2>
              
              {/* Card Form */}
              {formData.type === 'card' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Card Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Card Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          value={formData.card.number}
                          onChange={(e) => updateCardData('number', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                          <select
                            value={formData.card.expiryMonth}
                            onChange={(e) => updateCardData('expiryMonth', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {String(i + 1).padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                          <select
                            value={formData.card.expiryYear}
                            onChange={(e) => updateCardData('expiryYear', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">YYYY</option>
                            {Array.from({ length: 10 }, (_, i) => (
                              <option key={i} value={String(new Date().getFullYear() + i)}>
                                {new Date().getFullYear() + i}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            value={formData.card.cvv}
                            onChange={(e) => updateCardData('cvv', e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          value={formData.card.holderName}
                          onChange={(e) => updateCardData('holderName', e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          value={formData.card.billingAddress.street}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            card: {
                              ...prev.card,
                              billingAddress: { ...prev.card.billingAddress, street: e.target.value }
                            }
                          }))}
                          placeholder="123 Main Street"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={formData.card.billingAddress.city}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              card: {
                                ...prev.card,
                                billingAddress: { ...prev.card.billingAddress, city: e.target.value }
                              }
                            }))}
                            placeholder="New York"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            value={formData.card.billingAddress.state}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              card: {
                                ...prev.card,
                                billingAddress: { ...prev.card.billingAddress, state: e.target.value }
                              }
                            }))}
                            placeholder="NY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={formData.card.billingAddress.zipCode}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              card: {
                                ...prev.card,
                                billingAddress: { ...prev.card.billingAddress, zipCode: e.target.value }
                              }
                            }))}
                            placeholder="10001"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <select
                            value={formData.card.billingAddress.country}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              card: {
                                ...prev.card,
                                billingAddress: { ...prev.card.billingAddress, country: e.target.value }
                              }
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Form */}
              {formData.type === 'bank' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bank.bankName}
                      onChange={(e) => updateBankData('bankName', e.target.value)}
                      placeholder="Chase Bank"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      value={formData.bank.accountHolderName}
                      onChange={(e) => updateBankData('accountHolderName', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        value={formData.bank.accountNumber}
                        onChange={(e) => updateBankData('accountNumber', e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="1234567890"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                      <input
                        type="text"
                        value={formData.bank.routingNumber}
                        onChange={(e) => updateBankData('routingNumber', e.target.value.replace(/[^0-9]/g, '').slice(0, 9))}
                        placeholder="123456789"
                        maxLength={9}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <select
                      value={formData.bank.accountType}
                      onChange={(e) => updateBankData('accountType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                </div>
              )}

              {/* PayPal Form */}
              {formData.type === 'paypal' && (
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email</label>
                    <input
                      type="email"
                      value={formData.paypal.email}
                      onChange={(e) => updatePaypalData('email', e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      You'll be redirected to PayPal to authorize this payment method.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Payment Method</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method Summary</h3>
                
                {formData.type === 'card' && (
                  <div className="space-y-2">
                    <p><span className="font-medium">Type:</span> Credit/Debit Card</p>
                    <p><span className="font-medium">Card Number:</span> **** **** **** {formData.card.number.slice(-4)}</p>
                    <p><span className="font-medium">Cardholder:</span> {formData.card.holderName}</p>
                    <p><span className="font-medium">Expires:</span> {formData.card.expiryMonth}/{formData.card.expiryYear}</p>
                  </div>
                )}
                
                {formData.type === 'bank' && (
                  <div className="space-y-2">
                    <p><span className="font-medium">Type:</span> Bank Account</p>
                    <p><span className="font-medium">Bank:</span> {formData.bank.bankName}</p>
                    <p><span className="font-medium">Account Holder:</span> {formData.bank.accountHolderName}</p>
                    <p><span className="font-medium">Account Type:</span> {formData.bank.accountType}</p>
                    <p><span className="font-medium">Account Number:</span> ****{formData.bank.accountNumber.slice(-4)}</p>
                  </div>
                )}
                
                {formData.type === 'paypal' && (
                  <div className="space-y-2">
                    <p><span className="font-medium">Type:</span> PayPal</p>
                    <p><span className="font-medium">Email:</span> {formData.paypal.email}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Security Notice</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your payment information is encrypted and stored securely. We never store your full card details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-8 mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-8 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SSL encrypted • PCI compliant
            </div>
            
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 2 && !validateForm()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !validateForm()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Adding...' : 'Add Payment Method'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

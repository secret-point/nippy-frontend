import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HireModal } from '../components/HireModal'
import { ProjectCompletionNotification } from '../components/ProjectCompletionNotification'
import { FilePreviewModal } from '../components/FilePreviewModal'
import { PaymentDetailsPage } from '../components/PaymentDetailsPage'
import { FeedbackModal } from '../components/FeedbackModal'
import { QuickHireModal } from '../components/QuickHireModal'
import { io, Socket } from 'socket.io-client'
import { messageAPI, Conversation as ApiConversation, Message as ApiMessage } from '../services/messageAPI'

interface Message {
  id: string
  sender: 'user' | 'freelancer'
  content: string
  timestamp: string
  type: 'text' | 'file'
  file?: {
    name: string
    size: string
    type: string
  }
}

interface Conversation {
  id: string
  name: string
  projectTitle: string
  status: 'not-hired' | 'hired' | 'closed'
  lastMessage: string
  timestamp: string
  unread: boolean
  avatar?: string
}

// Real WebSocket service using Socket.IO
// class WebSocketService {
//   private socket: Socket | null = null
//   private listeners: { [key: string]: Function[] } = {}
//   private isConnected = false
//   private reconnectAttempts = 0
//   private maxReconnectAttempts = 5

//   constructor(url: string, token?: string) {
//     console.log(`Attempting to connect to WebSocket: ${url}`)
    
//     this.socket = io(url, {
//       auth: {
//         token: token || localStorage.getItem('token')
//       },
//       transports: ['websocket', 'polling']
//     })

//     this.socket.on('connect', () => {
//       this.isConnected = true
//       this.reconnectAttempts = 0
//       this.emit('open', {})
//       console.log('WebSocket connection established')
//     })

//     this.socket.on('disconnect', () => {
//       this.isConnected = false
//       this.emit('close', {})
//       console.log('WebSocket disconnected')
//     })

//     this.socket.on('connect_error', (error) => {
//       console.error('WebSocket connection error:', error)
//       this.emit('error', error)
//     })

//     // Handle real-time messages
//     this.socket.on('new_message', (data) => {
//       this.emit('message', { data: JSON.stringify({ type: 'new_message', ...data }) })
//     })

//     this.socket.on('message_sent', (data) => {
//       this.emit('message', { data: JSON.stringify({ type: 'message_sent', ...data }) })
//     })

//     this.socket.on('user_typing', (data) => {
//       this.emit('message', { data: JSON.stringify({ type: 'user_typing', ...data }) })
//     })

//     this.socket.on('status_update', (data) => {
//       this.emit('message', { data: JSON.stringify({ type: 'status_update', ...data }) })
//     })

//     this.socket.on('notification', (data) => {
//       this.emit('message', { data: JSON.stringify({ type: 'notification', ...data }) })
//     })
//   }

//   addEventListener(event: string, callback: Function) {
//     if (!this.listeners[event]) {
//       this.listeners[event] = []
//     }
//     this.listeners[event].push(callback)
//   }

//   send(data: string) {
//     if (this.socket && this.isConnected) {
//       console.log('Sending message via WebSocket:', data)
//       const parsedData = JSON.parse(data)
      
//       // Send different event types based on the message type
//       switch (parsedData.type) {
//         case 'send_message':
//           this.socket.emit('send_message', parsedData)
//           break
//         case 'freelancer_hired':
//           this.socket.emit('freelancer_hired', parsedData)
//           break
//         case 'project_completed':
//           this.socket.emit('project_completed', parsedData)
//           break
//         case 'payment_completed':
//           this.socket.emit('payment_completed', parsedData)
//           break
//         case 'revision_requested':
//           this.socket.emit('revision_requested', parsedData)
//           break
//         default:
//           this.socket.emit('message', parsedData)
//       }
//     }
//   }

//   joinConversation(conversationId: string) {
//     if (this.socket && this.isConnected) {
//       this.socket.emit('join_conversation', { conversationId })
//     }
//   }

//   leaveConversation(conversationId: string) {
//     if (this.socket && this.isConnected) {
//       this.socket.emit('leave_conversation', { conversationId })
//     }
//   }

//   close() {
//     if (this.socket) {
//       this.socket.disconnect()
//       this.isConnected = false
//       console.log('WebSocket connection closed')
//     }
//   }

//   private emit(event: string, data: any) {
//     if (this.listeners[event]) {
//       this.listeners[event].forEach(callback => callback(data))
//     }
//   }
// }

export const Messages: React.FC = () => {
  const navigate = useNavigate()
  const [activeConversation, setActiveConversation] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'closed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [notification, setNotification] = useState<string | null>(null)
  const [lastActivity, setLastActivity] = useState<Date>(new Date())
  const [isHireModalOpen, setIsHireModalOpen] = useState(false)
  const [hiredFreelancers, setHiredFreelancers] = useState<Set<string>>(new Set())
  const [projectsMarkedComplete, setProjectsMarkedComplete] = useState<Set<string>>(new Set(['alex-johnson']))
  const [approvedProjects, setApprovedProjects] = useState<Set<string>>(new Set())
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{name: string, projectName: string} | null>(null)
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [paymentCompletedProjects, setPaymentCompletedProjects] = useState<Set<string>>(new Set())
  const [conversationClosed, setConversationClosed] = useState<Set<string>>(new Set())
  const [isQuickHireModalOpen, setIsQuickHireModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // State for real data from API
  const [apiConversations, setApiConversations] = useState<ApiConversation[]>([])
  const [apiMessages, setApiMessages] = useState<ApiMessage[]>([])
  const [currentConversation, setCurrentConversation] = useState<ApiConversation | null>(null)
  console.log(hiredFreelancers, approvedProjects, currentConversation)
  // Load conversations and initialize WebSocket
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        setApiError(null)

        // Debug: Check authentication
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        console.log('🔐 Auth Debug:', {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          hasUser: !!user,
          timestamp: new Date().toISOString()
        })

        if (!token) {
          setApiError('No authentication token found. Please login first.')
          setLoading(false)
          return
        }

        // Load conversations from API
        const conversations = await messageAPI.getConversations()
        setApiConversations(conversations)

        // Set first conversation as active if none is selected and conversations exist
        if (conversations.length > 0 && !activeConversation) {
          setActiveConversation(conversations[0].id)
          setCurrentConversation(conversations[0] || null)
        }

        // Initialize WebSocket connection
        const authToken = localStorage.getItem('token')
        if (authToken && !socket) {
          const newSocket = io('ws://localhost:5000', {
            auth: { token: authToken }
          })

          // Set up connection handlers
          newSocket.on('connect', () => {
            setIsConnected(true)
            setConnectionStatus('connected')
            console.log('WebSocket connected')
          })

          newSocket.on('disconnect', () => {
            setIsConnected(false)
            setConnectionStatus('disconnected')
            console.log('WebSocket disconnected')
          })

          // Handle new messages
          newSocket.on('newMessage', (message: ApiMessage) => {
            setApiMessages(prev => [...prev, message])
            // Update last activity for the conversation
            setLastActivity(new Date())
            
            // Show notification if message is from another user
            const currentUserId = localStorage.getItem('userId')
            if (message.senderId !== currentUserId) {
              const senderName = `${message.sender?.firstName || ''} ${message.sender?.lastName || ''}`.trim()
              setNotification(`New message from ${senderName || 'Unknown'}`)
              setTimeout(() => setNotification(null), 3000)
            }
          })

          // Handle conversation updates
          newSocket.on('conversationUpdated', (conversation: ApiConversation) => {
            setApiConversations(prev => 
              prev.map(conv => conv.id === conversation.id ? conversation : conv)
            )
          })

          setSocket(newSocket)
        }

      } catch (error) {
        console.error('Failed to initialize messaging:', error)
        setApiError('Failed to load conversations. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    initializeData()

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
    }
  }, [socket, activeConversation])

  // Load messages for active conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (activeConversation) {
        try {
          const conversation = apiConversations.find(conv => conv.id === activeConversation)
          setCurrentConversation(conversation || null)

          // Mark conversation as read
          if (conversation && (conversation.unreadCount || 0) > 0) {
            await messageAPI.markAsRead(activeConversation)
            
            // Update local state
            setApiConversations(prev => 
              prev.map(conv => 
                conv.id === activeConversation 
                  ? { ...conv, unreadCount: 0 }
                  : conv
              )
            )
          }
        } catch (error) {
          console.error('Failed to load messages:', error)
          setApiError('Failed to load messages. Please try again.')
        }
      }
    }

    if (activeConversation && apiConversations.length > 0) {
      loadMessages()
    }
  }, [activeConversation, apiConversations])

  // Mock conversations data - status will be updated dynamically
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'alex-johnson',
      name: 'Alex Johnson',
      projectTitle: 'Logo Design',
      status: 'hired',
      lastMessage: "Great! I've marked the job as complete. Please let me know if you need any adjustments.",
      timestamp: '5m ago',
      unread: true
    },
    {
      id: 'sarah-williams',
      name: 'Sarah Williams',
      projectTitle: 'Logo Design',
      status: 'not-hired',
      lastMessage: "I've sent over the revised logo with the changes you requested...",
      timestamp: '2m ago',
      unread: true
    },
    {
      id: 'michael-chen',
      name: 'Michael Chen',
      projectTitle: 'Logo Design',
      status: 'hired',
      lastMessage: 'Let me know if you need any clarification on the wireframes',
      timestamp: '1h ago',
      unread: false
    },
    {
      id: 'emma-wilson',
      name: 'Emma Wilson',
      projectTitle: 'Logo Design',
      status: 'closed',
      lastMessage: 'Let me know if you need any clarification on the wireframes',
      timestamp: '3h ago',
      unread: true
    },
    {
      id: 'alex-turner',
      name: 'Alex Turner',
      projectTitle: 'Logo Design',
      status: 'closed',
      lastMessage: 'Thanks for the final files. Payment has been processed.',
      timestamp: '2d ago',
      unread: false
    },
    {
      id: 'olivia-parker',
      name: 'Olivia Parker',
      projectTitle: 'Logo Design',
      status: 'closed',
      lastMessage: 'The prototype looks amazing! When can we discuss next steps?',
      timestamp: '1d ago',
      unread: true
    }
  ])

  // Mock messages data
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'freelancer',
      content: 'I\'ve created a first draft based on your mood board. Let me know what you think!',
      timestamp: '10:34 AM',
      type: 'text'
    },
    {
      id: '2',
      sender: 'freelancer',
      content: '',
      timestamp: '10:34 AM',
      type: 'file',
      file: {
        name: 'logo_concepts_v1.pdf',
        size: '3.5 MB',
        type: 'pdf'
      }
    },
    {
      id: '3',
      sender: 'user',
      content: 'These look fantastic! I especially like concept #2. Could we refine that one with a slightly darker blue?',
      timestamp: '11:15 AM',
      type: 'text'
    },
    {
      id: '4',
      sender: 'freelancer',
      content: 'I\'ve also prepared some additional assets for the site:',
      timestamp: '10:34 AM',
      type: 'text'
    },
    {
      id: '5',
      sender: 'freelancer',
      content: 'This includes all icon sets and logo variations in different formats.',
      timestamp: '10:34 AM',
      type: 'file',
      file: {
        name: 'Banner_Final_v2.pdf',
        size: '12.8 MB • PDF File',
        type: 'pdf'
      }
    },
    {
      id: '6',
      sender: 'user',
      content: 'Thanks Sarah! I\'ll take a look at these files right away.',
      timestamp: '11:15 AM',
      type: 'text'
    },
    {
      id: '7',
      sender: 'freelancer',
      content: 'Great! I\'ve marked the job as complete. Please let me know if you need any adjustments before approving.',
      timestamp: '10:34 AM',
      type: 'text'
    }
  ])

  // Handle conversation changes with Socket.IO
  useEffect(() => {
    if (socket && isConnected && activeConversation) {
      // Join conversation room
      socket.emit('joinConversation', activeConversation)
    }
  }, [socket, activeConversation, isConnected])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getFilteredConversations = () => {
    // Use API conversations if available, otherwise fall back to mock data
    const conversationsToUse = apiConversations.length > 0 ? apiConversations.map(conv => ({
      id: conv.id,
      name: conv.otherParticipant ? 
        `${conv.otherParticipant.firstName} ${conv.otherParticipant.lastName}`.trim() : 
        'Unknown User',
      projectTitle: conv.projectTitle || 'No Project Title',
      status: conv.status,
      lastMessage: conv.lastMessage || 'No messages yet',
      timestamp: conv.timestamp || new Date(conv.updatedAt).toLocaleTimeString(),
      unread: conv.unread || (conv.unreadCount || 0) > 0,
      avatar: conv.otherParticipant?.avatar
    })) : conversations
    
    let filtered = conversationsToUse
    
    if (activeTab === 'unread') {
      filtered = filtered.filter(conv => conv.unread)
    } else if (activeTab === 'closed') {
      filtered = filtered.filter(conv => conv.status === 'closed')
    }

    if (searchQuery) {
      filtered = filtered.filter(conv => 
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const getStatusBadge = (status: Conversation['status']) => {
    switch (status) {
      case 'not-hired':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium border border-orange-300 bg-orange-50 text-orange-600">
            Not Yet Hired
          </span>
        )
      case 'hired':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium border border-green-300 bg-green-50 text-green-600">
            Hired
          </span>
        )
      case 'closed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium border border-gray-300 bg-gray-200 text-gray-600">
            Job Closed
          </span>
        )
    }
  }

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return

    try {
      // Send message via API
      const message = await messageAPI.sendMessage(activeConversation, messageInput, 'text')

      // Add message to local state immediately for better UX
      setApiMessages(prev => [...prev, message])

      // Send real-time notification via Socket.IO
      if (socket && isConnected) {
        socket.emit('sendMessage', {
          conversationId: activeConversation,
          content: messageInput,
          type: 'text'
        })
      }

      setMessageInput('')
    } catch (error) {
      console.error('Failed to send message:', error)
      setNotification('Failed to send message. Please try again.')
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleHireClick = () => {
    setIsHireModalOpen(true)
  }

  const handleHireConfirm = async () => {
    if (!activeConversation) return

    try {
      // Hire freelancer via API
      await messageAPI.hireFreelancer(activeConversation)

      // Add the current conversation to hired freelancers
      setHiredFreelancers(prev => new Set(prev).add(activeConversation))

      // Update the conversation status to hired in legacy state
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation
            ? { ...conv, status: 'hired' as const }
            : conv
        )
      )

      // Update API conversations as well
      setApiConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation
            ? { ...conv, status: 'hired' as any }
            : conv
        )
      )

      setIsHireModalOpen(false)
      setNotification('Freelancer hired successfully!')
      setTimeout(() => setNotification(null), 3000)

      // Send hiring event via Socket.IO
      if (socket && isConnected) {
        socket.emit('hireFreelancer', {
          conversationId: activeConversation,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Failed to hire freelancer:', error)
      setNotification('Failed to hire freelancer. Please try again.')
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleHireCancel = () => {
    setIsHireModalOpen(false)
  }

  const handleFileClick = (fileName: string) => {
    setSelectedFile({
      name: fileName,
      projectName: selectedConversation?.projectTitle || 'Logo Design Project'
    })
    setIsFilePreviewOpen(true)

    // Send file preview event via Socket.IO
    if (socket && isConnected) {
      socket.emit('filePreview', {
        conversationId: activeConversation,
        fileName: fileName,
        timestamp: new Date().toISOString()
      })
    }
  }

  const handlePreviewFiles = () => {
    setNotification('Opening file preview...')
    setTimeout(() => setNotification(null), 3000)

    // Send file preview event via Socket.IO
    if (socket && isConnected) {
      socket.emit('previewFiles', {
        conversationId: activeConversation,
        timestamp: new Date().toISOString()
      })
    }
  }

  const handleApproveAndPay = () => {
    setIsPaymentDetailsOpen(true)
  }

  const handlePaymentComplete = () => {
    // Add to approved projects
    setApprovedProjects(prev => new Set(prev).add(activeConversation))

    // Add to payment completed projects
    setPaymentCompletedProjects(prev => new Set(prev).add(activeConversation))

    // Close the conversation
    setConversationClosed(prev => new Set(prev).add(activeConversation))

    // Update conversation status to closed
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation
          ? { ...conv, status: 'closed' as const }
          : conv
      )
    )

    // Remove from projects marked complete (since it's now approved)
    setProjectsMarkedComplete(prev => {
      const newSet = new Set(prev)
      newSet.delete(activeConversation)
      return newSet
    })

    setIsPaymentDetailsOpen(false)
    setNotification('Payment completed successfully!')
    setTimeout(() => setNotification(null), 3000)

    // Show feedback modal after a short delay
    setTimeout(() => {
      setIsFeedbackModalOpen(true)
    }, 1000)

    // Send approval event via WebSocket
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'payment_completed',
        conversationId: activeConversation,
        timestamp: new Date().toISOString()
      }))
    }
  }

  const handleFeedbackSubmit = (feedback: any) => {
    setNotification('Thank you for your feedback!')
    setTimeout(() => setNotification(null), 3000)

    // Send feedback event via WebSocket
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'feedback_submitted',
        conversationId: activeConversation,
        feedback: feedback,
        timestamp: new Date().toISOString()
      }))
    }
  }

  const handleQuickHireClick = () => {
    setIsQuickHireModalOpen(true)
  }

  const handleQuickHireJobSelected = (jobId: string) => {
    setNotification(`Job shared with ${selectedConversation?.name}!`)
    setTimeout(() => setNotification(null), 3000)

    // Send job share event via WebSocket
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'job_shared',
        conversationId: activeConversation,
        jobId: jobId,
        timestamp: new Date().toISOString()
      }))
    }
  }

  const handleQuickHireJobCreated = (jobData: any) => {
    setNotification(`New job created and shared with ${selectedConversation?.name}!`)
    setTimeout(() => setNotification(null), 3000)

    // Send job creation event via WebSocket
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'job_created',
        conversationId: activeConversation,
        jobData: jobData,
        timestamp: new Date().toISOString()
      }))
    }
  }

  const handleViewProjectFiles = () => {
    // Navigate to project files page
    navigate('/project-files')
  }

  const handleRequestRevisions = () => {
    // Remove from projects marked complete
    setProjectsMarkedComplete(prev => {
      const newSet = new Set(prev)
      newSet.delete(activeConversation)
      return newSet
    })

    setNotification('Revision request sent to freelancer')
    setTimeout(() => setNotification(null), 3000)

    // Send revision request event via WebSocket
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'revision_requested',
        conversationId: activeConversation,
        timestamp: new Date().toISOString()
      }))
    }
  }

  const selectedConversation = conversations.find(conv => conv.id === activeConversation)
  const unreadCount = conversations.filter(conv => conv.unread).length

  return (
    <div className="flex h-screen bg-white relative">
      {/* Real-time Notification */}
      {notification && (
        <div className="absolute top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          {notification}
        </div>
      )}

      {/* Hire Modal */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={handleHireCancel}
        onConfirm={handleHireConfirm}
        freelancerName={selectedConversation?.name || ''}
        freelancerTitle={selectedConversation ? 'Social Media Specialist • 4.9 ★' : ''}
        jobTitle="Social Media Ad Campaign"
        jobId="#JB-2025-23"
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={isFilePreviewOpen}
        onClose={() => setIsFilePreviewOpen(false)}
        fileName={selectedFile?.name || ''}
        projectName={selectedFile?.projectName || ''}
      />

      {/* Payment Details Page */}
      <PaymentDetailsPage
        isOpen={isPaymentDetailsOpen}
        onClose={() => setIsPaymentDetailsOpen(false)}
        freelancerName={selectedConversation?.name || ''}
        projectName={selectedConversation?.projectTitle + ' – ' + selectedConversation?.name || 'Logo Redesign – Sarah Johnson'}
        amount="£36.50"
        invoiceNumber="INV-2023-0471"
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        freelancerName={selectedConversation?.name || ''}
        onSubmit={handleFeedbackSubmit}
      />

      {/* Quick Hire Modal */}
      <QuickHireModal
        isOpen={isQuickHireModalOpen}
        onClose={() => setIsQuickHireModalOpen(false)}
        freelancerName={selectedConversation?.name || ''}
        onJobSelected={handleQuickHireJobSelected}
        onJobCreated={handleQuickHireJobCreated}
      />

      {/* Sidebar */}
      <div className="w-[350px] border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-5">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 13l4 4m-4-4a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search services"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex bg-white rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'text-purple-600 bg-white border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                activeTab === 'unread'
                  ? 'text-purple-600 bg-white border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'closed'
                  ? 'text-purple-600 bg-white border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-600">
                {connectionStatus === 'connected' ? 'Real-time messaging active' :
                 connectionStatus === 'connecting' ? 'Connecting to server...' : 'Connection lost - Retrying...'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {lastActivity.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading conversations...</p>
              </div>
            </div>
          ) : apiError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="h-8 w-8 mx-auto mb-2 text-red-500">⚠️</div>
                <p className="text-sm text-red-600">{apiError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : getFilteredConversations().length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="h-8 w-8 mx-auto mb-2 text-gray-400">💬</div>
                <p className="text-sm text-gray-500">No conversations found</p>
              </div>
            </div>
          ) : (
            getFilteredConversations().map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeConversation === conversation.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {conversation.timestamp}
                    </span>
                    {conversation.unread && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-900">{conversation.projectTitle}</span>
                    {getStatusBadge(conversation.status)}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedConversation.name}
                      </h2>
                      {getStatusBadge(selectedConversation.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Social Media Specialist • 4.9 ★
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedConversation.status === 'not-hired' && (
                    <button
                      onClick={handleQuickHireClick}
                      className="px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Quick Hire
                    </button>
                  )}
                  <button className="px-5 py-2 bg-gray-100 text-purple-600 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    View Job
                  </button>
                  {selectedConversation.status === 'hired' && (
                    <button
                      onClick={handleViewProjectFiles}
                      className="px-5 py-2 bg-gray-100 text-purple-600 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 21">
                        <path d="M12.0241 13.25H7.85742C7.51576 13.25 7.23242 12.9667 7.23242 12.625C7.23242 12.2833 7.51576 12 7.85742 12H12.0241C12.3658 12 12.6491 12.2833 12.6491 12.625C12.6491 12.9667 12.3658 13.25 12.0241 13.25Z" fill="currentColor"/>
                        <path d="M14.166 19.4583H5.83268C2.15768 19.4583 1.04102 18.3417 1.04102 14.6667V6.33334C1.04102 2.65834 2.15768 1.54167 5.83268 1.54167H7.08268C8.54102 1.54167 8.99935 2.01667 9.58268 2.79167L10.8327 4.45834C11.1077 4.82501 11.1493 4.87501 11.666 4.87501H14.166C17.841 4.87501 18.9577 5.99167 18.9577 9.66667V14.6667C18.9577 18.3417 17.841 19.4583 14.166 19.4583ZM5.83268 2.79167C2.84935 2.79167 2.29102 3.35834 2.29102 6.33334V14.6667C2.29102 17.6417 2.84935 18.2083 5.83268 18.2083H14.166C17.1493 18.2083 17.7077 17.6417 17.7077 14.6667V9.66667C17.7077 6.69167 17.1493 6.12501 14.166 6.12501H11.666C10.5993 6.12501 10.2493 5.75834 9.83268 5.20834L8.58268 3.54167C8.14935 2.96667 8.01602 2.79167 7.08268 2.79167H5.83268Z" fill="currentColor"/>
                      </svg>
                      View Files
                    </button>
                  )}
                </div>
              </div>
              
              {selectedConversation.status === 'not-hired' && (
                <div className="mt-4">
                  <button
                    onClick={handleHireClick}
                    className="w-full bg-green-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 16">
                      <path d="M10.1062 2.6625L7.08125 5.1125C6.57812 5.51875 6.48125 6.25 6.8625 6.77187C7.26562 7.32812 8.05 7.4375 8.59062 7.01562L11.6938 4.60313C11.9125 4.43438 12.225 4.47188 12.3969 4.69063C12.5688 4.90938 12.5281 5.22188 12.3094 5.39375L11.6562 5.9L16 9.9V4H15.9781L15.8562 3.92188L13.5875 2.46875C13.1094 2.1625 12.55 2 11.9812 2C11.3 2 10.6375 2.23437 10.1062 2.6625ZM10.8188 6.55L9.20312 7.80625C8.21875 8.575 6.79063 8.375 6.05312 7.3625C5.35938 6.40938 5.53437 5.07812 6.45 4.3375L9.05 2.23438C8.6875 2.08125 8.29688 2.00312 7.9 2.00312C7.3125 2 6.74062 2.175 6.25 2.5L4 4V11H4.88125L7.7375 13.6062C8.35 14.1656 9.29688 14.1219 9.85625 13.5094C10.0281 13.3187 10.1438 13.0969 10.2031 12.8656L10.7344 13.3531C11.3438 13.9125 12.2937 13.8719 12.8531 13.2625C12.9937 13.1094 13.0969 12.9312 13.1625 12.7469C13.7688 13.1531 14.5938 13.0687 15.1031 12.5125C15.6625 11.9031 15.6219 10.9531 15.0125 10.3938L10.8188 6.55ZM0.5 4C0.225 4 0 4.225 0 4.5V11C0 11.5531 0.446875 12 1 12H2C2.55312 12 3 11.5531 3 11V4H0.5ZM1.5 10C1.63261 10 1.75979 10.0527 1.85355 10.1464C1.94732 10.2402 2 10.3674 2 10.5C2 10.6326 1.94732 10.7598 1.85355 10.8536C1.75979 10.9473 1.63261 11 1.5 11C1.36739 11 1.24021 10.9473 1.14645 10.8536C1.05268 10.7598 1 10.6326 1 10.5C1 10.3674 1.05268 10.2402 1.14645 10.1464C1.24021 10.0527 1.36739 10 1.5 10ZM17 4V11C17 11.5531 17.4469 12 18 12H19C19.5531 12 20 11.5531 20 11V4.5C20 4.225 19.775 4 19.5 4H17ZM18 10.5C18 10.3674 18.0527 10.2402 18.1464 10.1464C18.2402 10.0527 18.3674 10 18.5 10C18.6326 10 18.7598 10.0527 18.8536 10.1464C18.9473 10.2402 19 10.3674 19 10.5C19 10.6326 18.9473 10.7598 18.8536 10.8536C18.7598 10.9473 18.6326 11 18.5 11C18.3674 11 18.2402 10.9473 18.1464 10.8536C18.0527 10.7598 18 10.6326 18 10.5Z" fill="white"/>
                    </svg>
                    Hire & Start Project
                  </button>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Yesterday divider */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-white text-xs text-gray-500 rounded-full">
                    Yesterday
                  </span>
                </div>

                {/* Messages */}
                {(apiMessages.length > 0 ? apiMessages.map(message => ({
                  id: message.id,
                  sender: message.senderId === localStorage.getItem('userId') ? 'user' as const : 'freelancer' as const,
                  content: message.content,
                  timestamp: new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }),
                  type: message.type as 'text' | 'file',
                  file: message.fileData ? {
                    name: message.fileData.name,
                    size: message.fileData.size,
                    type: message.fileData.type
                  } : undefined
                })) : messages).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-2xl ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      {message.sender === 'freelancer' && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
                      )}
                      <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {message.sender === 'user' ? 'You' : selectedConversation.name}
                          </span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-orange-50 text-gray-900'
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}>
                          {message.type === 'text' ? (
                            <p className="text-sm">{message.content}</p>
                          ) : (
                            <div
                              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => handleFileClick(message.file?.name || '')}
                            >
                              <div className="w-4 h-4 text-gray-500">
                                <svg fill="currentColor" viewBox="0 0 15 21">
                                  <path d="M2.5 18.625C2.15625 18.625 1.875 18.3438 1.875 18V3C1.875 2.65625 2.15625 2.375 2.5 2.375H8.75V5.5C8.75 6.19141 9.30859 6.75 10 6.75H13.125V18C13.125 18.3438 12.8438 18.625 12.5 18.625H2.5Z"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{message.file?.name}</p>
                                <p className="text-xs text-gray-500">{message.file?.size}</p>
                              </div>
                              <button className="w-4 h-4 text-gray-400 hover:text-gray-600">
                                <svg fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8.04166 11.1682C8.12142 11.163 8.20135 11.154 8.28146 11.1529C9.22984 11.1377 10.1491 10.9486 11.0347 10.579C12.0772 10.1433 12.9853 9.49337 13.6941 8.52921C13.7809 8.41136 13.7673 8.34138 13.6886 8.23332C13.1556 7.5014 12.4965 6.94376 11.7393 6.52454C10.5386 5.85969 9.26038 5.58164 7.92038 5.60171C6.98555 5.61594 6.07747 5.78027 5.20267 6.14288C4.14707 6.58046 3.23882 7.24273 2.57054 8.26471C2.51428 8.35116 2.51497 8.40828 2.57054 8.49284C2.99371 9.13951 3.52476 9.6541 4.14622 10.0579C5.34778 10.8373 6.66067 11.1455 8.04166 11.1682Z"/>
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Today divider */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-white text-xs text-gray-500 rounded-full">
                    Today
                  </span>
                </div>

                {/* Project Completion Notification */}
                {selectedConversation && projectsMarkedComplete.has(selectedConversation.id) && !paymentCompletedProjects.has(selectedConversation.id) && (
                  <ProjectCompletionNotification
                    freelancerName={selectedConversation.name}
                    onPreviewFiles={handlePreviewFiles}
                    onApproveAndPay={handleApproveAndPay}
                    onRequestRevisions={handleRequestRevisions}
                  />
                )}

                {/* Payment Completed Notification */}
                {selectedConversation && paymentCompletedProjects.has(selectedConversation.id) && (
                  <div className="mx-auto max-w-md space-y-4">
                    <div className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="text-center text-gray-600">
                        <span className="font-medium text-gray-800">{selectedConversation.name} marked this job as complete</span>
                        <div className="text-sm text-gray-500 mt-1">June 5, 2023 • 11:35 AM</div>
                      </div>
                    </div>

                    <div className="w-75 mx-auto p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 17 16">
                          <path d="M8.5 16C10.6217 16 12.6566 15.1571 14.1569 13.6569C15.6571 12.1566 16.5 10.1217 16.5 8C16.5 5.87827 15.6571 3.84344 14.1569 2.34315C12.6566 0.842855 10.6217 0 8.5 0C6.37827 0 4.34344 0.842855 2.84315 2.34315C1.34285 3.84344 0.5 5.87827 0.5 8C0.5 10.1217 1.34285 12.1566 2.84315 13.6569C4.34344 15.1571 6.37827 16 8.5 16ZM12.0312 6.53125L8.03125 10.5312C7.7375 10.825 7.2625 10.825 6.97188 10.5312L4.97188 8.53125C4.67813 8.2375 4.67813 7.7625 4.97188 7.47188C5.26562 7.18125 5.74062 7.17813 6.03125 7.47188L7.5 8.94063L10.9688 5.46875C11.2625 5.175 11.7375 5.175 12.0281 5.46875C12.3187 5.7625 12.3219 6.2375 12.0281 6.52812L12.0312 6.53125Z"/>
                        </svg>
                        <span className="font-medium text-gray-900">Payment Completed</span>
                      </div>
                      <div className="text-center text-sm text-gray-600">
                        You paid £30.00 to {selectedConversation.name} June 5, 2023 • 1:20 PM
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Hiring Status Notice */}
            {selectedConversation.status === 'not-hired' && (
              <div className="px-6 py-3 bg-purple-50 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  {selectedConversation.name} is not yet hired for your project. Hire {selectedConversation.name.split(' ')[0]} for this job and get started.
                </p>
              </div>
            )}

            {/* Hired Success Message */}
            {selectedConversation.status === 'hired' && !conversationClosed.has(selectedConversation.id) && (
              <div className="px-6 py-3 bg-green-50 border-t border-gray-200">
                <p className="text-center text-green-700 text-sm">
                  🎉 {selectedConversation.name} has been hired for this project! You can now collaborate and share files.
                </p>
              </div>
            )}

            {/* Conversation Closed Notice */}
            {conversationClosed.has(selectedConversation.id) && (
              <div className="px-6 py-5 bg-gray-100 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <svg className="w-3.5 h-4" fill="currentColor" viewBox="0 0 14 16">
                    <path d="M4.5 4.5V6H9.5V4.5C9.5 3.11875 8.38125 2 7 2C5.61875 2 4.5 3.11875 4.5 4.5ZM2.5 6V4.5C2.5 2.01562 4.51562 0 7 0C9.48438 0 11.5 2.01562 11.5 4.5V6H12C13.1031 6 14 6.89687 14 8V14C14 15.1031 13.1031 16 12 16H2C0.896875 16 0 15.1031 0 14V8C0 6.89687 0.896875 6 2 6H2.5Z"/>
                  </svg>
                  <span className="font-medium">This conversation is closed. No further messages can be sent.</span>
                </div>
              </div>
            )}

            {/* Message Input */}
            {!conversationClosed.has(selectedConversation.id) && (
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="border border-gray-200 rounded-2xl p-3">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full resize-none outline-none text-sm text-gray-900 placeholder-gray-400 bg-transparent"
                    rows={1}
                    style={{ minHeight: '20px', maxHeight: '120px' }}
                  />
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <button className="w-4 h-4 text-gray-400 hover:text-gray-600">
                        <svg fill="currentColor" viewBox="0 0 16 16">
                          <path d="M14.5 8C14.5 6.27609 13.8152 4.62279 12.5962 3.40381C11.3772 2.18482 9.72391 1.5 8 1.5C6.27609 1.5 4.62279 2.18482 3.40381 3.40381C2.18482 4.62279 1.5 6.27609 1.5 8C1.5 9.72391 2.18482 11.3772 3.40381 12.5962C4.62279 13.8152 6.27609 14.5 8 14.5C9.72391 14.5 11.3772 13.8152 12.5962 12.5962C13.8152 11.3772 14.5 9.72391 14.5 8ZM0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8Z"/>
                        </svg>
                      </button>
                      <button className="w-4 h-4 text-gray-400 hover:text-gray-600">
                        <svg fill="currentColor" viewBox="0 0 14 16">
                          <path d="M11.3809 2.61874C10.6184 1.85624 9.38086 1.85624 8.61836 2.61874L2.86836 8.36874C1.55273 9.68436 1.55273 11.8156 2.86836 13.1312C4.18398 14.4469 6.31523 14.4469 7.63086 13.1312L12.3809 8.38124C12.7215 8.04061 13.2777 8.04061 13.6184 8.38124C13.959 8.72186 13.959 9.27811 13.6184 9.61874L8.86836 14.3687C6.86836 16.3687 3.63086 16.3687 1.63086 14.3687C-0.369141 12.3687 -0.369141 9.13124 1.63086 7.13124L7.38086 1.38124C8.82773 -0.0656372 11.1715 -0.0656372 12.6184 1.38124C14.0652 2.82811 14.0652 5.17186 12.6184 6.61874L7.11836 12.1187C6.22461 13.0125 4.77461 13.0125 3.88086 12.1187C2.98711 11.225 2.98711 9.77499 3.88086 8.88124L8.38086 4.38124C8.72148 4.04061 9.27773 4.04061 9.61836 4.38124C9.95898 4.72186 9.95898 5.27811 9.61836 5.61874L5.11836 10.1187C4.90898 10.3281 4.90898 10.6719 5.11836 10.8812C5.32773 11.0906 5.67148 11.0906 5.88086 10.8812L11.3809 5.38124C12.1434 4.61874 12.1434 3.38124 11.3809 2.61874Z"/>
                        </svg>
                      </button>
                      <button className="w-4 h-4 text-gray-400 hover:text-gray-600">
                        <svg fill="currentColor" viewBox="0 0 16 16">
                          <path d="M14 2.5C14.275 2.5 14.5 2.725 14.5 3V12.9937L14.3438 12.7906L10.0938 7.29063C9.95312 7.10625 9.73125 7 9.5 7C9.26875 7 9.05 7.10625 8.90625 7.29063L6.3125 10.6469L5.35938 9.3125C5.21875 9.11563 4.99375 9 4.75 9C4.50625 9 4.28125 9.11563 4.14062 9.31563L1.64062 12.8156L1.5 13.0094V13V3C1.5 2.725 1.725 2.5 2 2.5H14Z"/>
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!messageInput.trim() || !isConnected}
                      className="px-6 py-2 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

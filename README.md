# AWS E-commerce Platform

A modern, scalable e-commerce platform built with React, TypeScript, and Tailwind CSS.

## 🏗️ Architecture Overview

This project has been refactored to follow modern React best practices with a clean, maintainable architecture:

### 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, Modal, etc.)
│   ├── icons/           # SVG icon components
│   ├── layouts/         # Layout components
│   └── ...              # Feature-specific components
├── contexts/            # React contexts for state management
├── hooks/               # Custom React hooks
├── layouts/             # Page layout components
├── pages/               # Page components
├── services/            # API services and external integrations
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── ...
```

### 🎯 Key Features

- **Type Safety**: Full TypeScript implementation with centralized type definitions
- **Component Architecture**: Reusable, composable UI components
- **Context Management**: Clean state management with React Context
- **Custom Hooks**: Reusable logic with custom hooks
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modular Routing**: Clean, organized route structure

### 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Update .env.local with your API base URL
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Type Check**
   ```bash
   npm run type-check
   ```

### 🌐 API Integration

#### Configuration
The project uses a centralized API configuration system:

- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **HTTP Client**: Custom HTTP client with automatic token management
- **Error Handling**: Consistent error handling across all API calls
- **Type Safety**: Full TypeScript types for all API responses

#### Available API Services

```typescript
import { 
  authAPI, 
  dashboardAPI, 
  usersAPI, 
  jobsAPI, 
  freelancersAPI, 
  paymentsAPI 
} from './services'
```

**Authentication API** (`authAPI`)
- `login(email, password)` - User login
- `logout()` - User logout
- `resetPassword(email)` - Password reset
- `loginWithGoogle(token)` - Google OAuth login
- `refreshToken()` - Token refresh

**Dashboard API** (`dashboardAPI`)
- `getMetrics()` - Dashboard metrics
- `getActionItems()` - Action items requiring attention
- `getJobsPostedChart()` - Jobs posted chart data
- `getRevenueChart()` - Revenue chart data
- `getRecentSignups()` - Recent user signups
- `getRecentJobs()` - Recent job postings
- `getRecentDisputes()` - Recent disputes

**Users API** (`usersAPI`)
- `getUsers(params)` - Paginated users list
- `getUser(id)` - Single user details
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user
- `suspendUser(id, reason)` - Suspend user
- `activateUser(id)` - Activate user

**Jobs API** (`jobsAPI`)
- `getJobs(params)` - Paginated jobs list
- `getJob(id)` - Single job details
- `createJob(data)` - Create new job
- `updateJob(id, data)` - Update job
- `deleteJob(id)` - Delete job
- `flagJob(id, data)` - Flag job for review
- `takedownJob(id, reason)` - Take down job

**Freelancers API** (`freelancersAPI`)
- `getFreelancers(params)` - Browse freelancers
- `getFreelancer(id)` - Freelancer profile
- `getFreelancerReviews(id)` - Freelancer reviews

**Payments API** (`paymentsAPI`)
- `getPayments(params)` - Payment history
- `getPendingPayouts()` - Pending payouts
- `getRefundRequests()` - Refund requests
- `getPaymentDisputes()` - Payment disputes
- `processPayout(id)` - Process payout
- `processRefund(id)` - Process refund

#### Environment Variables

```bash
# Required
VITE_API_URL=http://localhost:8000/api

# Optional
VITE_APP_NAME=AWS E-commerce Platform
VITE_APP_ENV=development
```

### 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

### 📦 Component Library

#### UI Components (`/components/ui/`)

- **Button**: Configurable button with variants and loading states
- **Input**: Form input with validation and icon support
- **Card**: Container component with consistent styling
- **Modal**: Accessible modal dialog
- **LoadingSpinner**: Loading indicator with different sizes

#### Icons (`/components/icons/`)

Consistent SVG icon components with configurable props:
- DashboardIcon, UsersIcon, JobsIcon, PaymentsIcon, etc.
- StarIcon, HeartIcon, SearchIcon, FilterIcon, etc.

### 🔗 Context Providers

#### AuthContext
Manages authentication state and navigation:
```tsx
const { isAuthenticated, userRole, login, logout } = useAuth()
```

### 🪝 Custom Hooks

#### useLocalStorage
Persistent state management with localStorage:
```tsx
const [value, setValue] = useLocalStorage('key', defaultValue)
```

#### useApi
API call management with loading and error states:
```tsx
const { data, loading, error, refetch } = useApi(apiFunction)
```

### 🛠️ Utilities

- **formatCurrency**: Format numbers as currency
- **formatDate**: Format dates consistently
- **formatRelativeTime**: Human-readable relative time
- **truncateText**: Text truncation utility
- **debounce**: Function debouncing utility

### 🔐 Authentication Flow

The app uses a context-based authentication system:

1. **Login Page**: User enters credentials
2. **AuthContext**: Manages auth state globally
3. **Protected Routes**: Conditional rendering based on auth status
4. **Role-based Access**: Different UI based on user role (super_admin, moderator, client, freelancer)

### 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Consistent Design System**: Standardized colors, spacing, and typography
- **Responsive Design**: Mobile-first approach
- **Component Variants**: Configurable component styles

### 📱 Pages

#### Admin Dashboard
- Dashboard overview with metrics
- User management
- Job management
- Payment management (super admin only)
- Content moderation

#### Client Portal
- User registration flow
- Business type selection
- Profile setup

#### Freelancer Platform
- Browse freelancers
- View profiles and reviews
- Project history

### 🔄 State Management

The app uses a combination of:
- **React Context**: Global state (auth, theme)
- **Local State**: Component-specific state
- **Custom Hooks**: Reusable stateful logic

### 🧪 Error Handling

- **Error Boundaries**: Catch and handle React errors gracefully
- **API Error Handling**: Centralized error handling for API calls
- **Form Validation**: Input validation with error messaging

### 🚀 Performance Optimizations

- **Code Splitting**: Dynamic imports for route components
- **Memoization**: React.memo for expensive components
- **Debounced Inputs**: Prevent excessive API calls
- **Optimized Imports**: Tree-shaking with proper exports

### 🔮 Future Enhancements

- [ ] Add React Query for advanced data fetching
- [ ] Implement real-time features with WebSockets
- [ ] Add comprehensive testing suite
- [ ] Implement PWA features
- [ ] Add internationalization (i18n)
- [ ] Integration with actual backend APIs

### 📚 Best Practices Implemented

1. **Single Responsibility Principle**: Each component has one clear purpose
2. **DRY (Don't Repeat Yourself)**: Reusable components and utilities
3. **Consistent Naming**: Clear, descriptive names for components and functions
4. **Type Safety**: Comprehensive TypeScript usage
5. **Error Handling**: Graceful error states and user feedback
6. **Accessibility**: Semantic HTML and ARIA attributes
7. **Performance**: Optimized rendering and bundle size

### 🤝 Contributing

When adding new features:

1. **Create reusable components** in the appropriate directory
2. **Define types** in the types directory
3. **Use existing UI components** when possible
4. **Follow the established patterns** for state management
5. **Add proper error handling** and loading states
6. **Ensure responsiveness** and accessibility

This refactored codebase provides a solid foundation for a scalable, maintainable e-commerce platform with room for future growth and enhancement.

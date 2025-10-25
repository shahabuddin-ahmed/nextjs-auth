# Redux Toolkit Authentication App - Setup Guide

## Overview
This is a complete authentication app built with Next.js 16, Redux Toolkit, TypeScript, and Tailwind CSS. It integrates with a real backend API for user authentication.

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running at `http://localhost:3001`

## Installation

1. **Clone or download the project**
   \`\`\`bash
   cd auth-app
   npm install
   \`\`\`

2. **Setup Environment Variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be available at `http://localhost:3000`

## Backend API Integration

### Login Endpoint
- **URL**: `POST /api/v1/user/login`
- **Payload**: 
  \`\`\`json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  \`\`\`
- **Response**:
  \`\`\`json
  {
    "code": "SUCCESS",
    "message": "Success",
    "response": {
      "_id": "user_id",
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "accessToken": "jwt_token"
    },
    "errors": []
  }
  \`\`\`

### Signup Endpoint
- **URL**: `POST /api/v1/user/signup`
- **Payload**:
  \`\`\`json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  \`\`\`
- **Response**:
  \`\`\`json
  {
    "code": "SUCCESS",
    "message": "Success",
    "response": {
      "_id": "user_id",
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "errors": []
  }
  \`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx              # Root layout with Redux provider
│   ├── page.tsx                # Home page
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── signup/
│   │   └── page.tsx            # Signup page
│   ├── dashboard/
│   │   └── page.tsx            # Protected dashboard
│   ├── profile/
│   │   └── page.tsx            # User profile page
│   ├── providers.tsx           # Redux provider wrapper
│   └── globals.css             # Global styles
├── lib/
│   ├── store.ts                # Redux store configuration
│   ├── hooks.ts                # Typed Redux hooks
│   ├── api.ts                  # API client for backend calls
│   ├── slices/
│   │   └── authSlice.ts        # Auth reducer with async thunks
│   └── hooks/
│       └── useAuthInit.ts      # Auth initialization hook
├── components/
│   ├── login-form.tsx          # Login form component
│   ├── signup-form.tsx         # Signup form component
│   ├── logout-button.tsx       # Logout button component
│   └── auth-initializer.tsx    # Auth state initializer
├── middleware.ts               # Route protection middleware
└── .env.example                # Environment variables template
\`\`\`

## Features

### Authentication
- User registration with email and password
- User login with JWT token
- Persistent authentication using localStorage
- Automatic token restoration on app reload

### State Management
- Redux Toolkit for centralized state management
- Async thunks for API calls
- Type-safe Redux hooks
- Proper error handling and loading states

### Route Protection
- Middleware-based route protection
- Automatic redirects for unauthenticated users
- Protected dashboard and profile pages

### User Management
- View user profile information
- Edit profile details
- Logout functionality
- Session persistence

## Redux Architecture

### Auth Slice
The auth slice manages the following state:
- `user`: Current logged-in user data
- `accessToken`: JWT token from backend
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state for async operations
- `error`: Error messages

### Async Thunks
- `loginUser`: Handles user login via API
- `signupUser`: Handles user registration via API

### Actions
- `updateProfile`: Updates user profile locally
- `logout`: Clears auth state and localStorage
- `clearError`: Clears error messages
- `restoreAuth`: Restores auth from localStorage

## Usage Examples

### Login
\`\`\`typescript
const result = await dispatch(loginUser({ 
  email: "user@example.com", 
  password: "password123" 
}))
\`\`\`

### Signup
\`\`\`typescript
const result = await dispatch(signupUser({ 
  name: "John Doe",
  email: "user@example.com", 
  password: "password123" 
}))
\`\`\`

### Access Auth State
\`\`\`typescript
const { user, isAuthenticated, isLoading, error } = useAppSelector(
  (state) => state.auth
)
\`\`\`

### Dispatch Actions
\`\`\`typescript
const dispatch = useAppDispatch()
dispatch(logout())
dispatch(updateProfile({ name: "New Name" }))
\`\`\`

## Best Practices Implemented

1. **Type Safety**: Full TypeScript support with proper typing
2. **Async State Management**: Redux Toolkit's createAsyncThunk for API calls
3. **Error Handling**: Comprehensive error handling in thunks
4. **Token Persistence**: localStorage for session persistence
5. **Route Protection**: Middleware-based route protection
6. **Component Separation**: Modular component structure
7. **API Abstraction**: Centralized API client for backend calls
8. **Loading States**: Proper loading indicators during async operations

## Deployment

### To Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### To Other Platforms
1. Build the app: `npm run build`
2. Start the app: `npm start`
3. Ensure environment variables are set

## Troubleshooting

### Login/Signup fails
- Check if backend API is running at the correct URL
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check browser console for error messages

### Auth state not persisting
- Check if localStorage is enabled in browser
- Verify auth token is being stored correctly
- Check browser DevTools > Application > Local Storage

### Protected routes not working
- Ensure middleware.ts is in the root directory
- Check if auth token cookie is being set
- Verify route names in middleware config

## License
MIT

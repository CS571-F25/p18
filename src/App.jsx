import { Routes, Route, Navigate } from 'react-router-dom'
import { Component } from 'react'
import { AuthProvider, PostsProvider, ToastProvider } from './store'

import BountyFeed from './screens/BountyFeed'
import NewBounty from './screens/NewBounty'
import BountyDetail from './screens/BountyDetail'
import EditBounty from './screens/EditBounty'
import MyBounties from './screens/MyBounties'
import Register from './screens/Register'
import Login from './screens/Login'
import MapView from './screens/MapView'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Log the error for debugging
    console.error('ErrorBoundary caught error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo)
    // Log component stack for debugging
    console.error('Component stack:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected error occurred'
      const isReactError = errorMessage.includes('Minified React error')
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-6 max-w-md">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              {errorMessage}
            </p>
            {isReactError && (
              <p className="text-xs text-gray-500 mb-4">
                This is usually a routing issue. Try navigating from the home page.
              </p>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/p18/'
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <PostsProvider>
            <Routes>
              <Route path="/" element={<BountyFeed />} />
              <Route path="/bounties/new" element={<NewBounty />} />
              <Route path="/bounties/:id" element={<BountyDetail />} />
              <Route path="/bounties/:id/edit" element={<EditBounty />} />
              <Route path="/bounties/mine" element={<MyBounties />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/map" element={<MapView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PostsProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

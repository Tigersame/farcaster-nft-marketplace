/**
 * Base Mini-App Error Boundary
 * Catches and handles React errors in mini-app
 */

'use client'

import React, { Component, ReactNode } from 'react'
import { errorHandler, MiniAppError, MiniAppErrorCode } from '@/lib/miniapp/error-handler'
import { BRANDING } from '@/config/branding'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class MiniAppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error handler
    const miniAppError = new MiniAppError(
      MiniAppErrorCode.UNKNOWN_ERROR,
      error.message,
      { componentStack: errorInfo.componentStack }
    )
    errorHandler.handleError(miniAppError)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <DefaultErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the app.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Details
            </summary>
            <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Refresh App
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            Go Back
          </button>
        </div>

        {/* Branding */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          {BRANDING.name} - {BRANDING.tagline}
        </p>
      </div>
    </div>
  )
}

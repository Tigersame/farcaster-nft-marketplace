/**
 * Base Mini-App Error Handler
 * https://docs.base.org/mini-apps/quickstart/build-checklist
 * 
 * Centralized error handling for mini-app operations
 */

export enum MiniAppErrorCode {
  SDK_NOT_INITIALIZED = 'SDK_NOT_INITIALIZED',
  SDK_NOT_AVAILABLE = 'SDK_NOT_AVAILABLE',
  ACTION_FAILED = 'ACTION_FAILED',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INVALID_PARAMS = 'INVALID_PARAMS',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class MiniAppError extends Error {
  code: MiniAppErrorCode
  context?: any

  constructor(code: MiniAppErrorCode, message: string, context?: any) {
    super(message)
    this.name = 'MiniAppError'
    this.code = code
    this.context = context
  }
}

export class MiniAppErrorHandler {
  private static instance: MiniAppErrorHandler
  private errorLog: Array<{ timestamp: Date; error: MiniAppError }> = []
  private onErrorCallback?: (error: MiniAppError) => void

  private constructor() {}

  static getInstance(): MiniAppErrorHandler {
    if (!MiniAppErrorHandler.instance) {
      MiniAppErrorHandler.instance = new MiniAppErrorHandler()
    }
    return MiniAppErrorHandler.instance
  }

  /**
   * Handle an error
   */
  handleError(error: Error | MiniAppError, context?: any): void {
    const miniAppError = error instanceof MiniAppError 
      ? error 
      : new MiniAppError(
          MiniAppErrorCode.UNKNOWN_ERROR,
          error.message,
          context
        )

    // Log error
    this.errorLog.push({
      timestamp: new Date(),
      error: miniAppError
    })

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[MiniApp Error]', {
        code: miniAppError.code,
        message: miniAppError.message,
        context: miniAppError.context,
        stack: miniAppError.stack
      })
    }

    // Call error callback if registered
    if (this.onErrorCallback) {
      this.onErrorCallback(miniAppError)
    }
  }

  /**
   * Register error callback
   */
  onError(callback: (error: MiniAppError) => void): void {
    this.onErrorCallback = callback
  }

  /**
   * Get error log
   */
  getErrorLog(): Array<{ timestamp: Date; error: MiniAppError }> {
    return this.errorLog
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = []
  }

  /**
   * Create error from code
   */
  static createError(
    code: MiniAppErrorCode,
    message?: string,
    context?: any
  ): MiniAppError {
    const defaultMessages: Record<MiniAppErrorCode, string> = {
      [MiniAppErrorCode.SDK_NOT_INITIALIZED]: 'SDK not initialized',
      [MiniAppErrorCode.SDK_NOT_AVAILABLE]: 'SDK not available in this environment',
      [MiniAppErrorCode.ACTION_FAILED]: 'Action failed to execute',
      [MiniAppErrorCode.WALLET_NOT_CONNECTED]: 'Wallet not connected',
      [MiniAppErrorCode.NETWORK_ERROR]: 'Network error occurred',
      [MiniAppErrorCode.PERMISSION_DENIED]: 'Permission denied',
      [MiniAppErrorCode.INVALID_PARAMS]: 'Invalid parameters provided',
      [MiniAppErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred',
    }

    return new MiniAppError(
      code,
      message || defaultMessages[code],
      context
    )
  }
}

export const errorHandler = MiniAppErrorHandler.getInstance()

/**
 * Utility function to safely execute SDK actions with error handling
 */
export async function safeSDKAction<T>(
  action: () => Promise<T> | T,
  errorCode: MiniAppErrorCode = MiniAppErrorCode.ACTION_FAILED,
  context?: any
): Promise<{ success: boolean; data?: T; error?: MiniAppError }> {
  try {
    const data = await action()
    return { success: true, data }
  } catch (error) {
    const miniAppError = error instanceof MiniAppError
      ? error
      : MiniAppErrorHandler.createError(
          errorCode,
          error instanceof Error ? error.message : 'Unknown error',
          context
        )
    
    errorHandler.handleError(miniAppError)
    
    return { success: false, error: miniAppError }
  }
}

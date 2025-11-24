/**
 * Base Mini-App Testing Utilities
 * https://docs.base.org/mini-apps/quickstart/build-checklist
 * 
 * Utilities for testing mini-app functionality
 */

import { SDKContext } from './sdk-manager'

/**
 * Mock SDK context for testing
 */
export function createMockContext(overrides?: Partial<SDKContext>): SDKContext {
  return {
    user: {
      fid: 639734,
      username: 'testuser',
      displayName: 'Test User',
      pfpUrl: 'https://example.com/pfp.png',
      bio: 'Test bio',
      verifications: ['0x1234567890123456789012345678901234567890'],
      custody: '0x1234567890123456789012345678901234567890',
      ...overrides?.user
    },
    location: {
      type: 'feed',
      ...overrides?.location
    },
    client: {
      clientFid: 309857, // Base App
      name: 'Base',
      version: '1.0.0',
      platform: 'web',
      ...overrides?.client
    }
  }
}

/**
 * Mock SDK for testing
 */
export class MockSDK {
  private _context: SDKContext
  private _isReady = false
  private actionCalls: Array<{ action: string; params: any }> = []

  constructor(context?: SDKContext) {
    this._context = context || createMockContext()
  }

  get context(): Promise<SDKContext> {
    return Promise.resolve(this._context)
  }

  get actions() {
    return {
      ready: () => {
        this._isReady = true
        this.logAction('ready', {})
      },
      close: () => {
        this.logAction('close', {})
      },
      openUrl: (url: string) => {
        this.logAction('openUrl', { url })
      },
      composeCast: (params: any) => {
        this.logAction('composeCast', params)
      },
      addFrame: (params: any) => {
        this.logAction('addFrame', params)
      },
      swapToken: (params: any) => {
        this.logAction('swapToken', params)
      },
      sendToken: (params: any) => {
        this.logAction('sendToken', params)
      },
      viewToken: (params: any) => {
        this.logAction('viewToken', params)
      },
      haptic: (params: any) => {
        this.logAction('haptic', params)
      }
    }
  }

  isReady(): boolean {
    return this._isReady
  }

  getActionCalls(): Array<{ action: string; params: any }> {
    return this.actionCalls
  }

  clearActionCalls(): void {
    this.actionCalls = []
  }

  private logAction(action: string, params: any): void {
    this.actionCalls.push({ action, params })
  }
}

/**
 * Test environment setup
 */
export function setupTestEnvironment(): {
  mockSDK: MockSDK
  cleanup: () => void
} {
  const mockSDK = new MockSDK()
  
  // Mock window properties
  const originalUserAgent = navigator.userAgent
  Object.defineProperty(navigator, 'userAgent', {
    get: () => 'Farcaster/1.0.0',
    configurable: true
  })

  const cleanup = () => {
    Object.defineProperty(navigator, 'userAgent', {
      get: () => originalUserAgent,
      configurable: true
    })
  }

  return { mockSDK, cleanup }
}

/**
 * Simulate user interactions
 */
export const testHelpers = {
  /**
   * Simulate clicking a button
   */
  clickButton: async (buttonText: string): Promise<void> => {
    const button = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes(buttonText))
    
    if (button) {
      button.click()
      await new Promise(resolve => setTimeout(resolve, 100))
    } else {
      throw new Error(`Button "${buttonText}" not found`)
    }
  },

  /**
   * Wait for element to appear
   */
  waitForElement: async (
    selector: string,
    timeout: number = 5000
  ): Promise<Element> => {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector)
      if (element) return element
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    throw new Error(`Element "${selector}" not found within ${timeout}ms`)
  },

  /**
   * Check if in Farcaster environment
   */
  isInFarcaster: (): boolean => {
    return /farcaster|warpcast/i.test(navigator.userAgent) ||
           window.location !== window.parent.location
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()
  private measures: Array<{ name: string; duration: number }> = []

  start(label: string): void {
    this.marks.set(label, performance.now())
  }

  end(label: string): number {
    const startTime = this.marks.get(label)
    if (!startTime) {
      console.warn(`No start mark found for "${label}"`)
      return 0
    }

    const duration = performance.now() - startTime
    this.measures.push({ name: label, duration })
    this.marks.delete(label)
    
    return duration
  }

  getMeasures(): Array<{ name: string; duration: number }> {
    return this.measures
  }

  getReport(): string {
    return this.measures
      .map(m => `${m.name}: ${m.duration.toFixed(2)}ms`)
      .join('\n')
  }

  clear(): void {
    this.marks.clear()
    this.measures = []
  }
}

export const performanceMonitor = new PerformanceMonitor()

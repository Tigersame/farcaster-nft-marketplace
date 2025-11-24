/**
 * Farcaster Cast Actions
 * https://docs.farcaster.xyz/reference/actions/spec
 * 
 * Implements Cast Actions for interactive buttons in casts
 */

export interface CastAction {
  name: string
  icon: string
  description: string
  aboutUrl: string
  action: {
    type: 'post'
    postUrl: string
  }
}

export interface CastActionContext {
  action: {
    name: string
    url: string
    buttonIndex: number
  }
  cast: {
    fid: number
    hash: string
    text: string
  }
  interactor: {
    fid: number
    custody?: string
  }
}

export interface CastActionResponse {
  message: string
  type?: 'success' | 'error'
  frame?: {
    version: string
    image: string
    imageAspectRatio?: '1.91:1' | '1:1'
    buttons?: Array<{
      label: string
      action: 'post' | 'post_redirect' | 'link'
      target?: string
    }>
    input?: {
      text: string
    }
    state?: string
  }
}

/**
 * Create a Cast Action for CurSwap
 */
export function createSwapAction(): CastAction {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://curswap.com'
  
  return {
    name: 'Swap on CurSwap',
    icon: 'currency',
    description: 'Swap tokens on Base network using CurSwap',
    aboutUrl: `${baseUrl}/about`,
    action: {
      type: 'post',
      postUrl: `${baseUrl}/api/actions/swap`
    }
  }
}

/**
 * Create a Cast Action for viewing pools
 */
export function createViewPoolsAction(): CastAction {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://curswap.com'
  
  return {
    name: 'View Pools on CurSwap',
    icon: 'water',
    description: 'View liquidity pools with high APR',
    aboutUrl: `${baseUrl}/about`,
    action: {
      type: 'post',
      postUrl: `${baseUrl}/api/actions/pools`
    }
  }
}

/**
 * Create a Cast Action for viewing tokens
 */
export function createViewTokensAction(): CastAction {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://curswap.com'
  
  return {
    name: 'View Tokens on CurSwap',
    icon: 'coin',
    description: 'Browse Base chain tokens',
    aboutUrl: `${baseUrl}/about`,
    action: {
      type: 'post',
      postUrl: `${baseUrl}/api/actions/tokens`
    }
  }
}

/**
 * Handle Cast Action request
 */
export async function handleCastAction(
  context: CastActionContext
): Promise<CastActionResponse> {
  const { action, cast, interactor } = context

  try {
    // Log the interaction
    console.log('Cast Action triggered:', {
      action: action.name,
      cast: cast.hash,
      interactor: interactor.fid
    })

    // Generate response based on action
    if (action.name.includes('Swap')) {
      return {
        message: '🔄 Opening CurSwap...',
        type: 'success',
        frame: {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/defi/image`,
          imageAspectRatio: '1:1',
          buttons: [
            {
              label: '💱 Start Swapping',
              action: 'link',
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/defi`
            },
            {
              label: '📊 View Tokens',
              action: 'link',
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/defi?tab=tokens`
            }
          ]
        }
      }
    } else if (action.name.includes('Pools')) {
      return {
        message: '💧 Opening Pool Dashboard...',
        type: 'success',
        frame: {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/defi/pools/image`,
          imageAspectRatio: '1:1',
          buttons: [
            {
              label: '💎 View Pools',
              action: 'link',
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/defi?tab=pools`
            }
          ]
        }
      }
    } else if (action.name.includes('Tokens')) {
      return {
        message: '📊 Opening Token List...',
        type: 'success',
        frame: {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/defi/tokens/image`,
          imageAspectRatio: '1:1',
          buttons: [
            {
              label: '💰 Browse Tokens',
              action: 'link',
              target: `${process.env.NEXT_PUBLIC_BASE_URL}/defi?tab=tokens`
            }
          ]
        }
      }
    }

    return {
      message: 'Action completed successfully',
      type: 'success'
    }
  } catch (error) {
    console.error('Cast Action error:', error)
    return {
      message: 'Failed to execute action',
      type: 'error'
    }
  }
}

/**
 * Validate Cast Action request
 */
export function validateCastActionRequest(body: any): {
  valid: boolean
  context?: CastActionContext
  error?: string
} {
  try {
    if (!body.untrustedData) {
      return { valid: false, error: 'Missing untrustedData' }
    }

    if (!body.untrustedData.castId) {
      return { valid: false, error: 'Missing castId' }
    }

    if (!body.untrustedData.fid) {
      return { valid: false, error: 'Missing fid' }
    }

    const context: CastActionContext = {
      action: {
        name: body.action?.name || '',
        url: body.action?.url || '',
        buttonIndex: body.untrustedData.buttonIndex || 1
      },
      cast: {
        fid: body.untrustedData.castId.fid,
        hash: body.untrustedData.castId.hash,
        text: body.untrustedData.castText || ''
      },
      interactor: {
        fid: body.untrustedData.fid,
        custody: body.untrustedData.address
      }
    }

    return { valid: true, context }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid request'
    }
  }
}

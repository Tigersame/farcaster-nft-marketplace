/**
 * Farcaster Frames v2 Specification
 * https://docs.farcaster.xyz/reference/frames/spec
 * 
 * Implements the latest Frames specification
 */

export interface FrameMetadata {
  version: 'vNext'
  image: string
  imageAspectRatio?: '1.91:1' | '1:1'
  postUrl?: string
  input?: {
    text: string
  }
  buttons?: FrameButton[]
  state?: string
}

export interface FrameButton {
  label: string
  action: 'post' | 'post_redirect' | 'link' | 'mint' | 'tx'
  target?: string
  postUrl?: string
}

export interface FrameRequest {
  untrustedData: {
    fid: number
    url: string
    messageHash: string
    timestamp: number
    network: number
    buttonIndex: number
    castId?: {
      fid: number
      hash: string
    }
    inputText?: string
    state?: string
    transactionId?: string
    address?: string
  }
  trustedData: {
    messageBytes: string
  }
}

export interface FrameResponse {
  version: 'vNext'
  image: string
  imageAspectRatio?: '1.91:1' | '1:1'
  buttons?: FrameButton[]
  input?: {
    text: string
  }
  state?: string
  postUrl?: string
}

export interface TransactionFrame {
  chainId: string
  method: 'eth_sendTransaction' | 'eth_signTypedData_v4'
  params: {
    abi: any[]
    to: string
    value?: string
    data?: string
  }
}

/**
 * Generate Frame metadata for HTML
 */
export function generateFrameMetadata(frame: FrameMetadata): string {
  const tags: string[] = [
    `<meta property="fc:frame" content="${frame.version}" />`,
    `<meta property="fc:frame:image" content="${frame.image}" />`
  ]

  if (frame.imageAspectRatio) {
    tags.push(`<meta property="fc:frame:image:aspect_ratio" content="${frame.imageAspectRatio}" />`)
  }

  if (frame.postUrl) {
    tags.push(`<meta property="fc:frame:post_url" content="${frame.postUrl}" />`)
  }

  if (frame.input) {
    tags.push(`<meta property="fc:frame:input:text" content="${frame.input.text}" />`)
  }

  if (frame.buttons) {
    frame.buttons.forEach((button, index) => {
      const num = index + 1
      tags.push(`<meta property="fc:frame:button:${num}" content="${button.label}" />`)
      tags.push(`<meta property="fc:frame:button:${num}:action" content="${button.action}" />`)
      
      if (button.target) {
        tags.push(`<meta property="fc:frame:button:${num}:target" content="${button.target}" />`)
      }
      
      if (button.postUrl) {
        tags.push(`<meta property="fc:frame:button:${num}:post_url" content="${button.postUrl}" />`)
      }
    })
  }

  if (frame.state) {
    tags.push(`<meta property="fc:frame:state" content="${frame.state}" />`)
  }

  return tags.join('\n    ')
}

/**
 * Validate Frame request
 */
export function validateFrameRequest(body: any): {
  valid: boolean
  request?: FrameRequest
  error?: string
} {
  try {
    if (!body.untrustedData) {
      return { valid: false, error: 'Missing untrustedData' }
    }

    if (!body.untrustedData.fid) {
      return { valid: false, error: 'Missing fid' }
    }

    if (!body.untrustedData.buttonIndex) {
      return { valid: false, error: 'Missing buttonIndex' }
    }

    return {
      valid: true,
      request: body as FrameRequest
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid request'
    }
  }
}

/**
 * Create Frame response
 */
export function createFrameResponse(
  image: string,
  options: {
    buttons?: FrameButton[]
    input?: { text: string }
    state?: string
    postUrl?: string
    aspectRatio?: '1.91:1' | '1:1'
  } = {}
): FrameResponse {
  return {
    version: 'vNext',
    image,
    imageAspectRatio: options.aspectRatio || '1:1',
    buttons: options.buttons,
    input: options.input,
    state: options.state,
    postUrl: options.postUrl
  }
}

/**
 * Create transaction frame
 */
export function createTransactionFrame(
  chainId: number,
  to: string,
  abi: any[],
  options: {
    value?: string
    data?: string
  } = {}
): TransactionFrame {
  return {
    chainId: `eip155:${chainId}`,
    method: 'eth_sendTransaction',
    params: {
      abi,
      to,
      value: options.value,
      data: options.data
    }
  }
}

/**
 * CurSwap Frame templates
 */
export const curswapFrames = {
  /**
   * Swap frame
   */
  swap: (fromToken: string, toToken: string): FrameMetadata => ({
    version: 'vNext',
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/swap-preview?from=${fromToken}&to=${toToken}`,
    imageAspectRatio: '1:1',
    buttons: [
      {
        label: '🔄 Execute Swap',
        action: 'tx',
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/swap-tx`
      },
      {
        label: '📊 View Details',
        action: 'post',
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/swap-details`
      },
      {
        label: '🌐 Open CurSwap',
        action: 'link',
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/defi`
      }
    ],
    state: JSON.stringify({ fromToken, toToken })
  }),

  /**
   * Pool frame
   */
  pool: (poolId: string, apr: string): FrameMetadata => ({
    version: 'vNext',
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/pool-preview?id=${poolId}`,
    imageAspectRatio: '1:1',
    buttons: [
      {
        label: `💧 Add Liquidity (${apr} APR)`,
        action: 'tx',
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/pool-add-tx`
      },
      {
        label: '📈 View Stats',
        action: 'post',
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/pool-stats`
      },
      {
        label: '🌐 Open Pools',
        action: 'link',
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/defi?tab=pools`
      }
    ],
    state: JSON.stringify({ poolId })
  }),

  /**
   * Token info frame
   */
  token: (tokenAddress: string, symbol: string): FrameMetadata => ({
    version: 'vNext',
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/token-preview?address=${tokenAddress}`,
    imageAspectRatio: '1:1',
    buttons: [
      {
        label: `💱 Swap ${symbol}`,
        action: 'link',
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/defi?token=${tokenAddress}`
      },
      {
        label: '📊 Price Chart',
        action: 'post',
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frames/token-chart`
      },
      {
        label: '🔍 View on Explorer',
        action: 'link',
        target: `https://basescan.org/token/${tokenAddress}`
      }
    ],
    state: JSON.stringify({ tokenAddress, symbol })
  })
}

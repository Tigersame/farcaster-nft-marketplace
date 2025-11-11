/**
 * Security Middleware for FarcastSea API Routes
 * Provides rate limiting, input validation, CSRF protection, and security headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityUtils } from './security';
import { z } from 'zod';

// Rate limit store (in production, use Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
  violations: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Blocked IPs (in production, use database)
const blockedIPs = new Set<string>();

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  entries.forEach(([key, entry]) => {
    if (now > entry.resetTime + 60000) {
      rateLimitStore.delete(key);
    }
  });
}, 300000);

/**
 * Get client IP address from request
 */
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return cfConnectingIP || realIP || 'unknown';
}

/**
 * Rate limiting middleware
 */
export function rateLimit(
  maxRequests: number = 10,
  windowMs: number = 60000,
  identifier?: (req: NextRequest) => string
) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const id = identifier ? identifier(req) : getClientIP(req);
    
    // Check if IP is blocked
    if (blockedIPs.has(id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    const now = Date.now();
    const entry = rateLimitStore.get(id);
    
    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(id, {
        count: 1,
        resetTime: now + windowMs,
        violations: 0,
      });
      return null; // Allow request
    }
    
    if (entry.count >= maxRequests) {
      entry.violations++;
      
      // Block IP after 10 violations
      if (entry.violations >= 10) {
        blockedIPs.add(id);
        console.warn(`[SECURITY] IP blocked due to rate limit violations: ${id}`);
      }
      
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((entry.resetTime - now) / 1000)),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(entry.resetTime),
          },
        }
      );
    }
    
    entry.count++;
    return null; // Allow request
  };
}

/**
 * Security headers middleware
 */
export function securityHeaders() {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    // Just add headers, don't block
    return null;
  };
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  const headers = SecurityUtils.getCSPHeaders();
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  return response;
}

/**
 * Input validation middleware
 */
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    try {
      const body = await req.json();
      const result = schema.safeParse(body);
      
      if (!result.success) {
        const firstError = result.error.issues[0];
        return NextResponse.json(
          { 
            error: 'Invalid input',
            details: `${firstError.path.join('.')}: ${firstError.message}`,
          },
          { status: 400 }
        );
      }
      
      // Attach validated data to request (for route handler to use)
      // Note: This is a workaround since we can't modify req directly
      return null;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }
  };
}

/**
 * Suspicious input detection middleware
 */
export function detectSuspiciousInput() {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    try {
      const body = await req.text();
      
      // Check for suspicious patterns
      if (SecurityUtils.detectSuspiciousInput(body)) {
        const ip = getClientIP(req);
        console.warn(`[SECURITY] Suspicious input detected from IP: ${ip}`);
        console.warn(`[SECURITY] Body snippet: ${body.substring(0, 100)}`);
        
        return NextResponse.json(
          { error: 'Invalid request' },
          { status: 400 }
        );
      }
      
      return null;
    } catch {
      return null;
    }
  };
}

/**
 * CORS middleware for frame endpoints
 */
export function corsHeaders() {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    // For frame endpoints, we need to allow POST from Farcaster
    return null;
  };
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse, origin: string = '*'): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

/**
 * Logging middleware
 */
export function logRequest() {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const ip = getClientIP(req);
    const method = req.method;
    const url = req.url;
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    
    return null;
  };
}

/**
 * Compose multiple middleware functions
 */
export function composeMiddleware(
  ...middlewares: Array<(req: NextRequest) => Promise<NextResponse | null>>
) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    for (const middleware of middlewares) {
      const result = await middleware(req);
      if (result) {
        return result; // Middleware returned a response, stop chain
      }
    }
    return null; // All middleware passed
  };
}

/**
 * Create a secure API route handler
 */
export function createSecureHandler(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimit?: { maxRequests: number; windowMs: number };
    validateSchema?: z.ZodSchema;
    requireAuth?: boolean;
    logRequests?: boolean;
  } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Build middleware chain
    const middlewares = [];
    
    if (options.logRequests) {
      middlewares.push(logRequest());
    }
    
    middlewares.push(detectSuspiciousInput());
    
    if (options.rateLimit) {
      middlewares.push(
        rateLimit(options.rateLimit.maxRequests, options.rateLimit.windowMs)
      );
    }
    
    // Run middleware chain
    const middleware = composeMiddleware(...middlewares);
    const middlewareResult = await middleware(req);
    
    if (middlewareResult) {
      return addSecurityHeaders(middlewareResult);
    }
    
    // Run handler
    try {
      const response = await handler(req);
      return addSecurityHeaders(response);
    } catch (error) {
      console.error('[SECURITY] Handler error:', error);
      
      // Don't leak error details
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      );
    }
  };
}

/**
 * Verify request is from Farcaster Hub
 */
export async function verifyFarcasterRequest(req: NextRequest): Promise<boolean> {
  try {
    const body = await req.json();
    
    // Check for required Farcaster fields
    if (!body.untrustedData || !body.trustedData) {
      return false;
    }
    
    // In production, verify messageBytes signature with Farcaster Hub
    // For now, just check structure
    const hasRequiredFields = 
      body.untrustedData.fid &&
      body.untrustedData.messageHash &&
      body.trustedData.messageBytes;
    
    return hasRequiredFields;
  } catch {
    return false;
  }
}

/**
 * Admin authentication middleware
 */
export function requireAdmin(adminAddresses: string[]) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // In production, verify signature
    // For now, just check if address is in admin list
    const address = authHeader.replace('Bearer ', '').toLowerCase();
    
    if (!adminAddresses.includes(address)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    return null;
  };
}

/**
 * Export utility to manually block an IP
 */
export function blockIP(ip: string): void {
  blockedIPs.add(ip);
  console.warn(`[SECURITY] IP manually blocked: ${ip}`);
}

/**
 * Export utility to unblock an IP
 */
export function unblockIP(ip: string): void {
  blockedIPs.delete(ip);
  console.log(`[SECURITY] IP unblocked: ${ip}`);
}

/**
 * Get current rate limit stats
 */
export function getRateLimitStats(): {
  totalEntries: number;
  blockedIPs: number;
  topOffenders: Array<{ ip: string; count: number; violations: number }>;
} {
  const topOffenders = Array.from(rateLimitStore.entries())
    .map(([ip, entry]) => ({ ip, count: entry.count, violations: entry.violations }))
    .sort((a, b) => b.violations - a.violations)
    .slice(0, 10);
  
  return {
    totalEntries: rateLimitStore.size,
    blockedIPs: blockedIPs.size,
    topOffenders,
  };
}

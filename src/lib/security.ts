/**
 * Security Utilities for FarcastSea
 * Provides sanitization, validation, and protection against common attacks
 */

// Input Sanitization
export class SecurityUtils {
  /**
   * Sanitize string input to prevent XSS attacks
   */
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate and sanitize Ethereum address
   */
  static sanitizeAddress(address: string): string | null {
    if (!address) return null;
    
    // Remove whitespace
    const cleaned = address.trim();
    
    // Check if valid Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(cleaned)) {
      return null;
    }
    
    return cleaned.toLowerCase();
  }

  /**
   * Validate and sanitize token ID
   */
  static sanitizeTokenId(tokenId: string | number): string | null {
    const id = String(tokenId).trim();
    
    // Only allow alphanumeric and hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(id)) {
      return null;
    }
    
    return id.substring(0, 100);
  }

  /**
   * Validate and sanitize URL
   */
  static sanitizeUrl(url: string): string | null {
    if (!url) return null;
    
    try {
      const parsed = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return null;
      }
      
      return parsed.href;
    } catch {
      return null;
    }
  }

  /**
   * Validate numeric input
   */
  static sanitizeNumber(value: any, min = 0, max = Number.MAX_SAFE_INTEGER): number | null {
    const num = Number(value);
    
    if (isNaN(num) || !isFinite(num)) {
      return null;
    }
    
    if (num < min || num > max) {
      return null;
    }
    
    return num;
  }

  /**
   * Rate limiting check (simple in-memory implementation)
   */
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Validate API key format (for server-side)
   */
  static validateApiKey(key: string | undefined): boolean {
    if (!key) return false;
    
    // Check minimum length and format
    return key.length >= 32 && /^[a-zA-Z0-9_-]+$/.test(key);
  }

  /**
   * Hash sensitive data (client-safe)
   */
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify message signature (placeholder - implement with actual crypto lib)
   */
  static verifySignature(message: string, signature: string, address: string): boolean {
    // This should use ethers.js or viem to verify
    // Placeholder implementation
    return signature.length > 0 && address.length > 0;
  }

  /**
   * Sanitize JSON input
   */
  static sanitizeJSON(input: any, maxDepth = 5): any {
    if (maxDepth <= 0) return null;

    if (typeof input !== 'object' || input === null) {
      if (typeof input === 'string') {
        return this.sanitizeString(input);
      }
      return input;
    }

    if (Array.isArray(input)) {
      return input
        .slice(0, 100) // Limit array size
        .map(item => this.sanitizeJSON(item, maxDepth - 1));
    }

    const sanitized: any = {};
    const keys = Object.keys(input).slice(0, 50); // Limit object keys

    for (const key of keys) {
      const sanitizedKey = this.sanitizeString(key);
      sanitized[sanitizedKey] = this.sanitizeJSON(input[key], maxDepth - 1);
    }

    return sanitized;
  }

  /**
   * Content Security Policy headers
   */
  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.base.org https://*.walletconnect.com https://*.farcaster.xyz wss://*.walletconnect.com",
        "frame-src 'self' https://verify.walletconnect.com",
      ].join('; '),
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  /**
   * Validate Farcaster FID
   */
  static validateFID(fid: any): number | null {
    const num = this.sanitizeNumber(fid, 1, 999999999);
    return num;
  }

  /**
   * Check for suspicious patterns in input
   */
  static detectSuspiciousInput(input: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /data:text\/html/i,
      /../, // Directory traversal
      /\.\./,
      /\/etc\/passwd/,
      /\bselect\b.*\bfrom\b/i, // SQL injection
      /\bunion\b.*\bselect\b/i,
      /\bdrop\b.*\btable\b/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate IPFS CID
   */
  static validateIPFSCID(cid: string): boolean {
    if (!cid) return false;
    
    // Basic CID validation (CIDv0 or CIDv1)
    const cidV0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    const cidV1Pattern = /^[a-z0-9]{59}$/;
    
    return cidV0Pattern.test(cid) || cidV1Pattern.test(cid);
  }
}

// Middleware helper for API routes
export function withSecurityHeaders(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const response = await handler(req, ...args);
    
    if (response instanceof Response) {
      const headers = new Headers(response.headers);
      
      Object.entries(SecurityUtils.getCSPHeaders()).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    
    return response;
  };
}

// Rate limiting decorator for API routes
export function withRateLimit(maxRequests = 10, windowMs = 60000) {
  return function(handler: Function) {
    return async (req: Request, ...args: any[]) => {
      const ip = req.headers.get('x-forwarded-for') || 
                 req.headers.get('x-real-ip') || 
                 'unknown';
      
      if (!SecurityUtils.checkRateLimit(ip, maxRequests, windowMs)) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return handler(req, ...args);
    };
  };
}

export default SecurityUtils;

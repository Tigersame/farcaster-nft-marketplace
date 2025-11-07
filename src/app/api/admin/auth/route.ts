import { NextRequest, NextResponse } from 'next/server';

// Admin authentication API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, action } = body;

    if (action === 'login') {
      // Mock admin users - in production, use proper authentication
      const adminUsers = [
        { username: 'superadmin', password: 'super123', role: 'super_admin' },
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'moderator', password: 'mod123', role: 'moderator' },
      ];

      const user = adminUsers.find(u => u.username === username && u.password === password);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // In production, generate a proper JWT token
      const token = Buffer.from(`${user.username}:${user.role}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        user: {
          username: user.username,
          role: user.role,
        },
      });
    }

    if (action === 'verify') {
      const { token } = body;
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Token required' },
          { status: 400 }
        );
      }

      try {
        // Decode and verify token (simplified for demo)
        const decoded = Buffer.from(token, 'base64').toString();
        const [username, role, timestamp] = decoded.split(':');
        
        // Check if token is not expired (24 hours)
        const tokenAge = Date.now() - parseInt(timestamp);
        if (tokenAge > 24 * 60 * 60 * 1000) {
          return NextResponse.json(
            { success: false, error: 'Token expired' },
            { status: 401 }
          );
        }

        return NextResponse.json({
          success: true,
          user: { username, role },
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid token' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
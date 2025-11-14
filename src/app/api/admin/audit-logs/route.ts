/**
 * Admin API - Audit Logs
 * GET /api/admin/audit-logs - Retrieve audit logs
 * POST /api/admin/audit-logs - Save audit log entry
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (use real database in production)
const auditLogs: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');

    let filtered = [...auditLogs];

    // Apply filters
    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }
    if (action) {
      filtered = filtered.filter(log => log.action === action);
    }
    if (startDate) {
      filtered = filtered.filter(log => log.timestamp >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(log => log.timestamp <= endDate);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit results
    const results = filtered.slice(0, limit);

    return NextResponse.json({ 
      logs: results,
      total: filtered.length
    });

  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const logEntry = await request.json();

    // Validate log entry
    if (!logEntry.action || !logEntry.userId) {
      return NextResponse.json(
        { error: 'Invalid log entry' },
        { status: 400 }
      );
    }

    // Add to storage (in production, save to append-only database table)
    auditLogs.push(logEntry);

    // Keep only last 1000 entries in memory
    if (auditLogs.length > 1000) {
      auditLogs.shift();
    }

    return NextResponse.json({ 
      success: true,
      id: logEntry.id
    });

  } catch (error: any) {
    console.error('Error saving audit log:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save audit log' },
      { status: 500 }
    );
  }
}

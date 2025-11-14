/**
 * Audit Logging System
 * Tamper-evident logging for all admin actions
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userAddress: string;
  payload: Record<string, any>;
  txHash?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'pending' | 'success' | 'failed';
  errorMessage?: string;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
  const logEntry: AuditLogEntry = {
    id: generateLogId(),
    timestamp: new Date().toISOString(),
    ...entry,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 Audit Log:', logEntry);
  }

  // Save to database (append-only table)
  await saveToDatabase(logEntry);

  // Send to secure storage (S3/IPFS)
  await archiveLog(logEntry);

  return logEntry;
}

/**
 * Generate unique log ID
 */
function generateLogId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save log entry to database (implement with your DB)
 */
async function saveToDatabase(entry: AuditLogEntry): Promise<void> {
  try {
    const response = await fetch('/api/admin/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error(`Failed to save audit log: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error saving audit log:', error);
    // Don't throw - audit log failure shouldn't block operations
    // But do send alert
    sendAuditLogAlert(entry, error);
  }
}

/**
 * Archive log to immutable storage
 */
async function archiveLog(entry: AuditLogEntry): Promise<void> {
  if (!process.env.NEXT_PUBLIC_AUDIT_ARCHIVE_ENABLED) {
    return;
  }

  try {
    // Archive to S3/IPFS/Arweave for tamper-evidence
    await fetch('/api/admin/audit-logs/archive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch (error) {
    console.error('Error archiving audit log:', error);
  }
}

/**
 * Send alert on audit log failure
 */
function sendAuditLogAlert(entry: AuditLogEntry, error: any) {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      tags: { type: 'audit_log_failure' },
      extra: { entry },
      level: 'error',
    });
  }
}

/**
 * Retrieve audit logs (for admin dashboard)
 */
export async function getAuditLogs(filters?: {
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<AuditLogEntry[]> {
  const params = new URLSearchParams();
  if (filters?.userId) params.set('userId', filters.userId);
  if (filters?.action) params.set('action', filters.action);
  if (filters?.startDate) params.set('startDate', filters.startDate);
  if (filters?.endDate) params.set('endDate', filters.endDate);
  if (filters?.limit) params.set('limit', filters.limit.toString());

  const response = await fetch(`/api/admin/audit-logs?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch audit logs');
  }

  return response.json();
}

/**
 * Admin action helpers
 */

export async function logMint(data: {
  userId: string;
  userAddress: string;
  to: string;
  tokenId?: number;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
  errorMessage?: string;
}) {
  return createAuditLog({
    action: 'admin.mint',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { to: data.to, tokenId: data.tokenId },
    txHash: data.txHash,
    status: data.status,
    errorMessage: data.errorMessage,
  });
}

export async function logBatchMint(data: {
  userId: string;
  userAddress: string;
  to: string;
  tokenIds: number[];
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.batch_mint',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { to: data.to, tokenIds: data.tokenIds, count: data.tokenIds.length },
    txHash: data.txHash,
    status: data.status,
  });
}

export async function logCreateCollection(data: {
  userId: string;
  userAddress: string;
  collectionId: string;
  name: string;
  status: 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.create_collection',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { collectionId: data.collectionId, name: data.name },
    status: data.status,
  });
}

export async function logSetPrice(data: {
  userId: string;
  userAddress: string;
  tokenId: number;
  price: string;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.set_price',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { tokenId: data.tokenId, price: data.price },
    txHash: data.txHash,
    status: data.status,
  });
}

export async function logDelist(data: {
  userId: string;
  userAddress: string;
  tokenId: number;
  reason?: string;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.delist',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { tokenId: data.tokenId, reason: data.reason },
    txHash: data.txHash,
    status: data.status,
  });
}

export async function logWithdrawProposed(data: {
  userId: string;
  userAddress: string;
  amount: string;
  to: string;
  proposalId: string;
}) {
  return createAuditLog({
    action: 'admin.withdraw_proposed',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { amount: data.amount, to: data.to, proposalId: data.proposalId },
    status: 'pending',
  });
}

export async function logWithdrawExecuted(data: {
  userId: string;
  userAddress: string;
  amount: string;
  to: string;
  txHash: string;
  status: 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.withdraw_executed',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { amount: data.amount, to: data.to },
    txHash: data.txHash,
    status: data.status,
  });
}

export async function logGrantRole(data: {
  userId: string;
  userAddress: string;
  role: string;
  to: string;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.grant_role',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { role: data.role, to: data.to },
    txHash: data.txHash,
    status: data.status,
  });
}

export async function logRevokeRole(data: {
  userId: string;
  userAddress: string;
  role: string;
  from: string;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.revoke_role',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { role: data.role, from: data.from },
    txHash: data.txHash,
    status: data.status,
  });
}

export async function logPause(data: {
  userId: string;
  userAddress: string;
  reason?: string;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.pause',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { reason: data.reason },
    txHash: data.txHash,
    status: data.status,
  });
}

export async function logUnpause(data: {
  userId: string;
  userAddress: string;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.unpause',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: {},
    txHash: data.txHash,
    status: data.status,
  });
}

export async function logSetTheme(data: {
  userId: string;
  userAddress: string;
  key: string;
  value: string;
  status: 'success' | 'failed';
}) {
  return createAuditLog({
    action: 'admin.set_theme',
    userId: data.userId,
    userAddress: data.userAddress,
    payload: { key: data.key, value: data.value },
    status: data.status,
  });
}

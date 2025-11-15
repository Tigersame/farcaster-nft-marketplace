// Notification token storage and management
// This is a simple in-memory implementation. For production, use a database like PostgreSQL or Redis.

export interface NotificationDetails {
  url: string;
  token: string;
}

export interface UserNotificationKey {
  fid: number;
  appFid: number;
}

// In-memory storage (replace with database in production)
const notificationStore = new Map<string, NotificationDetails>();

// Helper to create unique key for user-client combination
function getNotificationKey(fid: number, appFid: number): string {
  return `${fid}:${appFid}`;
}

// Save notification details for a user-client combination
export function setUserNotificationDetails(
  fid: number,
  appFid: number,
  details: NotificationDetails
): void {
  const key = getNotificationKey(fid, appFid);
  notificationStore.set(key, details);
  console.log(`✅ Saved notification token for FID ${fid}, App FID ${appFid}`);
}

// Get notification details for a user-client combination
export function getUserNotificationDetails(
  fid: number,
  appFid: number
): NotificationDetails | null {
  const key = getNotificationKey(fid, appFid);
  return notificationStore.get(key) || null;
}

// Delete notification details for a user-client combination
export function deleteUserNotificationDetails(
  fid: number,
  appFid: number
): boolean {
  const key = getNotificationKey(fid, appFid);
  const deleted = notificationStore.delete(key);
  if (deleted) {
    console.log(`🗑️ Deleted notification token for FID ${fid}, App FID ${appFid}`);
  }
  return deleted;
}

// Get all stored notification details (for debugging)
export function getAllNotificationDetails(): Array<{
  fid: number;
  appFid: number;
  details: NotificationDetails;
}> {
  const results: Array<{
    fid: number;
    appFid: number;
    details: NotificationDetails;
  }> = [];

  notificationStore.forEach((details, key) => {
    const [fidStr, appFidStr] = key.split(':');
    results.push({
      fid: parseInt(fidStr, 10),
      appFid: parseInt(appFidStr, 10),
      details,
    });
  });

  return results;
}

// Clear all notification details (for testing)
export function clearAllNotificationDetails(): void {
  notificationStore.clear();
  console.log('🧹 Cleared all notification tokens');
}

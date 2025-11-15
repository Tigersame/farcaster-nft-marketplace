import { NextRequest, NextResponse } from 'next/server'

/**
 * Farcaster Mini App Webhook Handler
 * Receives events from Farcaster when users interact with your Mini App
 * 
 * Events follow JSON Farcaster Signature format:
 * { header: string, payload: string, signature: string }
 * All values are base64url encoded.
 * 
 * Event types:
 * - miniapp_added - User adds your Mini App
 * - miniapp_removed - User removes your Mini App
 * - notifications_enabled - User enables notifications
 * - notifications_disabled - User disables notifications
 */

interface JFSEvent {
  header: string
  payload: string
  signature: string
}

interface EventPayload {
  event: 'miniapp_added' | 'miniapp_removed' | 'notifications_enabled' | 'notifications_disabled'
  notificationDetails?: {
    url: string
    token: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const jfsEvent: JFSEvent = await request.json()
    
    // Decode base64url encoded payload
    const payloadJson = Buffer.from(jfsEvent.payload, 'base64url').toString('utf-8')
    const payload: EventPayload = JSON.parse(payloadJson)
    
    // Decode header to get FID
    const headerJson = Buffer.from(jfsEvent.header, 'base64url').toString('utf-8')
    const header = JSON.parse(headerJson)
    
    console.log('Farcaster webhook event:', payload.event, 'from FID:', header.fid)

    switch (payload.event) {
      case 'miniapp_added':
        // User added your Mini App - notifications enabled by default
        console.log(`User ${header.fid} added FarcastMints`)
        if (payload.notificationDetails) {
          await handleMiniAppAdded(header.fid, payload.notificationDetails)
        }
        break

      case 'miniapp_removed':
        // User removed your Mini App - invalidate notification tokens
        console.log(`User ${header.fid} removed FarcastMints`)
        await handleMiniAppRemoved(header.fid)
        break

      case 'notifications_enabled':
        // User re-enabled notifications
        console.log(`User ${header.fid} enabled notifications`)
        if (payload.notificationDetails) {
          await handleNotificationsEnabled(header.fid, payload.notificationDetails)
        }
        break

      case 'notifications_disabled':
        // User disabled notifications - invalidate tokens
        console.log(`User ${header.fid} disabled notifications`)
        await handleNotificationsDisabled(header.fid)
        break

      default:
        console.log('Unknown webhook event:', payload.event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleMiniAppAdded(fid: number, notificationDetails: { url: string, token: string }) {
  // Store notification token for this user
  // You should:
  // - Save token to database associated with FID
  // - Award bonus XP (e.g., 500 XP for adding app)
  // - Send welcome notification
  
  console.log('Mini App added:', {
    fid,
    notificationUrl: notificationDetails.url,
    tokenPreview: notificationDetails.token.substring(0, 10) + '...'
  })
  
  // Example: Store in your database
  // await db.notificationTokens.create({
  //   fid,
  //   token: notificationDetails.token,
  //   url: notificationDetails.url,
  //   enabled: true
  // })
  
  // Example: Award installation XP
  // await awardXP(fid, 500, 'Mini App Installation')
}

async function handleMiniAppRemoved(fid: number) {
  // Invalidate all notification tokens for this user
  console.log('Mini App removed for FID:', fid)
  
  // Example: Remove from database
  // await db.notificationTokens.deleteMany({ where: { fid } })
}

async function handleNotificationsEnabled(fid: number, notificationDetails: { url: string, token: string }) {
  // Update notification token - user re-enabled notifications
  console.log('Notifications re-enabled:', {
    fid,
    tokenPreview: notificationDetails.token.substring(0, 10) + '...'
  })
  
  // Example: Update database
  // await db.notificationTokens.upsert({
  //   where: { fid },
  //   create: { fid, token: notificationDetails.token, url: notificationDetails.url, enabled: true },
  //   update: { token: notificationDetails.token, url: notificationDetails.url, enabled: true }
  // })
}

async function handleNotificationsDisabled(fid: number) {
  // Mark tokens as disabled (don't delete - user might re-enable)
  console.log('Notifications disabled for FID:', fid)
  
  // Example: Update database
  // await db.notificationTokens.updateMany({
  //   where: { fid },
  //   data: { enabled: false }
  // })
}

// Allow GET for testing
export async function GET() {
  return NextResponse.json({
    status: 'Farcaster Mini App webhook endpoint',
    events: [
      'miniapp_added',
      'miniapp_removed',
      'notifications_enabled',
      'notifications_disabled'
    ],
    message: 'Webhook endpoint is active'
  })
}
      'miniapp.install',
      'miniapp.uninstall', 
      'miniapp.open',
      'notification.click'
    ]
  })
}

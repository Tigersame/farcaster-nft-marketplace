import { NextRequest, NextResponse } from 'next/server'

/**
 * Farcaster Mini App Webhook Handler
 * Receives events from Farcaster when users interact with your Mini App
 * 
 * Events include:
 * - miniapp.install - User installs your app
 * - miniapp.uninstall - User uninstalls your app
 * - miniapp.open - User opens your app
 * - notification.click - User clicks a notification
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    console.log('Farcaster webhook event:', event, data)

    switch (event) {
      case 'miniapp.install':
        // User installed your Mini App
        console.log(`User ${data.fid} installed FarcastMints`)
        // You can track installations, send welcome notification, etc.
        await handleInstall(data)
        break

      case 'miniapp.uninstall':
        // User uninstalled your Mini App
        console.log(`User ${data.fid} uninstalled FarcastMints`)
        await handleUninstall(data)
        break

      case 'miniapp.open':
        // User opened your Mini App
        console.log(`User ${data.fid} opened FarcastMints`)
        await handleOpen(data)
        break

      case 'notification.click':
        // User clicked a notification
        console.log(`User ${data.fid} clicked notification: ${data.notificationId}`)
        await handleNotificationClick(data)
        break

      default:
        console.log('Unknown webhook event:', event)
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

async function handleInstall(data: any) {
  // Track installation
  // You could:
  // - Add user to database
  // - Send welcome notification
  // - Award bonus XP
  console.log('New installation:', data)
  
  // Example: Award 500 XP for installing
  // await awardXP(data.fid, 500, 'App Installation')
}

async function handleUninstall(data: any) {
  // Track uninstallation
  console.log('User uninstalled:', data)
}

async function handleOpen(data: any) {
  // Track app opens
  // You could:
  // - Update last seen timestamp
  // - Award daily login XP
  console.log('App opened:', data)
}

async function handleNotificationClick(data: any) {
  // Handle notification clicks
  // You could:
  // - Track notification engagement
  // - Award XP for engagement
  console.log('Notification clicked:', data)
}

// Allow GET for testing
export async function GET() {
  return NextResponse.json({
    status: 'Farcaster Mini App webhook endpoint',
    events: [
      'miniapp.install',
      'miniapp.uninstall', 
      'miniapp.open',
      'notification.click'
    ]
  })
}

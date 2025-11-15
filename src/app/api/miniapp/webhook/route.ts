import { NextRequest, NextResponse } from "next/server";
import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";
import {
  setUserNotificationDetails,
  deleteUserNotificationDetails,
} from "@/lib/notifications";
import { sendMiniAppNotification } from "@/lib/sendNotification";

// Webhook route to handle Mini App events from Farcaster clients
export async function POST(request: NextRequest) {
  console.log("📨 Received webhook event");

  let requestJson;
  try {
    requestJson = await request.json();
  } catch (e) {
    console.error("❌ Failed to parse webhook request:", e);
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Parse and verify the webhook event
  let data;
  try {
    // Verify the event signature using Neynar API
    data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
    console.log("✅ Webhook event verified");
  } catch (e: unknown) {
    console.error("❌ Webhook verification failed:", e);
    
    if (e instanceof Error) {
      if (e.message.includes("Invalid signature")) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Verification failed", details: e.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Unknown verification error" },
      { status: 500 }
    );
  }

  // Extract webhook data
  const fid = data.fid;
  const appFid = data.appFid; // The FID of the client app (Base app is 309857)
  const event = data.event;

  console.log(`📋 Event: ${event.event} | FID: ${fid} | App FID: ${appFid}`);

  // Handle different event types
  try {
    switch (event.event) {
      case "miniapp_added": {
        console.log(`✅ Mini App added by FID ${fid} on client ${appFid}`);
        
        if (event.notificationDetails) {
          // Save notification details
          setUserNotificationDetails(fid, appFid, event.notificationDetails);
          
          // Send welcome notification asynchronously (don't block webhook response)
          sendMiniAppNotification({
            fid,
            appFid,
            title: "Welcome to Farcast Mints! 🎨",
            body: "Your NFT marketplace is now ready",
          }).catch((error) => {
            console.error("Failed to send welcome notification:", error);
          });
        }
        break;
      }

      case "miniapp_removed": {
        console.log(`❌ Mini App removed by FID ${fid} on client ${appFid}`);
        // Delete notification details
        deleteUserNotificationDetails(fid, appFid);
        break;
      }

      case "notifications_enabled": {
        console.log(`🔔 Notifications enabled by FID ${fid} on client ${appFid}`);
        
        if (event.notificationDetails) {
          // Save new notification details
          setUserNotificationDetails(fid, appFid, event.notificationDetails);
          
          // Send confirmation notification asynchronously
          sendMiniAppNotification({
            fid,
            appFid,
            title: "Ding ding ding! 🔔",
            body: "Notifications are now enabled",
          }).catch((error) => {
            console.error("Failed to send confirmation notification:", error);
          });
        }
        break;
      }

      case "notifications_disabled": {
        console.log(`🔕 Notifications disabled by FID ${fid} on client ${appFid}`);
        // Delete notification details
        deleteUserNotificationDetails(fid, appFid);
        break;
      }

      default: {
        console.log(`⚠️ Unknown event type: ${(event as any).event}`);
      }
    }

    // Return success response immediately (within 10 seconds)
    return NextResponse.json(
      { success: true, message: "Event processed" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error processing webhook event:", error);
    
    // Still return 200 to acknowledge receipt, but log the error
    return NextResponse.json(
      { success: false, error: "Internal processing error" },
      { status: 200 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

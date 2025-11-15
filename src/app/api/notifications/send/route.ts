import { NextRequest, NextResponse } from "next/server";
import { sendMiniAppNotification, sendBatchNotifications } from "@/lib/sendNotification";

// Manual notification sending API (for testing and admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      fid,
      appFid = 309857, // Default to Base app FID
      title,
      body: notificationBody,
      targetUrl,
      recipients, // For batch sending
    } = body;

    // Validate required fields
    if (!title || !notificationBody) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    // Batch sending
    if (recipients && Array.isArray(recipients)) {
      const results = await sendBatchNotifications({
        recipients,
        title,
        body: notificationBody,
        targetUrl,
      });

      return NextResponse.json({
        success: true,
        type: "batch",
        results,
      });
    }

    // Single notification
    if (!fid) {
      return NextResponse.json(
        { error: "FID is required for single notifications" },
        { status: 400 }
      );
    }

    const result = await sendMiniAppNotification({
      fid,
      appFid,
      title,
      body: notificationBody,
      targetUrl,
    });

    if (result.state === "success") {
      return NextResponse.json({
        success: true,
        type: "single",
        message: "Notification sent successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        state: result.state,
        error: result.state === "error" ? result.error : undefined,
      });
    }
  } catch (error) {
    console.error("Error in send notification API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get example payload
export async function GET() {
  return NextResponse.json({
    message: "Send notification API",
    endpoints: {
      single: {
        method: "POST",
        body: {
          fid: 123456,
          appFid: 309857,
          title: "NFT Listed!",
          body: "Your NFT is now live on the marketplace",
          targetUrl: "https://farcastmints.com/marketplace",
        },
      },
      batch: {
        method: "POST",
        body: {
          recipients: [
            { fid: 123456, appFid: 309857 },
            { fid: 789012, appFid: 309857 },
          ],
          title: "New Collection Drop",
          body: "Check out our latest NFT collection",
          targetUrl: "https://farcastmints.com/marketplace",
        },
      },
    },
  });
}

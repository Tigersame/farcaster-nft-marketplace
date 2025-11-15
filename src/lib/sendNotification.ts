import { z } from "zod";
import { getUserNotificationDetails } from "./notifications";

// Schema for notification request
export const sendNotificationRequestSchema = z.object({
  notificationId: z.string().max(128),
  title: z.string().max(32),
  body: z.string().max(128),
  targetUrl: z.string().max(1024),
  tokens: z.array(z.string()).max(100),
});

export type SendNotificationRequest = z.infer<
  typeof sendNotificationRequestSchema
>;

// Schema for notification response
export const sendNotificationResponseSchema = z.object({
  result: z.object({
    successfulTokens: z.array(z.string()),
    invalidTokens: z.array(z.string()),
    rateLimitedTokens: z.array(z.string()),
  }),
});

export type SendNotificationResponse = z.infer<
  typeof sendNotificationResponseSchema
>;

// Result types for notification sending
export type SendMiniAppNotificationResult =
  | { state: "success" }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "error"; error: unknown };

// Send notification to a specific user
export async function sendMiniAppNotification({
  fid,
  appFid,
  title,
  body,
  targetUrl,
}: {
  fid: number;
  appFid: number;
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<SendMiniAppNotificationResult> {
  // Get notification details for this user-client combination
  const notificationDetails = getUserNotificationDetails(fid, appFid);
  
  if (!notificationDetails) {
    console.log(`⚠️ No notification token found for FID ${fid}, App FID ${appFid}`);
    return { state: "no_token" };
  }

  // Default target URL to the app home if not specified
  const finalTargetUrl = targetUrl || process.env.NEXT_PUBLIC_APP_URL || "https://farcastmints.com";

  const payload: SendNotificationRequest = {
    notificationId: crypto.randomUUID(),
    title,
    body,
    targetUrl: finalTargetUrl,
    tokens: [notificationDetails.token],
  };

  try {
    const response = await fetch(notificationDetails.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();

    if (response.status === 200) {
      const responseBody = sendNotificationResponseSchema.safeParse(responseJson);
      
      if (responseBody.success === false) {
        console.error("❌ Malformed notification response:", responseBody.error.errors);
        return { state: "error", error: responseBody.error.errors };
      }

      if (responseBody.data.result.rateLimitedTokens.length > 0) {
        console.log(`⏱️ Notification rate limited for FID ${fid}`);
        return { state: "rate_limit" };
      }

      if (responseBody.data.result.invalidTokens.length > 0) {
        console.log(`⚠️ Invalid notification token for FID ${fid}, token should be removed`);
        return { state: "error", error: "Invalid token" };
      }

      console.log(`✅ Notification sent successfully to FID ${fid}`);
      return { state: "success" };
    } else {
      console.error(`❌ Notification failed with status ${response.status}:`, responseJson);
      return { state: "error", error: responseJson };
    }
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return { state: "error", error };
  }
}

// Batch send notifications to multiple users
export async function sendBatchNotifications({
  recipients,
  title,
  body,
  targetUrl,
}: {
  recipients: Array<{ fid: number; appFid: number }>;
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<{
  successful: number;
  failed: number;
  noToken: number;
  rateLimited: number;
}> {
  const results = {
    successful: 0,
    failed: 0,
    noToken: 0,
    rateLimited: 0,
  };

  const promises = recipients.map(async ({ fid, appFid }) => {
    const result = await sendMiniAppNotification({
      fid,
      appFid,
      title,
      body,
      targetUrl,
    });

    switch (result.state) {
      case "success":
        results.successful++;
        break;
      case "no_token":
        results.noToken++;
        break;
      case "rate_limit":
        results.rateLimited++;
        break;
      case "error":
        results.failed++;
        break;
    }
  });

  await Promise.all(promises);

  console.log(`📊 Batch notification results:`, results);

  return results;
}

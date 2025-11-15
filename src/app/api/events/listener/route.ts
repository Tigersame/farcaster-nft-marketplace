import { NextRequest, NextResponse } from "next/server";
import { startEventListener, stopEventListener, queryPastEvents } from "@/lib/eventListener";

// Global listener state (in production, use a proper process manager)
let listenerRunning = false;

// Start event listener endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "start") {
      if (listenerRunning) {
        return NextResponse.json(
          { error: "Event listener already running" },
          { status: 400 }
        );
      }

      await startEventListener();
      listenerRunning = true;

      return NextResponse.json({
        success: true,
        message: "Event listener started successfully",
      });
    }

    if (action === "stop") {
      if (!listenerRunning) {
        return NextResponse.json(
          { error: "Event listener not running" },
          { status: 400 }
        );
      }

      await stopEventListener();
      listenerRunning = false;

      return NextResponse.json({
        success: true,
        message: "Event listener stopped successfully",
      });
    }

    if (action === "query") {
      const { fromBlock, toBlock } = body;
      
      if (!fromBlock) {
        return NextResponse.json(
          { error: "fromBlock is required" },
          { status: 400 }
        );
      }

      const events = await queryPastEvents(fromBlock, toBlock || "latest");

      return NextResponse.json({
        success: true,
        events,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'start', 'stop', or 'query'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in event listener API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get listener status
export async function GET() {
  return NextResponse.json({
    running: listenerRunning,
    contractAddress: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  });
}

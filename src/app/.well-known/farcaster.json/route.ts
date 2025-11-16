import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjI3OTA1NSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDRCMjEwOTE1MjJGMDA5OUI4Rjc2Mzk2OGQzNzliMGY4M2E1NWNBYjMifQ",
      payload: "eyJkb21haW4iOiJ3d3cuZmFyY2FzdG1pbnRzLmNvbSJ9",
      signature: "kxC+0R4CODbMoQpXrB16HrKmN0Y7onJo0X/dIr7V5f4ESmoun/GAtFJI4IVBM+8O3vpj3IqzBJ/6qDIzjT36XBs="
    }
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    }
  })
}

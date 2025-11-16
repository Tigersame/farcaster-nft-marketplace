import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjI3OTA1NSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDRCMjEwOTE1MjJGMDA5OUI4Rjc2Mzk2OGQzNzliMGY4M2E1NWNBYjMifQ",
      payload: "eyJkb21haW4iOiJmYXJjYXN0bWludHMuY29tIn0",
      signature: "FKK/+CegXaVEz+VSWhSs/WYNSFs7yaeFZZboBvQKpw4brV1PzHWeBFJ6sMdlBlXGwxWb5ANEPncQkjY4j4C49Rw="
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

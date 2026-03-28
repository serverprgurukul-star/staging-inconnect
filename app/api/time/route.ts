import { NextResponse } from 'next/server'

// Returns server time so the client can't manipulate the countdown via system clock changes
export async function GET() {
  return NextResponse.json(
    { now: Date.now() },
    {
      headers: {
        // Never cache — always return real current time
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  )
}

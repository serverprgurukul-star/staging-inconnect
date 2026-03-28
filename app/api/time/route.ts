import { NextResponse } from 'next/server'

// Returns server time so the client can't manipulate the countdown via system clock changes.
// Cached for 30s on CDN — all visitors within that window share one response.
// The client ticks locally from this anchor so 30s accuracy is perfectly fine for a countdown.
export async function GET() {
  return NextResponse.json(
    { now: Date.now() },
    {
      headers: {
        'Cache-Control': 's-maxage=30, stale-while-revalidate=10',
      },
    }
  )
}

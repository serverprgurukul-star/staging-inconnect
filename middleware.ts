import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// In-memory rate limiter (per-process, resets on cold start — good enough for Edge/Node single instances)
// For multi-instance deployments, replace with Redis via Upstash
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

interface RateLimitRule {
  windowMs: number
  maxRequests: number
}

const RATE_LIMIT_RULES: Record<string, RateLimitRule> = {
  // Payment endpoints - strict
  '/api/razorpay/create-order': { windowMs: 60_000, maxRequests: 10 },
  '/api/razorpay/verify-payment': { windowMs: 60_000, maxRequests: 10 },
  // Coupon validation
  '/api/coupons/validate': { windowMs: 60_000, maxRequests: 20 },
  // Admin setup - extremely strict (should only ever be called once)
  '/api/masterman/setup': { windowMs: 60_000, maxRequests: 3 },
  // Admin login page (brute-force protection)
  '/masterman/login': { windowMs: 60_000, maxRequests: 15 },
  // General API fallback
  '/api/': { windowMs: 60_000, maxRequests: 60 },
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

function checkRateLimit(ip: string, pathname: string): boolean {
  // Find the most specific matching rule
  const ruleKey = Object.keys(RATE_LIMIT_RULES).find((key) => pathname.startsWith(key))
  if (!ruleKey) return true // no rule = allow

  const rule = RATE_LIMIT_RULES[ruleKey]
  const mapKey = `${ip}:${ruleKey}`
  const now = Date.now()

  const entry = rateLimitMap.get(mapKey)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(mapKey, { count: 1, resetAt: now + rule.windowMs })
    return true
  }

  if (entry.count >= rule.maxRequests) {
    return false // rate limit exceeded
  }

  entry.count += 1
  return true
}

// Periodically clean up expired entries to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(key)
  }
}, 5 * 60_000) // every 5 minutes

// Launch date from env — NEXT_PUBLIC_LAUNCH_TIMESTAMP
const LAUNCH_DATE = new Date(process.env.NEXT_PUBLIC_LAUNCH_TIMESTAMP!)

// Routes blocked before launch (frontend pages)
const PRE_LAUNCH_BLOCKED_PAGES = ['/shop', '/product', '/cart', '/checkout', '/order-success', '/track-order']
// API routes blocked before launch
const PRE_LAUNCH_BLOCKED_APIS = ['/api/razorpay', '/api/coupons']

function isPreLaunch(): boolean {
  return Date.now() < LAUNCH_DATE.getTime()
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const ip = getClientIp(request)
  const method = request.method

  // Log every request with IP — visible in Vercel Functions logs
  console.log(`[${new Date().toISOString()}] ${method} ${pathname} — ip=${ip} ua="${request.headers.get('user-agent') ?? '-'}"`)

  // Apply rate limiting before any other logic
  if (!checkRateLimit(ip, pathname)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Content-Type': 'application/json',
        },
      }
    )
  }

  // Block everything before launch
  if (isPreLaunch()) {
    // Block API routes — return 503
    if (PRE_LAUNCH_BLOCKED_APIS.some((p) => pathname.startsWith(p))) {
      return NextResponse.json(
        { error: 'Store is not open yet. Launch is on March 28, 2026 at 7:00 PM.' },
        { status: 503 }
      )
    }

    // Block frontend pages — redirect to coming-soon
    if (PRE_LAUNCH_BLOCKED_PAGES.some((p) => pathname.startsWith(p))) {
      const url = request.nextUrl.clone()
      url.pathname = '/coming-soon'
      return NextResponse.redirect(url)
    }

    // Redirect homepage to coming-soon
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/coming-soon'
      return NextResponse.redirect(url)
    }
  }

  // After launch, redirect coming-soon back to homepage
  if (!isPreLaunch() && pathname === '/coming-soon') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Only run Supabase auth session check for admin routes
  // Running it on every request causes ~5-6 auth API calls per visitor
  if (pathname.startsWith('/masterman')) {
    return await updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

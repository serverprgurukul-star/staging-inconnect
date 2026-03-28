import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
    )

    // Only authenticated admins can write audit logs
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action, resource_type, resource_id, details } = await request.json()

    if (!action || !resource_type) {
      return NextResponse.json({ error: 'action and resource_type are required' }, { status: 400 })
    }

    const { error } = await supabase.from('admin_audit_logs').insert({
      admin_id: user.id,
      admin_email: user.email,
      action,
      resource_type,
      resource_id: resource_id || null,
      details: details || null,
      ip_address: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown',
      user_agent: request.headers.get('user-agent') ?? 'unknown',
    })

    if (error) {
      console.error('Audit log insert error:', error)
      return NextResponse.json({ error: 'Failed to write audit log' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to write audit log' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50')))
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('admin_audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
    }

    return NextResponse.json({ logs: data, total: count, page, limit })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}

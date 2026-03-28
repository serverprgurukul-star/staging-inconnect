import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side coupon validation - never trust the client
export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    if (typeof subtotal !== 'number' || subtotal <= 0) {
      return NextResponse.json({ error: 'Valid subtotal is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('code, discount_value, discount_type, min_order_amount, usage_limit, used_count, is_active, expires_at')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 })
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
    }

    // Check usage limit
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    }

    // Check minimum order amount
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${coupon.min_order_amount} required` },
        { status: 400 }
      )
    }

    // Calculate discount server-side
    let discountAmount: number
    if (coupon.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discount_value) / 100 * 100) / 100
    } else {
      discountAmount = Math.min(coupon.discount_value, subtotal)
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount: coupon.discount_value,
      type: coupon.discount_type,
      discountAmount,
      minOrderAmount: coupon.min_order_amount,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}

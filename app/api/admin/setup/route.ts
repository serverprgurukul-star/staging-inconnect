import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// This endpoint creates the initial admin user
// It should only be used once and then disabled or deleted

export async function POST(request: Request) {
  try {
    const { email, password, secretKey } = await request.json()

    // Require the ADMIN_SETUP_KEY env variable - no hardcoded fallback
    const setupKey = process.env.ADMIN_SETUP_KEY
    if (!setupKey || secretKey !== setupKey) {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 401 })
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    if (existingUser) {
      // Update existing user to have admin role
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: { role: 'admin' },
        }
      )

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: 'Existing user updated with admin role',
        user: { id: data.user.id, email: data.user.email },
      })
    }

    // Create new admin user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' },
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: { id: data.user.id, email: data.user.email },
    })
  } catch (error: any) {
    console.error('Admin setup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    )
  }
}

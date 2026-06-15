import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message === 'Invalid login credentials' ? '邮箱或密码错误' : error.message },
        { status: 401 }
      )
    }

    // 登录成功，session 已通过 createClient 自动设置到 cookie
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email 
      } 
    })
  } catch (e) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}

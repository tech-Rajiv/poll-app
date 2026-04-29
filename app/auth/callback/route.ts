import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/app/lib/supabase/serverClient'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // If there's a "next" param (like /dashboard), go there, otherwise go home
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = await createSupabaseServerClient()

    // This trades the 'code' for a user session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Flash toast after redirect (client reads & clears)
      cookieStore.set({
        name: 'pp_flash_toast',
        value: 'welcome',
        path: '/',
        maxAge: 60,
      })
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If something goes wrong, send them to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
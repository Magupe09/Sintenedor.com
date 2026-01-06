import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const error_param = searchParams.get('error')
    const error_description = searchParams.get('error_description')

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    console.log('🔄 CALLBACK: Iniciando callback de Google');
    console.log('🔄 CALLBACK: Code presente:', !!code);
    console.log('🔄 CALLBACK: Error param:', error_param);
    console.log('🔄 CALLBACK: Error description:', error_description);

    if (code) {
        console.log('🔄 CALLBACK: Procesando code para session...');

        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options })
                    },
                },
            }
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        console.log('🔄 CALLBACK: exchangeCodeForSession resultado:', { data: !!data, error });

        if (!error) {
            console.log('✅ CALLBACK: Session creada exitosamente, redirigiendo a:', `${origin}${next}`);
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error("❌ CALLBACK: Error en exchangeCodeForSession:", error);
            return NextResponse.redirect(`${origin}/login?error=auth_error`)
        }
    }

    // return the user to login with error
    console.log('❌ CALLBACK: No hay code, redirigiendo a login');
    return NextResponse.redirect(`${origin}/login?error=no_code`)
}

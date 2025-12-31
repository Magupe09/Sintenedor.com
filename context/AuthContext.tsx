'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    points: number;
    signInWithEmail: (email: string, pass: string) => Promise<{ error: any }>;
    signUpWithEmail: (email: string, pass: string, data: any) => Promise<{ error: any }>;
    updateProfile: (data: any) => Promise<{ error: any }>;
    signInWithGoogle: () => Promise<{ error: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();

    const [points, setPoints] = useState<number>(0);

    useEffect(() => {
        // Obtenemos la sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("Auth session initial check:", !!session);
            setSession(session);
            setUser(session?.user ?? null);
            // Mock points fetch
            if (session?.user) setPoints(450);
        });

        // Escuchamos cambios en la sesión (Login, Loguot)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Auth State Change Event:", _event, !!session);
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) setPoints(450);

            if (_event === 'SIGNED_OUT') {
                setUser(null);
                setPoints(0);
                router.push('/');
            }

            if (_event === 'SIGNED_IN') {
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [router, supabase]);

    const signInWithEmail = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
        if (!error) router.push('/'); // Redirigir al home o menú tras login
        return { error };
    };

    const signUpWithEmail = async (email: string, pass: string, metaData: any) => {
        const { error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: metaData, // guardamos nombre, telefono, etc
            },
        });
        return { error };
    };

    const updateProfile = async (data: any) => {
        const { error } = await supabase.auth.updateUser({
            data: data
        });
        return { error };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, points, signInWithEmail, signUpWithEmail, updateProfile, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

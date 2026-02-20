import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a placeholder if variables are missing to prevent the app from crashing at a global level
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => ({
                order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
                eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
                execute: () => Promise.resolve({ data: [], error: null })
            }),
            insert: () => Promise.resolve({ data: null, error: 'Supabase URL missing' }),
            update: () => Promise.resolve({ data: null, error: 'Supabase URL missing' })
        })
    };

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. The app will use fallback local data. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables.");
}

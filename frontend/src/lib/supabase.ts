import { createBrowserClient } from '@supabase/ssr';

// Fallback values for build time to prevent crashes during prerendering.
// These are not meant for production use and must be configured in Vercel.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials missing. If this is a production build, please ensure ' +
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment.'
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

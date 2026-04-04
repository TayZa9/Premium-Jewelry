import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const ADMIN_EMAILS = ['heintazarkokolwin@gmail.com'];

export async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('[DEBUG] Admin Auth Check: No user found.', { error: error?.message });
    // FALLBACK: Try getSession for debugging if getUser fails
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      console.log('[DEBUG] Admin Auth Check: User found via getSession fallback:', session.user.email);
      if (ADMIN_EMAILS.includes(session.user.email || '')) {
        return { isAdmin: true, user: session.user };
      }
    }
    return { isAdmin: false, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  const role = user.app_metadata?.role;
  const email = user.email;
  console.log('[DEBUG] Admin Auth Check: User identified:', { email, role });

  const isWhitelisted = ADMIN_EMAILS.includes(email || '');
  const isAdminRole = role === 'ADMIN';

  if (!isAdminRole && !isWhitelisted) {
    return { isAdmin: false, response: NextResponse.json({ message: 'Forbidden' }, { status: 403 }) };
  }

  return { isAdmin: true, user };
}


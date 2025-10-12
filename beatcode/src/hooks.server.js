// src/hooks.server.js
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export async function handle({ event, resolve }) {
  // Create Supabase client
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => {
        // Only set cookies once per request
        if (!event.locals._cookieSet) {
          event.cookies.set(key, value, {
            ...options,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
          });
          event.locals._cookieSet = true;
        }
      },
      remove: (key, options) => event.cookies.delete(key, { ...options, path: '/' }),
    },
  });

  event.locals.supabase = supabase;

  // Fetch session once per request
  if (!event.locals.session) {
    const { data: { user } } = await supabase.auth.getUser();
    event.locals.user = user || null;
  }

  // Resolve the request
  return await resolve(event);
}

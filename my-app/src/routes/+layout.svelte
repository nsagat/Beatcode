<script>
  import '../app.css';
  import { createBrowserClient } from '@supabase/ssr';
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

  // Props coming from +layout.server.js
  export let data;
  const { session } = data;

  // Create browser client (no immediate getSession)
  const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
  );

  // Optionally sync auth state
  supabase.auth.onAuthStateChange((_event, newSession) => {
    // You can update a store or rerun load functions here
  });
</script>

<main>
  <slot />
</main>

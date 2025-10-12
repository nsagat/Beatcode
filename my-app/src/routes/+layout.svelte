<script>
	import '../app.css';
	import { createBrowserClient } from '@supabase/ssr';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ data, depends }) => {
  depends('supabase:auth');

  const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { supabase, session };
};
	
	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

	<main>
		{@render children()}
	</main>


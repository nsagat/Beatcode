// src/routes/+page.server.js
import { supabase } from '$lib/supabaseClient';

export const load = async () => {
  const { data, error } = await supabase
    .from('instruments')
    .select('*'); // or pick columns explicitly

  if (error) {
    console.error('Supabase error:', error); // shows exact reason in terminal
    return { instruments: [], error: error.message };
  }

  return { instruments: data ?? [] };
};

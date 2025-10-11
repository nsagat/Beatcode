/*
// src/routes/+page.server.js
import { supabase } from '$lib/supabaseClient';
//import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session"; // lib/server for google oauth
export const load = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*'); // or pick columns explicitly

  if (error) {
    console.error('Supabase error:', error); // shows exact reason in terminal
    return { users: [], error: error.message };
  }

  return { users: data ?? [] };
};

*/
import { supabase } from '$db/connection';
export async function load() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log('data', data, 'error', error);
}
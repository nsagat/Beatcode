// src/routes/room/[code]/+page.server.js
import { error } from '@sveltejs/kit';
const API_BASE = 'https://leetcode-api-pied.vercel.app';

export async function load({ params, locals, fetch }) {
  const code = params.code.toUpperCase();

  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user){
    throw error(401, 'Not authenticated');
  }

  //Room
  const { data: room } = await locals.supabase
    .from('rooms')
    .select('id, name, code, created_by')
    .eq('code', code)
    .single();
  if (!room){
    throw error(404, 'Room not found');
  }


  const { data: membership } = await locals.supabase
    .from('room_members')
    .select('user_id')
    .eq('room_id', room.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!membership) {
    await locals.supabase.rpc('join_room', { p_code: code });
  }

  //members and leetcode usernames

  const { data: members, error } = await locals.supabase
  .from('room_members')
  .select('LeetcodeID')
  .eq('room_id', room.id); 


    const usernames = (members ?? [])
    .map(m => m.LeetcodeID)
    .filter(Boolean);

  const dailyChallenge = await fetch(`${API_BASE}/daily`).then(r => r.json());
  const profiles = await Promise.all(
    usernames.map(async (uname) => {
      try {
        const prof = await fetch(`${API_BASE}/user/${uname}`).then(r => r.json());
        return { username: uname, profile: prof?.profile, raw: prof };
      } catch (_) {
        return { username: uname, profile: null, raw: null };
      }
    })
  );

  console.log(profiles[0])
  const leaderboard = profiles
    .map(p => ({
      username: p.username,
      solved:  p.raw?.submitStats?.acSubmissionNum[0]?.count ?? 0
    }))
    .sort((a, b) => b.solved - a.solved);

  return {
    room,
    dailyChallenge,
    leaderboard
  };
}

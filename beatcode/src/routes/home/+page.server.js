// src/routes/home/+page.server.js
import { redirect, fail } from '@sveltejs/kit';

const API_BASE = 'https://leetcode-api-pied.vercel.app';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch }) {
  const {
    data: { user },
    error: userError
  } = await locals.supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: 'Not authenticated',
      userProfile: null,
      userContests: null,
      dailyChallenge: null,
      rooms: []
    };
  }

  const username = await getUsername(locals.supabase, user.id);
  const dailyChallenge = await fetch(`${API_BASE}/daily`).then(r => r.json()).catch(() => null);


  let userProfile = null;
  let userContests = null;
  if (username) {
    try {
      const [p, c] = await Promise.all([
        fetch(`${API_BASE}/user/${username}`).then(r => r.json()),
        fetch(`${API_BASE}/user/${username}/contests`).then(r => r.json())
      ]);
      userProfile = p;
      userContests = c;
    } catch (e) {
      console.error('Failed to fetch user LC data:', e);
    }
  }

  //Rooms that the user is in
  const { data: myRooms, error: roomsErr } = await locals.supabase
    .from('room_members')
    .select('room_id, rooms:room_id (name, code)')
    .eq('user_id', user.id);

  if (roomsErr) console.error('roomsErr', roomsErr);

  let roomsWithCounts = [];
  if (myRooms?.length) {
    const roomIds = myRooms.map(r => r.room_id);

    //memebers count for each room
    const { data: memberRows, error: memberErr } = await locals.supabase
      .from('room_members')
      .select('room_id')
      .in('room_id', roomIds);
    if (memberErr){
      console.error('memberErr', memberErr);
    }
    const countMap = new Map();
    (memberRows || []).forEach(row => {
      countMap.set(row.room_id, (countMap.get(row.room_id) || 0) + 1);
    });

    roomsWithCounts = myRooms.map(({ room_id, rooms }) => ({
      id: room_id,
      name: rooms?.name ?? 'Room',
      code: rooms?.code ?? '',
      members: countMap.get(room_id) || 1
    }));
  }

  return {
    error: null,
    dailyChallenge,
    userProfile,
    userContests,
    rooms: roomsWithCounts
  };
}

async function getUsername(supabase, userId) {
  const { data, error } = await supabase
    .from('userdata')
    .select('LeetcodeID')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching username:', error);
    return null;
  }
  return data?.LeetcodeID ?? null;
}

export const actions = {
  createRoom: async ({ request, locals }) => {
    const form = await request.formData();
    const name = (form.get('name') ? String(form.get('name')) : 'My Room').trim();

    const { data, error } = await locals.supabase.rpc('create_room', { p_name: name });
    if (error) {
      console.error('createRoom error:', error);
      return fail(400, { error: error.message, action: 'create' });
    }
    throw redirect(303, `/room/${data.code}`);
  },

  joinRoom: async ({ request, locals }) => {
    const form = await request.formData();
    const code = (form.get('code') ? String(form.get('code')) : '').trim().toUpperCase();

    if (!code) {
      return fail(400, { error: 'Room code is required', action: 'join' });
    }

    const { data, error } = await locals.supabase.rpc('join_room', { p_code: code });
    if (error) {
      console.error('joinRoom error:', error);
      return fail(400, { error: error.message, action: 'join' });
    }
    throw redirect(303, `/room/${data.code || code}`);
  }
};

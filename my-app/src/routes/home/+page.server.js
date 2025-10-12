// src/routes/+page.server.js
//import { supabase } from '$lib/supabaseClient';
import { LegacyESLint } from 'eslint/use-at-your-own-risk';
const API_BASE = 'https://leetcode-api-pied.vercel.app';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
  // Step 1: Get username from your database
  const username = await getUsername(locals.user?.id);
  
  if (!username) {
    return { error: 'No LeetCode username found' };
  }

  // Step 2: Fetch all data from LeetCode API
  try {
    const [userProfile, userContests, userSubmissions, dailyChallenge] = 
      await Promise.all([
        fetch(`${API_BASE}/user/${username}`).then(r => r.json()),
        fetch(`${API_BASE}/user/${username}/contests`).then(r => r.json()),
        fetch(`${API_BASE}/user/${username}/submissions`).then(r => r.json()),
        fetch(`${API_BASE}/daily`).then(r => r.json())
      ]);

    return {
      userProfile,
      userContests,
      userSubmissions,
      dailyChallenge
    };
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    return { error: 'Failed to fetch data' };
  }
}

/**
 * Get username from database
 * Replace this with your actual database query
 */
//The session contains an access token (signed JWT), a refresh token and the user object.

async function getUsername(locals, userId) {
  if(!userId){
    const supa = locals.supabase;
    if(!supa){
      console.error('Supabase client not found in locals');
      return null;
    } 
    const {data, error} = await supa.from('userdata').select('LeetcodeID').eq('id', locals.user.id).single();
    if (error) {
      console.error('Error fetching username from database:', error.message);
      return null;
    }
    return data?.LeetcodeID;
  }
}

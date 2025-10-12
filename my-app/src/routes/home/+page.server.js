// src/routes/home/+page.server.js
const API_BASE = 'https://leetcode-api-pied.vercel.app';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch }) {
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
  
  console.log('User from locals:', user);
  
  if (userError || !user) {
    return { 
      error: 'Not authenticated',
      userProfile: null,
      userContests: null,
      userSubmissions: null,
      dailyChallenge: null
    };
  }

  const username = await getUsername(locals.supabase, user.id);
  console.log(username);
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
  
  return data?.LeetcodeID;
}

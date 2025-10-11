// src/routes/+page.server.js

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
async function getUsername(userId) {
  // TODO: Replace with actual database call
  // Example with Prisma:
  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { leetcodeUsername: true }
  // });
  // return user?.leetcodeUsername;

  // Placeholder
  return '';
}

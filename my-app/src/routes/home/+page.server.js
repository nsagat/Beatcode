// src/routes/+page.server.js

const API_BASE = 'https://leetcode-api-pied.vercel.app';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    // Example: Get today's daily challenge
    const dailyResponse = await fetch(`${API_BASE}/daily`);
    const dailyChallenge = await dailyResponse.json();

    // Example: Get a random problem
    const randomResponse = await fetch(`${API_BASE}/random`);
    const randomProblem = await randomResponse.json();

    // Example: Get user profile (replace 'lee215' with actual username)
    const userResponse = await fetch(`${API_BASE}/user/lee215`);
    const userProfile = await userResponse.json();

    return {
      dailyChallenge,
      randomProblem,
      userProfile
    };
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    return {
      dailyChallenge: null,
      randomProblem: null,
      userProfile: null,
      error: 'Failed to fetch data'
    };
  }
}

// Alternative: Using actions for POST requests or user-specific data
/** @type {import('./$types').Actions} */
export const actions = {
  getUserProfile: async ({ request, fetch }) => {
    const formData = await request.formData();
    const username = formData.get('username');

    if (!username) {
      return { success: false, error: 'Username is required' };
    }

    try {
      const response = await fetch(`${API_BASE}/user/${username}`);
      
      if (!response.ok) {
        return { success: false, error: 'User not found' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  searchProblems: async ({ request, fetch }) => {
    const formData = await request.formData();
    const query = formData.get('query');

    try {
      const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

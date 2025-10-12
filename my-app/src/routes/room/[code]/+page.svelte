<script>
  import { goto } from '$app/navigation';
  
  /** @type {import('./$types').PageData} */
  export let data; // This line receives all the data from your +page.server.js
  
  // Destructure the data for easier access in the template
  const { room, dailyChallenge, leaderboard } = data;

  function leaveRoom() {
    goto('/home'); // Or just '/' depending on your dashboard route
  }
</script>

<main class="min-h-screen bg-gray-50 py-10 px-4">
  <!-- Room Header -->
  <div class="max-w-5xl mx-auto flex justify-between items-center mb-8">
    <div>
      <!-- Use the room data from the server -->
      <h1 class="text-4xl font-bold text-indigo-600">Room: {room.name}</h1>
      <p class="text-gray-600 mt-1">Share this code with friends: <span class="font-mono bg-gray-200 text-indigo-700 px-2 py-1 rounded">{room.code}</span></p>
    </div>
    <button
      on:click={leaveRoom}
      class="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
    >
      Leave Room
    </button>
  </div>

  <!-- Main Room Content -->
  <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
    
    <!-- Daily Challenge Card -->
    <div class="col-span-1 md:col-span-2 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-2xl font-bold mb-4">🔥 Today's Challenge</h2>
        <!-- Use the daily challenge data from the server -->
        <p class="text-lg font-semibold">{dailyChallenge.question.title}</p>
        <p class="text-sm text-gray-500 mb-4">{dailyChallenge.question.difficulty}</p>
      </div>
      <a
        href={"https://leetcode.com" + dailyChallenge.link}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-auto inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition self-start"
      >
        View on LeetCode →
      </a>
    </div>

    <!-- Leaderboard Card -->
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
      {#if leaderboard.length > 0}
        <ul class="space-y-2">
          <!-- Use the leaderboard data from the server -->
          {#each leaderboard as user, i}
            <li class="flex justify-between items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <span class="truncate">
                {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}{user.username}
              </span>
              <span class="font-semibold whitespace-nowrap">{user.solved} solved</span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-gray-500">No members in this room yet.</p>
      {/if}
    </div>

  </div>
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
  }
</style>

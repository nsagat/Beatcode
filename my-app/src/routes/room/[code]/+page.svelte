<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  $: roomCode = $page.params.code;
  
  function leaveRoom() {
    goto('/home');
  }

  // Example placeholder data
  let dailyChallenge = {
    title: "Two Sum",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/two-sum/"
  };
//now instead of hardcoding, fetch from supabase based on room code and backend code.
  let leaderboard = [
    { username: "you", solved: 102 },
    { username: "friend1", solved: 89 },
    { username: "friend2", solved: 65 },
    { username: "friend2", solved: 65 },
    { username: "friend2", solved: 65 }
  ];
</script>

<main class="min-h-screen bg-gray-50 py-10 px-4">
  <!-- Room Header -->
  <div class="max-w-5xl mx-auto flex justify-between items-center mb-8">
    <div>
      <h1 class="text-4xl font-bold text-indigo-600">Room: {roomCode}</h1>
      <p class="text-gray-600 mt-1">You are now in room {roomCode}</p>
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
      <h2 class="text-2xl font-bold mb-4">🔥 Today's Challenge</h2>
      <p class="text-lg font-semibold">{dailyChallenge.title}</p>
      <p class="text-sm text-gray-500 mb-4">{dailyChallenge.difficulty}</p>
      <a
        href={dailyChallenge.link}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-auto inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        View on LeetCode →
      </a>
    </div>

    <!-- Leaderboard Card -->
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
      <ul class="space-y-2">
        {#each leaderboard as user, i}
          <li class="flex justify-between items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <span>
              {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}{user.username}
            </span>
            <span class="font-semibold">{user.solved} solved</span>
          </li>
        {/each}
      </ul>
    </div>

  </div>
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
  }
</style>

<script>
  let rooms = [
    { name: "AlgoCrushers", members: 5 },
    { name: "NightCoders", members: 3 },
  ];

  let dailyChallenge = {
    title: "Two Sum",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/two-sum/",
  };

  let leaderboard = [
    { name: "you", solved: 102 },
    { name: "friend1", solved: 89 },
    { name: "friend2", solved: 65 },
  ];
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
  <header class="w-full max-w-3xl mb-8 text-center">
    <h1 class="text-4xl font-bold text-indigo-600">🧠 BeatCode</h1>
    <p class="text-gray-600 mt-2">Track progress. Stay consistent. Grow together.</p>
  </header>

  <main class="w-full max-w-3xl space-y-8">

    <!-- Quick Actions -->
    <div class="flex justify-center gap-4">
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
        Create Room
      </button>
      <button class="bg-white border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg">
        Join Room
      </button>
    </div>

    <!-- Your Rooms -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">Your Rooms</h2>
      </div>
      <div class="p-4 space-y-3">
        {#each rooms as room}
          <div class="flex justify-between items-center bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition">
            <span class="font-medium">{room.name}</span>
            <span class="text-sm text-gray-500">{room.members} members</span>
            <button class="text-indigo-600">View</button>
          </div>
        {/each}
      </div>
    </div>

    <!-- Daily Challenge -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">🔥 Today’s Global Challenge</h2>
      </div>
      <div class="p-4 flex justify-between items-center">
        <div>
          <p class="text-lg font-semibold">{dailyChallenge.title}</p>
          <p class="text-sm text-gray-500">{dailyChallenge.difficulty}</p>
        </div>
        <a href={dailyChallenge.link} target="_blank" class="text-indigo-600 hover:underline">
          View on LeetCode →
        </a>
      </div>
    </div>

    <!-- Leaderboard Highlights -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">🏆 Leaderboard Highlights</h2>
      </div>
      <div class="p-4 space-y-2">
        {#each leaderboard as user, i}
          <div class="flex justify-between items-center border-b pb-2 text-gray-700">
            <span>
              {#if i === 0}🥇{/if} {#if i === 1}🥈{/if} {#if i === 2}🥉{/if} {user.name}
            </span>
            <span>{user.solved} solved</span>
          </div>
        {/each}
      </div>
    </div>

  </main>
</div>

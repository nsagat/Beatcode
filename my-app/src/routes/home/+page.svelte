<script>
  import { goto } from '$app/navigation';
  import { signOut } from '$lib/auth.js';
  export let data;
  //console.log(data);

  let rooms = [
    { name: "AlgoCrushers", members: 5 },
    { name: "NightCoders", members: 3 },
  ];

  let roomCode = '2';
  
  function joinRoom() {
      console.log("xd");
      goto(`/room/${roomCode}`);
  }  
  function createRoom() {
      console.log("roomCreatepressed");
      goto('/create');
  }  

  async function handleLogout() {
    try {
      await signOut();
      goto('/'); 
    } catch (err) {
      console.log(err.message);
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">

  <header class="w-full max-w-3xl mb-8 flex justify-between items-center px-4">
    <div class="text-center flex-1">
      <h1 class="text-4xl font-bold text-indigo-600">🧠 BeatCode</h1>
      <p class="text-gray-600 mt-2">Track progress. Stay consistent. Grow together.</p>
    </div>

 </header>

  <main class="w-full max-w-3xl space-y-8">

<div class="flex justify-center gap-4">
  <button onclick={createRoom} class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-indigo-600 border border-indigo-600">
    Create Room
  </button>
  <button onclick={joinRoom} class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-indigo-600 border border-indigo-600">
    Join Room
  </button>
  <button onclick={handleLogout} class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-indigo-600 border border-indigo-600">
    Sign Out
  </button>
</div>
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
    <div class="bg-white rounded-lg shadow-md overflow-hidden"> 
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">🔥 Today’s Global Challenge</h2>
      </div>
      <div class="p-4 flex justify-between items-center">
        <div>
          <p class="text-lg font-semibold">{data.dailyChallenge.question.title}</p>
          <p class="text-sm text-gray-500">{data.dailyChallenge.question.difficulty}</p>
        </div>
        <a href={"https://leetcode.com" + data.dailyChallenge.link} target="_blank" class="text-indigo-600 hover:underline">
          View on LeetCode →
        </a>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">🏆 Your Highlights</h2>
      </div>
      <div class="p-4 space-y-3">
        <div class="flex items-center gap-2">
          <span class="font-medium text-gray-800">Username:</span>
          <span class="text-gray-600">{data.userProfile.username}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium text-gray-800">Solutions Completed:</span>
          <span class="text-gray-600">{data.userProfile.profile.solutionCount}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium text-gray-800">Ranking:</span>
          <span class="text-gray-600">{data.userProfile.profile.ranking || 'N/A'}</span>
        </div>

      </div>
    </div>

  </main>
</div>



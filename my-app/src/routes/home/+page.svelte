<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  /** @type {import('./$types').PageData} */
  export let data;

  //join room modal state
  let isJoinModalOpen = false;
  let joinRoomCode = '';
  let joinErrorMessage = '';
  let isJoining = false;

  function openJoinModal() {
    isJoinModalOpen = true;
    joinRoomCode = '';
    joinErrorMessage = '';
  }

  function closeJoinModal() {
    isJoinModalOpen = false;
  }

  //another page to hadnle joining the room
  async function handleJoinRoom() {
    if (!joinRoomCode.trim()) {
      joinErrorMessage = 'Please enter a room code.';
      return;
    }
    isJoining = true;
    joinErrorMessage = '';
    const upperCaseCode = joinRoomCode.trim().toUpperCase();

    try {
      //if the room exists navigfae 
      const { data, error } = await supabase
        .from('rooms')
        .select('code')
        .eq('code', upperCaseCode)
        .single();

      if (error || !data) {
        throw new Error('Room not found. Please check the code and try again.');
      }
      goto(`/room/${data.code}`);
    } catch (err) {
      joinErrorMessage = err.message;
    } finally {
      isJoining = false;
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      goto('/'); 
    } catch (err) {
      console.log(err.message);
    }
  }
</script>

<!--joining room-->
{#if isJoinModalOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" on:click|self={closeJoinModal}>
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-4 text-gray-800">Join a Room</h2>
      <p class="text-center text-gray-500 mb-6">Enter the 6-character code for the room you want to join.</p>
      <form on:submit|preventDefault={handleJoinRoom}>
        <input
          bind:value={joinRoomCode}
          type="text"
          placeholder="ABCDEF"
          class="w-full text-center text-2xl font-mono tracking-widest uppercase px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled={isJoining}
          maxlength="6"
        />
        {#if joinErrorMessage}
          <p class="text-red-500 text-sm text-center mt-3">{joinErrorMessage}</p>
        {/if}
        <div class="flex gap-4 mt-6">
          <button type="button" on:click={closeJoinModal} class="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold" disabled={isJoining}>
            Cancel
          </button>
          <button type="submit" class="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center justify-center disabled:bg-indigo-400" disabled={isJoining}>
            {#if isJoining}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Joining...
            {:else}
              Join Room
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
  <header class="w-full max-w-3xl mb-8 flex justify-between items-center px-4">
    <div class="text-center flex-1">
      <h1 class="text-4xl font-bold text-indigo-600">🧠 BeatCode</h1>
      <p class="text-gray-600 mt-2">Track progress. Stay consistent. Grow together.</p>
    </div>
  </header>

  <main class="w-full max-w-3xl space-y-8">
    <!--quick actions-->
    <div class="flex justify-center gap-4">
      <button on:click={() => goto('/create-room')} class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-indigo-600 border border-indigo-600">
        Create Room
      </button>
      <button on:click={openJoinModal} class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-indigo-600 border border-indigo-600">
        Join Room
      </button>
      <button on:click={handleLogout} class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-indigo-600 border border-indigo-600">
        Sign Out
      </button>
    </div>

    <!--your rooms-->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">Your Rooms</h2>
      </div>
      <div class="p-4 space-y-3">
        {#if data.rooms && data.rooms.length > 0}
          {#each data.rooms as room}
            <div class="flex justify-between items-center bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition">
              <span class="font-medium">{room.name}</span>
              <span class="text-sm text-gray-500">{room.members} members</span>
              <button on:click={() => goto(`/room/${room.code}`)} class="text-indigo-600 hover:underline">View</button>
            </div>
          {/each}
        {:else}
          <p class="text-gray-500 text-center py-4">You haven't joined any rooms yet.</p>
        {/if}
      </div>
    </div>

    {#if data.dailyChallenge?.question}
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
    {/if}

    <!--leaderboard-->
    {#if data.userProfile?.profile}
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
    {/if}
  </main>
</div>


<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
	//import { user } from 'pg/lib/defaults';
  import {onMount}  from 'svelte'; //schedules a callback function

  /** @type {import('./$types').PageData} */
  export let data;
  const { room, dailyChallenge, leaderboard } = data;
  //exit the room
  function leaveRoom() {
    goto('/home');
  }
  //chatboxyyyy code:
  let messages = [{role:'assistant',content :"Welcocme to the room, happy coding! Ask me if you have any questions."}];
  let userInput = '';
  let isLoading = false;
  let chatErrorMessage = '';
  let chatContainer;

  async function handleSendMessage(event) {
    if (event.type === 'keydown' && event.key !== 'Enter') return;
    if (!userInput.trim()) return;

    const newUserMessage = { role: 'user', content: userInput.trim() };
    messages = [...messages, newUserMessage];
    userInput = '';
    isLoading = true;
    chatErrorMessage = '';
    
    setTimeout(() => {
      if(chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newUserMessage.content,
          context: `The daily LeetCode challenge is "${data.dailyChallenge?.question?.title}". The user is in a coding room and needs help.`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong.');
      }

      const { reply } = await response.json();
      messages = [...messages, { role: 'assistant', content: reply }];

    } catch (err) {
      chatErrorMessage = err.message;
    } finally {
      isLoading = false;
      setTimeout(() => {
        if(chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, 0);
    }
  }
</script>

<main class="min-h-screen bg-gray-50 py-10 px-4">
  <!-- Room Header -->
  <div class="max-w-7xl mx-auto flex justify-between items-center mb-8">
    <div>
      <h1 class="text-4xl font-bold text-indigo-600">Room: {data.room?.code}</h1>
      <p class="text-gray-600 mt-1">Currently in room <span class="font-semibold">{data.room?.name}</span></p>
    </div>
    <button
      on:click={leaveRoom}
      class="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
    >
      Leave Room
    </button>
  </div>

  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-2xl font-bold mb-4">🔥 Today's Challenge</h2>
        {#if data.dailyChallenge?.question}
          <p class="text-lg font-semibold">{data.dailyChallenge.question.title}</p>
          <p class="text-sm text-gray-500 mb-4">{data.dailyChallenge.question.difficulty}</p>
          <a
            href={"https://leetcode.com" + data.dailyChallenge.link}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-auto inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            View on LeetCode →
          </a>
        {:else}
          <p class="text-gray-500">Could not load the daily challenge.</p>
        {/if}
      </div>
<!--leaderboard code-->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
        <ul class="space-y-2">
          {#if data.leaderboard && data.leaderboard.length > 0}
            {#each data.leaderboard as user, i}
              <li class="flex justify-between items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                <span>
                  {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}{user.username}
                </span>
                <span class="font-semibold">{user.solved} solved</span>
              </li>
            {/each}
          {:else}
            <p class="text-gray-500">No members in this room yet.</p>
          {/if}
        </ul>
      </div>
    </div>

    <!--chatrbox-->
    <div class="bg-white rounded-xl shadow p-6 flex flex-col h-[65vh]">
      <h2 class="text-2xl font-bold mb-4 border-b pb-2">🤖 AI Assistant</h2>
      <div bind:this={chatContainer} class="flex-1 overflow-y-auto pr-2 space-y-4">
        {#each messages as message}
          <div class="flex gap-3 {message.role === 'user' ? 'justify-end' : ''}">
            {#if message.role === 'assistant'}
              <div class="bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">🤖</div>
            {/if}
            <div class="max-w-xs md:max-w-sm rounded-lg px-4 py-2 {message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}">
              {message.content}
            </div>
          </div>
        {/each}

        {#if isLoading}
          <div class="flex gap-3">
            <div class="bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">🤖</div>
            <div class="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
              </div>
            </div>
          </div>
        {/if}
      </div>
       {#if chatErrorMessage}
        <p class="text-red-500 text-sm mt-2">{chatErrorMessage}</p>
      {/if}
      <div class="mt-4 flex items-center gap-2">
        <input
          bind:value={userInput}
          on:keydown={handleSendMessage}
          type="text"
          placeholder="Ask a question..."
          class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled={isLoading}
        />
        <button on:click={handleSendMessage} class="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400" disabled={isLoading}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  </div>
</main>



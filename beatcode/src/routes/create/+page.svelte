<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';

  let roomName = '';
  let errorMessage = '';
  let isLoading = false;
    //randomcode generate
  function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
//create room with name and code
  async function createRoom() {
    if (!roomName.trim()) {
      errorMessage = 'Please enter a room name.';
      return;
    }
    
    isLoading = true;
    errorMessage = '';

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        errorMessage = "You must be logged in to create a room.";
        isLoading = false;
        goto('/login');//if not auth go back to login
        return;
      }
      
      const newCode = generateRoomCode();

      //insert room into dbbb
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: roomName.trim(),
          code: newCode,
          created_by: user.id //id of creator
        })
        .select('code')
        .single();

      if (error) {
        //if it randomly generates a duplicate code just in case
        if (error.code === '23505') { 
          errorMessage = 'An error occurred generating a unique code. Please try again.';
        } else {
          throw error;
        }
      }
      
      if (data) {
        // if successsful just redirect to the room page wihtout needing to fetch id
        goto(`/room/${data.code}`);
      }
    } catch (err) {
      console.error('Error creating room:', err);
      errorMessage = err.message || 'An unexpected error occurred. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
  <div class="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-indigo-600">Create a New Room</h1>
      <p class="text-gray-600 mt-2">Give your room a name to get started.</p>
    </div>

    <form on:submit|preventDefault={createRoom} class="space-y-4">
      <div>
        <label for="roomName" class="sr-only">Room Name</label>
        <input
          bind:value={roomName}
          type="text"
          id="roomName"
          placeholder="e.g., Weekend Warriors"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled={isLoading}
          required
        />
      </div>
      {#if errorMessage}
        <p class="text-red-500 text-sm text-center">{errorMessage}</p>
      {/if}
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center disabled:bg-indigo-400"
        disabled={isLoading}
      >
        {#if isLoading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating...
        {:else}
          Create Room
        {/if}
      </button>
    </form>
        <!--back to dashboard button-->
    <button
      on:click={() => goto('/home')}
      class="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
      disabled={isLoading}
    >
      Back to Dashboard
    </button>
  </div>
</div>
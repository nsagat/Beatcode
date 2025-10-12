<script>
  import { signIn } from "$lib/auth" 
  import { goto } from '$app/navigation'; 

  let username = "";
  let password = "";

  async function handleLogin() {
    try {
      const { user } = await signIn(username, password);
      console.log('Logged in as:', user);
      goto('/home'); 
    } catch (err) {
      console.log(err);
    }
  };

</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
    <h1 class="text-3xl font-bold text-center text-indigo-600">🧠 LeetSync</h1>
    <p class="text-center text-gray-500">Log in to track your coding progress</p>

    <form class="space-y-4" on:submit|preventDefault={handleLogin}>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          bind:value={username}
          placeholder="youremail"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <!-- Login Button -->
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Log In
      </button>
     
    </form>

    <p class="text-center text-gray-500 text-sm">
      Don’t have an account?
      <a href="/register" class="text-indigo-600 hover:underline">Sign up</a>
    </p>
  </div>
</div>

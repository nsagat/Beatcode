<script>
  import { signUp } from "$lib/auth";
  import { goto } from '$app/navigation';

  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let errorMessage = "";
  let loading = false;

  async function handleRegister(e) {
    e.preventDefault();

    // Reset previous error
    errorMessage = "";

    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match!";
      return;
    }

    loading = true;
    try {
      const { user } = await signUp(email, password, username);
      if (user) {
        goto('/login');
      } else {
        errorMessage = "Registration failed. Please try again.";
      }
    } catch (err) {
      errorMessage = err?.message || "An unknown error occurred.";
      console.error(err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
    <h1 class="text-3xl font-bold text-center text-indigo-600">🧠 LeetSync</h1>
    <p class="text-center text-gray-500">Create an account to track your coding progress</p>

    {#if errorMessage}
      <p class="text-red-600 text-center text-sm">{errorMessage}</p>
    {/if}

    <form class="space-y-4" on:submit|preventDefault={handleRegister}>
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="you@example.com"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <!-- LeetCode Username -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="username">Leetcode username</label>
        <input
          id="username"
          bind:value={username}
          placeholder="LeetCode"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          placeholder="••••••••"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <!-- Register Button -->
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {#if loading}
          Registering...
        {:else}
          Register
        {/if}
      </button>
    </form>

    <p class="text-center text-gray-500 text-sm">
      Already have an account?
      <a href="/login" class="text-indigo-600 hover:underline">Log in</a>
    </p>
  </div>
</div>

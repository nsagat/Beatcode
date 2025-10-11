<script>
  const goToLogin = () => {
    // Redirect to login page
    window.location.href = "/login";
  };

  const goToRegister = () => {
    // Redirect to registration / Google OAuth
    window.location.href = "/register";
  };
</script>

<div class="min-h-screen bg-indigo-50 flex flex-col items-center justify-center px-4 text-center">
  <!-- App Name / Hero -->
  <h1 class="text-5xl font-bold text-indigo-600 mb-4">🧠 LeetSync</h1>
  <p class="text-gray-700 mb-12 max-w-md">
    Track your LeetCode progress with friends. Stay consistent, solve daily challenges, and level up together.
  </p>

  <!-- Call-to-Action Buttons -->
  <div class="flex flex-col md:flex-row gap-6">
    <button
      on:click={goToLogin}
      class="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
    >
      Log In
    </button>

    <button
      on:click={goToRegister}
      class="px-8 py-4 border border-indigo-600 text-indigo-600 rounded-lg text-lg font-semibold hover:bg-indigo-100 transition"
    >
      Create Account
    </button>
  </div>

</div>

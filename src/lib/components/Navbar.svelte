<script lang="ts">
    import state from "$lib/state.svelte";
</script>

<nav class="p-2 px-3 w-full h-fit border-b flex">
    <h1 class="text-2xl font-bold fancy hidden md:block">Fractal</h1>

    <div class="md:ml-auto my-auto text-lg">
        <a class="text-text! hover:underline" href="/">Home</a>
        <p class="inline mx-2 text-black/50">/</p>
        <a class="text-text! hover:underline" href="/pricing">Pricing</a>
    </div>

    <button
        class="ml-auto text-lg font-semibold px-2 bg-brown text-white rounded-md"
        on:click={() => {
            if (state.user) {
                window.location.href = "/dash/orgs";
            } else {
                window.location.href = "/login";
            }
        }}
    >
        {state.user ? "Dashboard" : "Login"}
    </button>
</nav>
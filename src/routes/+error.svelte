<script lang="ts">
  import { page } from "$app/state";
</script>

<div class="flex flex-col h-screen">
  <div class="m-auto rounded-md bg-base p-4 border font-semibold">
    <h1 class="text-3xl text-red">Error {page.status}: {page.error.message}</h1>
    <a href="/" class="text-center text-blue mt-4 hover:underline">
        Go back to home
    </a>
  </div>
</div>
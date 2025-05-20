<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="w-full h-full flex flex-col bg-base rounded-md border border-black/40">
    <Navbar />

    <div class="p-2 px-3 w-full flex">
        <h1 class="text-4xl mx-auto mt-8 flex">
          The email service you have 
          <p class="ml-2 text-4xl font-bold italic">
            dreamed of
          </p>
        </h1>
    </div>

    <Footer />
</div>
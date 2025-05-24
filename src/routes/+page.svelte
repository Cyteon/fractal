<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="w-full h-full flex flex-col bg-base rounded-md border">
    <Navbar />

    <div class="p-2 px-3 w-full flex flex-col text-center">
        <h1 class="text-4xl mx-auto mt-8 flex md:flex-row flex-col">
          The email service you have 
          <p class="md:ml-2 text-4xl font-bold italic fancy">
            dreamed of
          </p>
        </h1>

        <p class="text-xl mx-auto">
          Marketing emails, newsletters and analytics reimagined.
        </p>
    </div>

    <Footer />
</div>
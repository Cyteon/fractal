<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import state from '$lib/state.svelte';

  const pricingData = [
    {
      name: "Fractal", price: 6, color: "bg-blue-500"
    },
    {
      name: "Loops", price: 49, color: "bg-green-500"
    },
    {
      name: "Mailchimp", price: 100, color: "bg-yellow-500"
    }
  ]
</script>

<div class="w-full min-h-full flex flex-col bg-base rounded-md border">
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

        <button
          class="mt-4 px-4 py-2 bg-brown text-white rounded-md text-lg font-semibold mx-auto"
          on:click={() => {
            if (state.user) {
              window.location.href = "/dash/orgs";
            } else {
              window.location.href = "/login";
            }
          }}
        >
          {state.user ? "Open Dashboard" : "Get Started"} 
        </button>
        
        <div class="flex flex-col md:flex-row my-16 text-start justify-center">
          <div class="p-2 px-4 border border-dashed rounded-md md:w-1/3">
            <h1 class="font-bold text-2xl">We wont steal your money</h1>
            <p class="text-sm">Pricing in USD for 5000 contacts, 20000 email sends</p>

            {#each pricingData as item}
              <div class="flex my-2">
                <span style={`width: ${item.price}%;`} class={`flex min-w-fit rounded-md ${item.color}`}>
                  <span class="text-white text-center px-2 my-auto">
                    ${item.price}/mo
                  </span>
                </span>
                <span class="text-lg ml-2">{item.name}</span>
              </div>
            {/each}

            <a href="/pricing" class="mt-3 hover:underline">
              Expore pricing ->
            </a>
          </div>
        </div>
    </div>

    <Footer />
</div>
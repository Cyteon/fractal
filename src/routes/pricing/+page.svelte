<script lang="ts">
    import { goto } from "$app/navigation";
    import { Check, X } from "@lucide/svelte";
    import Navbar from "$lib/components/Navbar.svelte";
</script>

<div class="bg-base w-full rounded-md border flex flex-col" style="min-height: 100%;">
    <Navbar />
    
    <div class="flex m-auto md:space-x-4 space-y-4 md:space-y-0 flex-col md:flex-row w-full md:w-2/3">
        <div class="p-4 px-6 rounded-md border border-dashed w-full flex flex-col">
            <h1 class="text-3xl font-bold fancy">Basic Tier</h1>
            <p class="text-lg">The tier for all your basic needs.</p>
            <p class="text-lg mt-4">You will prepay for credits used to send emails, 0.3$/1000 emails</p>

            <h2 class="text-2xl font-bold mt-4">Features</h2>

            <div class="text-green mb-4">
                <p class="flex"><Check size="18" class="my-auto mr-1" /> Competitive pricing</p>
                <p class="flex"><Check size="18" class="my-auto mr-1" /> 3 team members</p>
                <p class="flex"><Check size="18" class="my-auto mr-1" /> 3 domains</p>
                <p class="flex text-red"><X size="18" class="my-auto mr-1" /> Max 5000 contacts</p>
                <p class="flex text-red"><X size="18" class="my-auto mr-1" /> Prepaid usage only</p>
                <p class="flex text-red"><X size="18" class="my-auto mr-1" /> No priority support</p>
            </div>

            <button 
                class="p-2 rounded-md bg-brown text-white w-full font-semibold text-lg mt-auto disabled:opacity-50 disabled:cursor-not-allowed!"
                onclick={ () => { goto("/register") } }
            >
                Get Started
            </button>
        </div>

        <div class="p-4 px-6 rounded-md border border-dashed w-full flex flex-col">
            <h1 class="text-3xl font-bold fancy">Enterprise Tier</h1>
            <p class="text-lg">A tier built for your business needs.</p>
            
            <p class="mt-4 text-sm">Starting at</p>
            <h2 class="text-2xl font-bold mt-[-4px]">5$/month</h2>
            <p style="margin-top: -4px;">+ 0.2$/1000 emails</p>
            <p style="margin-top: -4px;">+ 0.1$/1000 contacts</p>

            <h2 class="text-2xl font-bold mt-4">Features</h2>

            <div class="text-green mb-4">
                <p class="flex"><Check size="18" class="my-auto mr-1" /> 10000 contacts included</p>
                <p class="flex"><Check size="18" class="my-auto mr-1" /> Pay as you go</p>
                <p class="flex"><Check size="18" class="my-auto mr-1" /> Priority support</p>
                <p class="flex"><Check size="18" class="my-auto mr-1" /> Custom solutions</p>
                <p class="flex"><Check size="18" class="my-auto mr-1" /> Unlimited team members</p>
                <p class="flex"><Check size="18" class="my-auto mr-1" /> Unlimited domains</p>
            </div>

            <a 
                class="p-2 rounded-md bg-brown text-white! text-center w-full font-semibold text-lg mt-auto hover:cursor-pointer"
                href="/enterprise"
            >
                Contact Us
            </a>
        </div>
    </div>
</div>
<script lang="ts">
    import Sidebar from "$lib/components/Sidebar.svelte";
    import CreditsBilling from "$lib/components/views/CreditsBilling.svelte";
    import state_ from "$lib/state.svelte";
    import { Check, X } from "@lucide/svelte";
    import { untrack } from "svelte";
    let { data } = $props();

    let org = $state({});
    let subscription = $state({});
    let loading = $state(false);
    let forceShowPlans = $state(false);

    $effect(() => {
        org = state_.orgs.find((o) => o.slug === data.slug) || {};
    })

    async function enableBasicTier() {
        loading = true;

        try {
            const res = await fetch(`/api/v1/orgs/${org.slug}/subscription`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "BASIC",
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to enable basic tier: " + await res.text());
            }

            const subData = await res.json();
            subscription = subData.subscription || {};
            loading = false;
            org.billingType = "BASIC";
        } catch (e) {
            console.error("Failed to enable basic tier", e);
            throw e; // so gets logged in sentry, i guess
        }
    }
</script>

<div class="w-full h-full flex bg-base rounded-md border border-">
    <Sidebar {org} />

    {#if state_.finishedLoading && !loading}
        <div class="p-2 px-4 flex flex-col w-full">
            <h1 class="text-3xl font-bold mb-4 fancy flex">
                Billing     
                
                {#if org.billingType != "NONE"}
                    <button class="ml-auto text-[1rem] font-normal my-auto hover:underline" onclick={() => { forceShowPlans = !forceShowPlans; }}>
                        {forceShowPlans ? "Go back" : "Explore other tiers"}
                    </button>
                {/if}
            </h1>
            
            {#if org.role === "OWNER" || org.role === "ADMIN"}
                {#if org.billingType == "CREDITS" && !forceShowPlans}
                    <CreditsBilling {org} />
                {:else}
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
                                onclick={enableBasicTier}
                                disabled={org.billingType == "CREDITS" || loading}
                            >
                                {org.billingType == "CREDITS" ? "Current Tier" : "Get Started"}
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
                                href={`/dash/${org.slug}/billing/enterprise`}
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                {/if}
            {:else}
                <div class="m-auto p-4 px-6 rounded-md border border-dashed">
                    <h1 class="text-3xl font-bold fancy">Billing Information</h1>
                    <p class="text-lg">You need to be an owner or admin to view billing information.</p>
                </div>
            {/if}
        </div>
    {:else}
        <div class="m-auto p-4">
            <p class="text-lg">Loading...</p>
        </div>
    {/if}
</div>
<script lang="ts">
    import { goto } from "$app/navigation";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import state_ from "$lib/state.svelte";
    import { Check } from "@lucide/svelte";
    import { PUBLIC_POLAR_PRODUCT_BASIC_TIER } from "$env/static/public";
    import { untrack } from "svelte";
    let { data } = $props();

    let org = $state({});
    let subscription = $state({});
    let finishedLoadingSub = $state(false);

    $effect(() => {
        let newOrg = state_.orgs.find((o) => o.slug === data.slug) || {};

        untrack(async () => {
            if (newOrg && newOrg.id != org.id) {
                org = newOrg;

                if (newOrg.role === "OWNER" || newOrg.role === "ADMIN") {
                    try {
                        const res = await fetch(
                            `/api/v1/orgs/${newOrg.slug}/subscription`,
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        if (!res.ok) {
                            throw new Error("Failed to fetch subscription data");
                        }

                        const subData = await res.json();
                        subscription = subData.subscription || {};
                        finishedLoadingSub = true;
                    } catch (e) {
                        console.error("Failed to fetch subscription data", e);
                    }
                }
            }
        });
    })
</script>

<div class="w-full h-full flex bg-base rounded-md border border-">
    <Sidebar {org} />

    {#if state_.finishedLoading && finishedLoadingSub}
        <div class="p-2 px-4 flex flex-col w-full">
            <h1 class="text-3xl font-bold mb-4 fancy">
                Billing
            </h1>
            
            {#if org.role === "OWNER" || org.role === "ADMIN"}
                {#if org.subscribed}
                    <div class="border border-dashed w-full md:w-1/3 p-2 px-4 rounded-md">
                        <div class="flex">
                            <h1 class="font-semibold text-2xl">Current Plan</h1>
                            <p class="ml-auto my-auto">Next Invoice - 
                                {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric"
                                })}
                            </p>
                        </div>

                        <div class="flex">
                            <p class="text-lg">
                                {subscription.name}
                            </p>
                            <p class="ml-auto my-auto text-lg">
                                {subscription.amount > 0 ? `${subscription.amount}` : "Free"}
                            </p>
                        </div>

                        <p class="text-lg font-semibold my-2">
                            Metered Usage
                        </p>

                        {#each subscription.meters as meter}
                            <div class="flex">
                                <p class="text-lg">
                                    {meter.name}
                                </p>
                                <p class="ml-auto my-auto text-lg">
                                            {(meter.consumedUnits * meter.price).toFixed(2)}$
                                        </p>
                                    </div>
                            <p class="text-sm mt-[-8px] mb-2">
                                {meter.price*1000}$/1000
                            </p>
                        {/each}

                        <hr class="my-2 border-dotted" />

                        <div class="flex">
                            <p class="text-lg font-semibold">
                                Total
                            </p>
                            <p class="ml-auto my-auto text-lg font-semibold">
                                {(subscription.amount + subscription.meters?.reduce((acc, meter) => acc + (meter.consumedUnits * meter.price), 0)).toFixed(2)}$
                            </p>
                        </div>
                    </div>
                {:else}
                    <div class="m-auto p-4 px-6 rounded-md border border-dashed">
                        <h1 class="text-3xl font-bold fancy">Basic Tier</h1>
                        <p class="text-lg">The tier for all your basic needs.</p>

                        <p class="mt-4 text-sm">Starting at</p>
                        <h2 class="text-2xl font-bold mt-[-4px]">0$/month</h2>
                        <p style="margin-top: -4px;">+ 0.2$/1000 emails</p>
                        <p style="margin-top: -4px;">+ 1$/1000 contacts</p>

                        <button 
                            class="p-2 rounded-md bg-brown text-white w-full font-semibold text-lg mt-6"
                            onclick={() => {
                                let metadata = encodeURIComponent(
                                    JSON.stringify({
                                        orgId: org.id,
                                        responsibleUserId: state_.user?.id || "UNKNOWN",
                                    })
                                );

                                console.log(metadata);


                                goto(
                                    `/api/v1/billing/checkout?products=${PUBLIC_POLAR_PRODUCT_BASIC_TIER}&customerExternalId=${org.id}&metadata=${metadata}`
                                );
                            }}
                        >
                            Proceed to Checkout
                        </button>

                        <h2 class="text-2xl font-bold mt-4">Features</h2>

                        <div class="text-green">
                            <p class="flex"><Check size="18" class="my-auto mr-1" /> First 1000 contacts free</p>
                            <p class="flex"><Check size="18" class="my-auto mr-1" /> Unlimited team members</p>
                            <p class="flex"><Check size="18" class="my-auto mr-1" /> 3 domains</p>
                            <p class="flex"><Check size="18" class="my-auto mr-1" /> Email-based support</p>
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
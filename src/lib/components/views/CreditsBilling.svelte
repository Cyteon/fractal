<script lang="ts">
    import { goto } from "$app/navigation";
    import { untrack } from "svelte";
    import { getCookie } from "typescript-cookie";

    let { org } = $props();
    let data = $state({});

    let buyCreditsAmount = $state(5000);

    $effect(() => {
        if (org && org.billingType == "CREDITS") {
            untrack(async () => {
                try {
                    const res = await fetch(
                        `/api/v1/orgs/${org.slug}/credits`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${getCookie("token")}`,
                            },
                        }
                    );

                    if (res.status != 404 && !res.ok) {
                        throw new Error(
                            `Failed to fetch credits data: ${res.status} ${res.statusText} - ${await res.text()}`
                        );
                        
                    }

                    data = await res.json();

                    console.log("Fetched credits data:", data);
                } catch (e) {
                    console.error("Error fetching credits data", e);
                }
            })
        }
    });
</script>

<div class="w-full h-full">
    <div class="border border-dashed w-full md:w-1/3 p-2 px-4 rounded-md">
        <h1 class="font-semibold text-2xl">Basic Tier</h1>
        <p>1 credit = 1 email sent</p>

        <h2 class="text-xl font-semibold mt-4">Credits Usage</h2>

        <p class="flex">Credits Bought: <span class="ml-auto font-semibold">{data.creditsBought} credits</span></p>
        <p class="flex">Credits Used: <span class="ml-auto font-semibold">{data.creditsUsed} credits</span></p>

        <hr class="my-2 border-dashed" />

        <p class="flex">Credits Remaining: <span class="ml-auto font-semibold">{data.creditsBalance} credits</span></p>

        <div class="flex mt-4 md:space-x-2 space-y-2 md:space-y-0 md:flex-row flex-col">
            <select
                class="border rounded-md p-2 w-full"
                bind:value={buyCreditsAmount}
            >
                <option value={5000}>5,000 credits</option>  
            </select>

            <button class="w-full bg-brown p-2 rounded-md text-white" onclick={() => { goto(`/api/v1/orgs/${org.slug}/credits/buy?amount=${buyCreditsAmount}`); }}>
                Purchase Credits
            </button>
        </div>
    </div>
</div>
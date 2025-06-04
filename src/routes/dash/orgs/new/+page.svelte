<script lang="ts">
    import { goto } from "$app/navigation";
    import state from "$lib/state.svelte";
    import { getCookie } from "typescript-cookie";

    let name: string = "";
    let slug: string = "";
    let error: string = "";

    async function createOrg() {
        if (!name || !slug) {
            error = "Invalid name or slug.";
            return;
        }

        if (slug === "orgs") {
            error = "'orgs' is a reserved slug.";
            return;
        }

        try {
            const res = await fetch("/api/v1/orgs", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getCookie("token")}`,
                },
                body: JSON.stringify({
                    name,
                    slug,
                }),
            });

            let data = await res.json();

            if (res.ok) {
                data.role = "OWNER";
                data.billingType = "NONE";
                state.orgs = [...state.orgs, data];

                goto("/dash/orgs");
            } else {
                error = data.error;

                if (!error) {
                    error = "An unexpected error occurred.";
                }
            }
        } catch (err) {
            console.error(err);
            error = "An error occurred. Please try again.";
            
            throw err;
        }
    }
</script>

<div class="flex h-full">
    <div class="p-4 m-auto w-full md:w-1/4 flex flex-col bg-base rounded-md border border-black/40">
        <h1 class="text-2xl font-bold mb-4">Create a new Organization</h1>

        <input type="text" bind:value={name} placeholder="Organization Name" class="mb-2" />
        <input type="text" bind:value={slug} placeholder="Organization Slug" class="mb-2" />

        <p class="text-red-500 mb-2">{error}</p>

        <button class="text-white bg-brown p-2 rounded-md font-semibold" on:click={createOrg}>
            Create
        </button>

        <a href="/dash/orgs" class="text-sm mt-3 hover:underline">
            Go back to Organizations
        </a>
    </div>
</div>  
<script lang="ts">
    import { goto } from "$app/navigation";
    import state from "$lib/state.svelte";
</script>

<div class="flex h-full">
    <div class="p-4 m-auto w-full md:w-1/4 flex flex-col bg-base rounded-md border border-black/40">
        <h1 class="text-2xl font-bold mb-2">Select an Organization</h1>
        
        {#each state.orgs as org}
            <div class="p-2 border rounded-md mb-2 flex">
                <div>
                    <h1 class="text-xl font-bold">{org.name}</h1>
                    <p class="text-sm font-semibold">Slug: {org.slug}</p>
                    <p class="text-sm font-semibold">Role: {org.role.toLowerCase()}</p>
                </div>

                <button class="ml-auto my-auto text-white bg-brown p-2 rounded-md font-semibold" on:click={() => { 
                    state.currentOrg = org;
                    localStorage.setItem("currentOrg", org.slug);

                    goto("/dash/" + org.slug);
                }}>
                    Select
                </button>
            </div>
        {/each}

        <button class="text-white bg-brown p-2 rounded-md font-semibold" on:click={() => { goto("/dash/orgs/new") }}>
            Create a new Organization
        </button>
    </div>
</div>  
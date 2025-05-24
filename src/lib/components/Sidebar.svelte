<script lang="ts">
    import { ArrowLeftRight } from "@lucide/svelte";

    let { org } = $props();
</script>

<style>
    .sidebar-tab {
        display: flex;
        color: var(--color-text);
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        transition: background-color 0.2s ease; 
    }
</style>

<nav class="border-r border-dashed h-full flex flex-col text-lg w-32">
    <div class="px-4 py-1 border-b border-dashed flex">
        <h1 class="text-2xl font-semibold my-auto fancy">{org.name}</h1>

        <a href="/dash/orgs" class="ml-auto mt-2.5">
            <ArrowLeftRight size="16" class="text-text" />
        </a>
    </div>

    <div class="px-2 py-2 h-full flex flex-col">
        <a class="sidebar-tab hover:bg-black/10" href={`/dash/${org.slug}`}>
            Home
        </a>

        <a class="sidebar-tab hover:bg-black/10" href={`/dash/${org.slug}/billing`}>
            Billing
        </a>
    </div>
</nav>
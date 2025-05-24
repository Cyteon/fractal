<script lang="ts">
    import Sidebar from "$lib/components/Sidebar.svelte";
    import state_ from "$lib/state.svelte";
    import { onMount } from "svelte";
    let { data } = $props();

    let org = $state({});

    $effect(() => {
        org = state_.orgs.find((o) => o.slug === data.slug);
    })
</script>

<div class="w-full h-full flex bg-base rounded-md border">
    <Sidebar {org} />
</div>
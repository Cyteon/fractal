<script lang="ts">
    import { goto } from "$app/navigation";
    import state from "$lib/state.svelte";
    import { browser } from "$app/environment";

    if (browser) {
        if (state.currentOrg) {
            goto("/dash/" + state.currentOrg.slug);
        } else {
            let slug = localStorage.getItem("currentOrg");

            if (slug) {
                goto("/dash/" + slug);
            } else {
                goto("/dash/orgs");
            }
        }
    }
</script>
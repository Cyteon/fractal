<script lang="ts">
	import "../app.css";
	import { 
		PUBLIC_SITE_DOMAIN, 
		PUBLIC_PLAUSIBLE_HOST,
		PUBLIC_PLAUSIBLE_ENABLED
	} from "$env/static/public";
    import { browser } from "$app/environment";
	import { getCookie } from "typescript-cookie";
    import state from "$lib/state.svelte";
    import { onMount } from "svelte";
	
	if (browser && PUBLIC_PLAUSIBLE_ENABLED == "true") {
		let script = document.createElement("script");
		script.setAttribute("data-domain", PUBLIC_SITE_DOMAIN);
		script.setAttribute("src", `${PUBLIC_PLAUSIBLE_HOST}/js/script.js`);
		script.setAttribute("defer", "true");
		document.head.appendChild(script);
	}

	onMount(async () => {
		if (browser) {
			const cookie = getCookie("token");

			if (!state.user) {
				if (cookie) {
					const res = await fetch("/api/v1/auth/me", {
						headers: {
							Authorization: `Bearer ${cookie}`,
						},
					});

					if (res.ok) {
						const data = await res.json();
						state.user = data.user;
						state.orgs = data.orgs;
						state.finishedLoading = true;

						if (
							(!localStorage.getItem("currentOrg") || data.orgs.length == 0)
							&& window.location.pathname.startsWith("/dash") 
							&& !window.location.pathname.startsWith("/dash/orgs")
						) {
							window.location.href = "/dash/orgs";
						} else if (window.location.pathname == "/login" || window.location.pathname == "/register") {
							window.location.href = "/dash/orgs";
						}
					} else {
						if (window.location.pathname.startsWith("/dash")) {
							window.location.href = "/login";
						}
					}
				} else {
					if (window.location.pathname.startsWith("/dash")) {
						window.location.href = "/login";
					}
				}
			}
		}
	})

	let { children } = $props();
</script>

{@render children()}

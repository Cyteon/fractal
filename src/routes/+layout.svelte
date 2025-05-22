<script lang="ts">
	import "../app.css";
	import { 
		PUBLIC_SITE_DOMAIN, 
		PUBLIC_PLAUSIBLE_HOST,
		PUBLIC_PLAUSIBLE_ENABLED
	} from "$env/static/public";
    import { browser } from "$app/environment";
	import { getCookie } from "typescript-cookie";
	
	if (browser && PUBLIC_PLAUSIBLE_ENABLED == "true") {
		let script = document.createElement("script");
		script.setAttribute("data-domain", PUBLIC_SITE_DOMAIN);
		script.setAttribute("src", `${PUBLIC_PLAUSIBLE_HOST}/js/script.js`);
		script.setAttribute("defer", "true");
		document.head.appendChild(script);

		const cookie = getCookie("token");

		if (cookie) {
			
		} else {
			if (window.location.pathname.startsWith("/dash")) {
				window.location.href = "/login";
			}
		}
	}

	let { children } = $props();
</script>

{@render children()}

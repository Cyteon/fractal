import { Checkout } from "@polar-sh/sveltekit";
import { POLAR_ACCESS_TOKEN, BASE_URL, POLAR_ENVIRONMENT } from "$env/static/private";

export const GET = Checkout({
  accessToken: POLAR_ACCESS_TOKEN,
  successUrl: BASE_URL + "/api/v1/billing/callback",
  server: POLAR_ENVIRONMENT as "production" | "sandbox",
});
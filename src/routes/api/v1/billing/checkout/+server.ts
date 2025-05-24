import { Checkout } from "@polar-sh/sveltekit";
import { POLAR_ACCESS_TOKEN, POLAR_SUCCESS_URL, POLAR_ENVIRONMENT } from "$env/static/private";

export const GET = Checkout({
  accessToken: POLAR_ACCESS_TOKEN,
  successUrl: POLAR_SUCCESS_URL,
  server: POLAR_ENVIRONMENT as "production" | "sandbox",
});
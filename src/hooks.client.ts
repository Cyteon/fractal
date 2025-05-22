import { handleErrorWithSentry, replayIntegration } from "@sentry/sveltekit";
import { dev } from "$app/environment";
import { PUBLIC_SENTRY_DSN } from "$env/static/public";
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: dev ? "development" : "production",
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();

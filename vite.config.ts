import { sentrySvelteKit } from "@sentry/sveltekit";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const org = env.PUBLIC_SENTRY_ORG;
  const project = env.PUBLIC_SENTRY_PROJECT;
  const url = env.PUBLIC_SENTRY_URL;

  return defineConfig({
    plugins: [sentrySvelteKit({
      sourceMapsUploadOptions: {
        org,
        project,
        url
      }
    }), tailwindcss(), sveltekit()],
  });
}
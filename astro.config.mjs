import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';
import serviceWorker from "astrojs-service-worker";

// https://astro.build/config
export default defineConfig({
  adapter: vercel({
    edgeMiddleware: true
  }),
  integrations: [solidJs(), tailwind(), serviceWorker()],
  output: 'server'
});

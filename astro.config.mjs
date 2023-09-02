import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import vercelEdge from '@astrojs/vercel/edge';
import { defineConfig } from 'astro/config';
import serviceWorker from "astrojs-service-worker";

// https://astro.build/config
export default defineConfig({
  adapter: vercelEdge(),
  integrations: [solidJs(), tailwind(), serviceWorker()],
  output: 'server'
});

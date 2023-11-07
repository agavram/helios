import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify/functions";
import { defineConfig } from 'astro/config';
import serviceWorker from "astrojs-service-worker";

// https://astro.build/config
export default defineConfig({
  adapter: netlify({
    edgeMiddleware: true
  }),
  integrations: [solidJs(), tailwind(), serviceWorker()],
  output: 'server'
});

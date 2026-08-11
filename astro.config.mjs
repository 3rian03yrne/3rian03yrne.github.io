// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://3rian03yrne.github.io/",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--font-fraunces",
      fallbacks: ["serif"],
      weights: [300],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.google(),
      name: "DM Mono",
      cssVariable: "--font-dm-mono",
      fallbacks: ["monospace"],
      weights: [300, 400],
      styles: ["normal"],
    },
  ],
});

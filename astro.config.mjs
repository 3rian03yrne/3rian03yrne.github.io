// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://3rian03yrne.github.io/",
  integrations: [
    mdx(),
    // /styleguide is a real, built route so `astro check` and `pnpm build`
    // cover it, but it is internal — keep it out of the sitemap.
    sitemap({ filter: (page) => !page.includes("/styleguide") }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // The PADD Terminal design system's two families. Registered here so Astro
  // self-hosts them, rather than the design system's Google Fonts @import.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Michroma",
      cssVariable: "--font-michroma",
      fallbacks: ["sans-serif"],
      weights: [400],
      styles: ["normal"],
    },
    // Listed twice so only italic 400 is downloaded, rather than an italic
    // cut of every weight.
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      fallbacks: ["monospace"],
      weights: [400, 500, 700],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      fallbacks: ["monospace"],
      weights: [400],
      styles: ["italic"],
    },
  ],
});

// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://3rian03yrne.github.io/",
  integrations: [
    mdx(),
    sitemap({
      // /styleguide is an internal reference page for the terminal components —
      // it is built and deployed, but it is not part of the site's content.
      filter: (page) => page !== "https://3rian03yrne.github.io/styleguide/",
    }),
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

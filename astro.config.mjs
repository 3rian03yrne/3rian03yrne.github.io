// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://3rian03yrne.github.io/',
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Atkinson Hyperlegible',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			weights: [400, 700],
			styles: ['normal'],
		},
	],
});
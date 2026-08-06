import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			category: z.string().optional(),
		}),
});

const projects = defineCollection({
	// Load Markdown files in the `src/content/projects/` directory.
	loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Short blurb for homepage "Featured" cards
			tagline: z.string().optional(),
			featured: z.boolean().default(false),
			appIcon: image(),
			screenshot: image().optional(),
			screenshotAlt: z.string().optional(),
			status: z.enum(['available', 'coming_soon']).optional(),
			appStoreUrl: z.string().url().optional(),
			contactEmail: z.string().email().optional(),
			// Path into public/, e.g. "/privacy-policy.pdf" — not run through the image() pipeline
			privacyPolicy: z.string().optional(),
		}),
});

export const collections = { blog, projects };

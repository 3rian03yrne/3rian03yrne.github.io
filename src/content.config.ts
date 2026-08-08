import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
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
			// Short blurb shown in place of `description` in the stream listings
			tagline: z.string().optional(),
			appIcon: image(),
			screenshot: image().optional(),
			screenshotAlt: z.string().optional(),
			status: z.enum(['available', 'coming_soon']).optional(),
			// When the app entered the homepage stream — its ship date. Undated
			// projects are treated as "in build" and lead the stream; see
			// src/lib/stream.ts.
			shipDate: z.coerce.date().optional(),
			appStoreUrl: z.string().url().optional(),
			contactEmail: z.string().email().optional(),
			// Path into public/, e.g. "/privacy-policy.pdf" — not run through the image() pipeline
			privacyPolicy: z.string().optional(),
		})
			// `isShipped` in src/lib/stream.ts treats a project as shipped only when it is
			// not `coming_soon` *and* carries a `shipDate`. Without these checks a project
			// could set `appStoreUrl` — rendering the download badge — while the copy
			// around it still read "WIP · in build · Coming soon".
			.superRefine((project, ctx) => {
				const shipped = project.status !== 'coming_soon' && project.shipDate !== undefined;
				if (project.status === 'available' && project.shipDate === undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['shipDate'],
						message: "A project with status 'available' must also set a shipDate.",
					});
				}
				if (project.appStoreUrl !== undefined && !shipped) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['appStoreUrl'],
						message:
							"appStoreUrl is only valid on a shipped project (status not 'coming_soon', shipDate set).",
					});
				}
			}),
});

export const collections = { blog, projects };

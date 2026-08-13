import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SITE_TITLE } from "./consts";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.optional(image()),
        category: z.string().optional(),
        // Defaults to the site owner since this is a single-author blog;
        // override per-post for a guest byline.
        author: z.string().default(SITE_TITLE),
        // Marks this post as the announcement/changelog entry for one app
        // version, e.g. a "Penobscot Moon v1.1" post. Both fields are set
        // together or not at all — see the refinement below.
        releaseProject: reference("projects").optional(),
        releaseVersion: z.string().optional(),
      })
      .superRefine((post, ctx) => {
        if (
          (post.releaseProject === undefined) !==
          (post.releaseVersion === undefined)
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["releaseVersion"],
            message:
              "releaseProject and releaseVersion must both be set together, or both omitted.",
          });
        }
      }),
});

const projects = defineCollection({
  // Load Markdown files in the `src/content/projects/` directory.
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        // Short blurb shown in place of `description` in the stream listings
        tagline: z.string().optional(),
        appIcon: image(),
        screenshot: image().optional(),
        screenshotAlt: z.string().optional(),
        status: z.enum(["available", "coming_soon"]).optional(),
        // When the app entered the homepage stream — its ship date. Undated
        // projects are treated as "in build" and lead the stream; see
        // src/lib/stream.ts.
        shipDate: z.coerce.date().optional(),
        // Sort-only date for a WIP project (no shipDate yet) — e.g. when it was
        // added to the stream. Keeps it in chronological position instead of
        // leading the stream, without implying it has shipped; see
        // src/lib/stream.ts.
        startDate: z.coerce.date().optional(),
        // Current shipped version, e.g. 'v1.2.0'. Freeform string, not semver-
        // enforced, since it's just a display tag.
        version: z.string().optional(),
        appStoreUrl: z.url().optional(),
        contactEmail: z.email().optional(),
        // Path into public/, e.g. "/privacy-policy.pdf" — not run through the image() pipeline
        privacyPolicy: z.string().optional(),
      })
      // `isShipped` in src/lib/stream.ts treats a project as shipped only when it is
      // not `coming_soon` *and* carries a `shipDate`. Without these checks a project
      // could set `appStoreUrl` — rendering the download badge — while the copy
      // around it still read "WIP · in build · Coming soon".
      .superRefine((project, ctx) => {
        const shipped =
          project.status !== "coming_soon" && project.shipDate !== undefined;
        if (project.status === "available" && project.shipDate === undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["shipDate"],
            message:
              "A project with status 'available' must also set a shipDate.",
          });
        }
        if (
          project.status === "coming_soon" &&
          project.shipDate !== undefined
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["shipDate"],
            message:
              "A project with status 'coming_soon' must not set a shipDate — use startDate for its position in the stream.",
          });
        }
        if (project.appStoreUrl !== undefined && !shipped) {
          ctx.addIssue({
            code: "custom",
            path: ["appStoreUrl"],
            message:
              "appStoreUrl is only valid on a shipped project (status not 'coming_soon', shipDate set).",
          });
        }
      }),
});

export const collections = { blog, projects };

import type { ImageMetadata } from "astro";
import { type CollectionEntry, getCollection, getEntry } from "astro:content";

export type StreamTone = "primary" | "secondary" | "tertiary" | "dim";

export interface StreamEntry {
  kind: "log" | "app";
  href: string;
  title: string;
  description: string;
  /** The date shown to the reader. Absent for an app that hasn't shipped yet —
   *  the date column reads "in build". */
  date?: Date;
  /** Ordering key, falling back to `date` when absent. Split from `date` so a
   *  WIP app's `startDate` can hold it in chronological position without being
   *  displayed as though it were a ship date. Never rendered. */
  sortDate?: Date;
  /** Short chip under the date: LOG / SHIP / WIP. */
  tag: { label: string; tone: StreamTone };
  /** Secondary label, e.g. a post's category. */
  meta?: string;
  icon?: ImageMetadata;
  /** Larger image for a featured/first-entry card — a post's heroImage, or an
   *  app's screenshot (falling back to its icon). Absent, no featured card. */
  preview?: ImageMetadata;
  pills: string[];
  /** Apps only — mirrors `isShipped`, so callers can tally without refetching. */
  shipped?: boolean;
}

/**
 * The single test for "this app is out". Everything user-facing — the Ship/WIP
 * pill, the App Store / Coming soon label, the shipped tally — reads from here
 * so the detail page and the listings can't drift apart.
 */
export function isShipped(
  project: CollectionEntry<"projects">["data"],
): boolean {
  return project.status !== "coming_soon" && project.shipDate !== undefined;
}

/**
 * Newest first, ordering on `sortDate` where present and `date` otherwise, so
 * an entry can sort by one date while displaying another (or none). Entries
 * with neither — an in-build app with no `startDate` — lead.
 *
 * Two such entries compare equal — subtracting sort keys would give
 * `Infinity - Infinity`, i.e. `NaN`, and an inconsistent comparator.
 */
const byNewest = (a: StreamEntry, b: StreamEntry) => {
  const aKey = a.sortDate ?? a.date;
  const bKey = b.sortDate ?? b.date;
  if (aKey === undefined) return bKey === undefined ? 0 : -1;
  if (bKey === undefined) return 1;
  return bKey.valueOf() - aKey.valueOf();
};

/** Blog posts as stream entries, newest first. */
export async function getLogs(): Promise<StreamEntry[]> {
  const posts = await getCollection("blog");
  const entries = await Promise.all(
    posts.map(async (post) => {
      // A post can announce a specific app version — resolve the linked
      // project so the stream can show "<App> vX.Y" instead of just a tag.
      const release = post.data.releaseProject
        ? await getEntry(post.data.releaseProject)
        : undefined;
      return {
        kind: "log",
        href: `/blog/${post.id}/`,
        title: post.data.title,
        description: post.data.description,
        date: post.data.pubDate,
        tag: { label: "Log", tone: "primary" },
        meta: post.data.category,
        icon: post.data.heroImage,
        preview: post.data.heroImage,
        pills: release
          ? [`${release.data.title} ${post.data.releaseVersion}`]
          : [],
      } satisfies StreamEntry;
    }),
  );
  return entries.sort(byNewest);
}

/**
 * Apps as stream entries, newest first.
 *
 * Only a `shipDate` becomes the displayed `date`; an app without one is still
 * being built and shows "in build". A `startDate` feeds `sortDate` alone, so it
 * sorts a WIP app into chronological position (e.g. by when it was added to the
 * stream) without ever being rendered as a ship date. An app with neither is
 * undated on both counts and leads.
 */
export async function getApps(): Promise<StreamEntry[]> {
  const projects = await getCollection("projects");
  return projects
    .map<StreamEntry>((project) => {
      const shipped = isShipped(project.data);
      return {
        kind: "app",
        href: `/projects/${project.id}/`,
        title: project.data.title,
        description: project.data.tagline ?? project.data.description,
        date: project.data.shipDate,
        sortDate: project.data.shipDate ?? project.data.startDate,
        tag: shipped
          ? { label: "Ship", tone: "secondary" }
          : { label: "WIP", tone: "tertiary" },
        icon: project.data.appIcon,
        preview: project.data.screenshot ?? project.data.appIcon,
        pills: [
          project.data.version,
          shipped ? "App Store" : "Coming soon",
        ].filter((pill): pill is string => pill !== undefined),
        shipped,
      };
    })
    .sort(byNewest);
}

/** The homepage feed: posts and apps interleaved, newest first. */
export async function getStream(): Promise<StreamEntry[]> {
  const [logs, apps] = await Promise.all([getLogs(), getApps()]);
  return [...logs, ...apps].sort(byNewest);
}

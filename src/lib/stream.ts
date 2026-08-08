import type { ImageMetadata } from 'astro';
import { type CollectionEntry, getCollection } from 'astro:content';

export type StreamTone = 'primary' | 'secondary' | 'tertiary' | 'dim';

export interface StreamEntry {
	kind: 'log' | 'app';
	href: string;
	title: string;
	description: string;
	/** Absent for an app that hasn't shipped yet — the date column reads "in build". */
	date?: Date;
	/** Short chip under the date: LOG / SHIP / WIP. */
	tag: { label: string; tone: StreamTone };
	/** Secondary label, e.g. a post's category. */
	meta?: string;
	icon?: ImageMetadata;
	pills: string[];
	/** Apps only — mirrors `isShipped`, so callers can tally without refetching. */
	shipped?: boolean;
}

/**
 * The single test for "this app is out". Everything user-facing — the Ship/WIP
 * pill, the App Store / Coming soon label, the shipped tally — reads from here
 * so the detail page and the listings can't drift apart.
 */
export function isShipped(project: CollectionEntry<'projects'>['data']): boolean {
	return project.status !== 'coming_soon' && project.shipDate !== undefined;
}

/**
 * Newest first, with undated entries (in-build apps) leading.
 *
 * Two undated entries compare equal — subtracting sort keys would give
 * `Infinity - Infinity`, i.e. `NaN`, and an inconsistent comparator.
 */
const byNewest = (a: StreamEntry, b: StreamEntry) => {
	if (a.date === undefined) return b.date === undefined ? 0 : -1;
	if (b.date === undefined) return 1;
	return b.date.valueOf() - a.date.valueOf();
};

/** Blog posts as stream entries, newest first. */
export async function getLogs(): Promise<StreamEntry[]> {
	const posts = await getCollection('blog');
	return posts
		.map<StreamEntry>((post) => ({
			kind: 'log',
			href: `/blog/${post.id}/`,
			title: post.data.title,
			description: post.data.description,
			date: post.data.pubDate,
			tag: { label: 'Log', tone: 'primary' },
			meta: post.data.category,
			pills: [],
		}))
		.sort(byNewest);
}

/**
 * Apps as stream entries, newest first.
 *
 * An app with no `shipDate` is still being built, so it leads under an
 * "in build" label — adding a date later drops it into chronological position
 * without any other change.
 */
export async function getApps(): Promise<StreamEntry[]> {
	const projects = await getCollection('projects');
	return projects
		.map<StreamEntry>((project) => {
			const shipped = isShipped(project.data);
			return {
				kind: 'app',
				href: `/projects/${project.id}/`,
				title: project.data.title,
				description: project.data.tagline ?? project.data.description,
				date: project.data.shipDate,
				tag: shipped ? { label: 'Ship', tone: 'secondary' } : { label: 'WIP', tone: 'tertiary' },
				icon: project.data.appIcon,
				pills: [shipped ? 'App Store' : 'Coming soon'],
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

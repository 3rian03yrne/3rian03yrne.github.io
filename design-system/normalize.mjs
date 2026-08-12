#!/usr/bin/env node
// Normalizes raw Claude Design MCP output into the committed snapshots in this
// directory. There is no local CLI for the Claude Design MCP, so this script
// cannot fetch anything — an agent makes the MCP call and pipes the result in.
//
//   node design-system/normalize.mjs etags  < raw-listing.json  > design-system/etags.json
//   node design-system/normalize.mjs tokens < raw-manifest.json > design-system/tokens-snapshot.json
//
// Pass --date=YYYY-MM-DD to pin capturedAt; it defaults to today (UTC). Pinning
// the date of the previous capture is how you get a diff of content alone.
//
// See README.md for the full procedure.

const PROJECT_ID = '2164f014-2a4d-48fa-86c3-43a00d63c2fb';

const args = process.argv.slice(2);
const mode = args.find((a) => !a.startsWith('--'));
const dateArg = args.find((a) => a.startsWith('--date='))?.slice('--date='.length);

if (mode !== 'etags' && mode !== 'tokens') {
	process.stderr.write('usage: normalize.mjs <etags|tokens> [--date=YYYY-MM-DD] < raw.json\n');
	process.exit(2);
}
if (dateArg !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
	process.stderr.write(`--date must be YYYY-MM-DD, got: ${dateArg}\n`);
	process.exit(2);
}

const capturedAt = dateArg ?? new Date().toISOString().slice(0, 10);

/** Byte-order string compare. Never localeCompare — its result depends on the
    machine's locale, which would make the snapshot non-reproducible. */
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** The MCP tools return a JSON payload whose array may sit under any of a few
    keys, and sometimes at the top level. Find the first array of objects. */
function findArray(input, keys) {
	if (Array.isArray(input)) return input;
	for (const key of keys) {
		if (Array.isArray(input?.[key])) return input[key];
	}
	for (const value of Object.values(input ?? {})) {
		if (Array.isArray(value) && value.every((v) => v && typeof v === 'object')) return value;
	}
	return null;
}

function fail(message) {
	process.stderr.write(`${message}\n`);
	process.exit(1);
}

const raw = await new Promise((resolve, reject) => {
	let buf = '';
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', (chunk) => (buf += chunk));
	process.stdin.on('end', () => resolve(buf));
	process.stdin.on('error', reject);
});

if (!raw.trim()) fail('no input on stdin');

let input;
try {
	input = JSON.parse(raw);
} catch (error) {
	fail(`stdin is not valid JSON: ${error.message}`);
}

if (mode === 'etags') {
	const entries = findArray(input, ['files', 'entries', 'items', 'results']);
	if (!entries) fail('could not find a file array in the listing');

	const etags = {};
	for (const entry of entries) {
		// depth -1 returns files only, but filter stubs defensively.
		if (entry.type === 'directory') continue;
		const path = entry.path ?? entry.name;
		if (!path) fail(`entry has no path: ${JSON.stringify(entry)}`);
		if (!entry.etag) fail(`entry has no etag: ${path}`);
		if (path in etags) fail(`duplicate path in listing: ${path}`);
		etags[path] = entry.etag;
	}

	const paths = Object.keys(etags).sort(cmp);
	const body = paths.map((p) => `\t\t${JSON.stringify(p)}: ${JSON.stringify(etags[p])}`);

	process.stdout.write(
		[
			'{',
			`\t"designSystemProjectId": ${JSON.stringify(PROJECT_ID)},`,
			`\t"capturedAt": ${JSON.stringify(capturedAt)},`,
			'\t"source": "mcp__claude-design__list_files(depth: -1)",',
			`\t"fileCount": ${paths.length},`,
			'\t"etags": {',
			body.join(',\n'),
			'\t}',
			'}',
			'',
		].join('\n'),
	);
	process.stderr.write(`etags: ${paths.length} files\n`);
}

if (mode === 'tokens') {
	const tokens = findArray(input, ['tokens']);
	if (!tokens) fail('could not find a tokens array in the manifest');

	const rows = tokens.map((token) => {
		for (const field of ['name', 'value', 'kind']) {
			if (token[field] === undefined) {
				fail(`token missing ${field}: ${JSON.stringify(token)}`);
			}
		}
		// The manifest only sets `scope` on theme/mode overrides — base tokens
		// omit it, implicitly meaning :root. Fixed key order: scope and name
		// lead, so the identity of each token is the start of its line and a
		// rename reads as one line out, one line in.
		return { scope: token.scope ?? ':root', name: token.name, kind: token.kind, value: token.value };
	});

	rows.sort(
		(a, b) =>
			cmp(a.scope, b.scope) || cmp(a.name, b.name) || cmp(a.kind, b.kind) || cmp(a.value, b.value),
	);

	// One token per line — four-lines-per-token would bury renames in noise.
	const body = rows.map((row) => `\t\t${JSON.stringify(row)}`);

	process.stdout.write(
		[
			'{',
			`\t"designSystemProjectId": ${JSON.stringify(PROJECT_ID)},`,
			`\t"capturedAt": ${JSON.stringify(capturedAt)},`,
			'\t"source": "mcp__claude-design__read_file(_ds_manifest.json).tokens[]",',
			`\t"tokenCount": ${rows.length},`,
			'\t"tokens": [',
			body.join(',\n'),
			'\t]',
			'}',
			'',
		].join('\n'),
	);
	process.stderr.write(`tokens: ${rows.length} rows\n`);
}

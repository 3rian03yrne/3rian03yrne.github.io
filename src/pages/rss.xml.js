import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

const XML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

// `customData` is injected into the item as raw markup — @astrojs/rss parses the
// string as XML rather than escaping it, so an unescaped `<` or `&` in the value
// silently produces malformed output. Escape it here.
const escapeXml = (value) => value.replace(/[&<>"']/g, (c) => XML_ESCAPES[c]);

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    // RSS 2.0's `<author>` must be an email address, and the schema's `author` is
    // a plain name — so it is kept out of the item spread below and emitted as
    // Dublin Core `<dc:creator>` instead, which takes a name.
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    items: posts.map(({ data: { author, ...data }, id }) => ({
      ...data,
      link: `/blog/${id}/`,
      customData: `<dc:creator>${escapeXml(author)}</dc:creator>`,
    })),
  });
}

import { getChangelogEntries } from "@captainexe/shared/github-api";
export default async function handler(_request, response) {
  try { response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600"); response.status(200).json({ entries: await getChangelogEntries() }); }
  catch (error) { console.error("Changelog request failed", error); response.status(500).json({ error: "Unable to load this content from our servers." }); }
}

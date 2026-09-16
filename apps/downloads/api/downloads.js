import { getLatestStableRelease, getReleaseItems, getRepositoryReleaseDetail } from "@captainexe/shared/github-api";

function requestedRepository(request) {
  if (request.query?.repo) return String(request.query.repo);
  const pathname = new URL(request.url || "/", "http://localhost").pathname;
  const match = pathname.match(/^\/api\/downloads\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default async function handler(request, response) {
  try {
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    const repository = requestedRepository(request);
    if (repository) {
      const detail = await getRepositoryReleaseDetail("app", repository, "stable");
      if (!detail) return response.status(404).json({ error: "Repository not found." });
      return response.status(200).json(detail);
    }
    return response.status(200).json({ items: await getReleaseItems("app", getLatestStableRelease) });
  }
  catch (error) { console.error("Downloads request failed", error); response.status(500).json({ error: "Unable to load this content from our servers." }); }
}

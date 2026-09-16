import { getServiceHealth } from "@captainexe/shared/status-checks";
export default async function handler(_request, response) {
  try { response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120"); response.status(200).json(await getServiceHealth()); }
  catch (error) { console.error("Status request failed", error); response.status(500).json({ error: "Unable to load this content from our servers." }); }
}

const checks = [
  { name: "Website", url: () => process.env.PUBLIC_SITE_URL },
  { name: "GitHub API", url: () => "https://api.github.com/rate_limit" },
  { name: "CDN", url: () => process.env.CDN_HEALTH_URL },
  { name: "Vercel", url: () => process.env.VERCEL_HEALTH_URL },
  { name: "Cloudflare", url: () => process.env.CLOUDFLARE_HEALTH_URL },
];

async function checkService(service) {
  const checkedAt = new Date().toISOString();
  const url = service.url();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return { name: service.name, state: "unknown", checkedAt, latencyMs: null };
  } catch {
    return { name: service.name, state: "unknown", checkedAt, latencyMs: null };
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { method: "GET", redirect: "error", signal: controller.signal });
    return {
      name: service.name,
      state: response.ok ? "operational" : response.status < 500 ? "degraded" : "down",
      checkedAt,
      latencyMs: Date.now() - startedAt,
    };
  } catch {
    return { name: service.name, state: "down", checkedAt, latencyMs: null };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getServiceHealth() {
  const services = (await Promise.all(checks.map(checkService))).filter(Boolean);
  const states = services.map((service) => service.state);
  const down = states.filter((state) => state === "down").length;
  const degraded = states.filter((state) => state === "degraded").length;
  const overall = !services.length ? "unknown" : down > 0 ? "down" : degraded > 0 ? "degraded" : states.every((state) => state === "operational") ? "operational" : "unknown";
  return { overall, checkedAt: new Date().toISOString(), services };
}

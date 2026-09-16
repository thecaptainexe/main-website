const API_URL = "https://api.github.com";
const OWNER = process.env.GITHUB_OWNER || "thecaptainexe";
const DEFAULT_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function headers() {
  const token = process.env.GITHUB_TOKEN?.trim();
  return token
    ? { ...DEFAULT_HEADERS, Authorization: `Bearer ${token}` }
    : DEFAULT_HEADERS;
}

async function cached(key, loader, ttl = CACHE_TTL) {
  const current = cache.get(key);
  if (current && current.expiresAt > Date.now()) return current.value;
  const value = await loader();
  cache.set(key, { value, expiresAt: Date.now() + ttl });
  return value;
}

async function githubJson(path) {
  return cached(path, async () => {
    const response = await fetch(`${API_URL}${path}`, { headers: headers() });
    if (!response.ok) throw new Error(`GitHub request failed with ${response.status}`);
    return response.json();
  });
}

export async function getRepositoriesByTopic(topic) {
  const repositories = await githubJson(`/search/repositories?q=user:${OWNER}+topic:${encodeURIComponent(topic)}+is:public&per_page=100`);
  return (repositories.items || []).filter((repository) => !repository.fork).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getRecentCommits(repositoryName, limit = 25) {
  return githubJson(`/repos/${OWNER}/${encodeURIComponent(repositoryName)}/commits?per_page=${Math.min(limit, 100)}`);
}

export async function getReleases(repositoryName) {
  return githubJson(`/repos/${OWNER}/${encodeURIComponent(repositoryName)}/releases?per_page=100`);
}

const VERSION_PATTERN = /^(stable|canary)_(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function classifyRelease(tagName = "") {
  if (typeof tagName !== "string") return null;
  const match = VERSION_PATTERN.exec(tagName);
  return match ? match[1] : null;
}

export function parseVersion(tagName = "") {
  if (typeof tagName !== "string") return null;
  const match = VERSION_PATTERN.exec(tagName);
  if (!match) return null;
  return {
    channel: match[1],
    major: Number(match[2]),
    minor: Number(match[3]),
    patch: Number(match[4]),
    prerelease: match[5] ? match[5].split(".") : [],
    build: match[6] ? match[6].split(".") : [],
  };
}

function compareIdentifiers(a, b) {
  const aNumeric = /^\d+$/.test(a);
  const bNumeric = /^\d+$/.test(b);
  if (aNumeric && bNumeric) return Number(a) - Number(b);
  if (aNumeric) return -1;
  if (bNumeric) return 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

export function compareVersions(a, b) {
  const parseComparable = (value) => {
    if (typeof value !== "string") return value;
    return parseVersion(value.includes("_") ? value : `stable_${value}`);
  };
  const left = parseComparable(a);
  const right = parseComparable(b);
  if (!left || !right) return 0;
  for (const part of ["major", "minor", "patch"]) {
    if (left[part] !== right[part]) return left[part] - right[part];
  }
  if (!left.prerelease.length && !right.prerelease.length) return 0;
  if (!left.prerelease.length) return 1;
  if (!right.prerelease.length) return -1;
  for (let index = 0; index < Math.max(left.prerelease.length, right.prerelease.length); index += 1) {
    if (index >= left.prerelease.length) return -1;
    if (index >= right.prerelease.length) return 1;
    const comparison = compareIdentifiers(left.prerelease[index], right.prerelease[index]);
    if (comparison) return comparison;
  }
  return 0;
}

function releaseVersion(release) {
  if (!release || release.draft) return null;
  const version = parseVersion(release.tag_name);
  return version ? { release, version } : null;
}

function releasesForChannel(releases, channel) {
  return (Array.isArray(releases) ? releases : [])
    .map(releaseVersion)
    .filter((entry) => entry && entry.version.channel === channel)
    .sort((a, b) => compareVersions(b.version, a.version));
}

export function getLatestCanaryRelease(releases) {
  return releasesForChannel(releases, "canary")[0]?.release || null;
}

export function getLatestStableRelease(releases) {
  return releasesForChannel(releases, "stable")[0]?.release || null;
}

export function classifyCommit(message = "") {
  const normalized = message.toLowerCase();
  if (/release|version|^(chore\s*\(?)?v?\d+\.\d+/.test(normalized)) return "release";
  if (/^feat(?:ure)?[(:\s]/.test(normalized)) return "feature";
  if (/^fix[(:\s]/.test(normalized)) return "fix";
  if (/^docs?[(:\s]/.test(normalized)) return "docs";
  if (/^refactor[(:\s]/.test(normalized)) return "refactor";
  if (/^chore[(:\s]/.test(normalized)) return "maintenance";
  return "commit";
}

export function toChangelogEntry(repository, commit) {
  const message = commit.commit?.message || "Untitled commit";
  const [title, ...bodyLines] = message.split("\n");
  return {
    repository: repository.name,
    repositoryIcon: repository.owner?.avatar_url || "",
    message: `${repository.name} - New Commit`,
    body: (bodyLines.join("\n").trim() || title || "A development update was published.").slice(0, 50),
    shortSha: commit.sha?.slice(0, 7) || "",
    author: commit.author?.login || commit.commit?.author?.name || "Unknown author",
    date: commit.commit?.author?.date || commit.commit?.committer?.date || "",
    url: commit.html_url,
    kind: classifyCommit(title),
  };
}

function toReleaseChangelogEntry(repository, release) {
  return {
    repository: repository.name,
    repositoryIcon: repository.owner?.avatar_url || "",
    message: `${repository.name} - New Version`,
    body: (release.body || release.name || release.tag_name || "A release was published.").slice(0, 50),
    shortSha: "",
    version: release.tag_name || "",
    author: release.author?.login || "Unknown author",
    date: release.published_at || release.created_at || "",
    url: release.html_url,
    kind: "version",
  };
}

export async function getChangelogEntries(limit = 50) {
  const repositories = await getRepositoriesByTopic("public");
  const entries = await Promise.all(repositories.map(async (repository) => {
    const [commits, releases] = await Promise.all([
      getRecentCommits(repository.name, 25),
      getReleases(repository.name),
    ]);
    return [
      ...commits.map((commit) => toChangelogEntry(repository, commit)),
      ...releases.filter((release) => !release.draft && release.published_at).map((release) => toReleaseChangelogEntry(repository, release)),
    ];
  }));
  return entries.flat().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
}

function releaseItem(repository, release) {
  return {
    repository: repository.name,
    repositoryIcon: repository.owner?.avatar_url || "",
    description: repository.description || "No description provided.",
    releaseName: release?.name || "",
    version: release?.tag_name || "",
    publishedAt: release?.published_at || "",
    url: release?.html_url || repository.html_url,
    prerelease: Boolean(release?.prerelease),
    platform: (release?.assets || []).map((asset) => asset.name).join(", "),
  };
}

export async function getReleaseItems(topic, releaseSelector) {
  const repositories = await getRepositoriesByTopic(topic);
  const items = await Promise.all(repositories.map(async (repository) => {
    const release = releaseSelector(await getReleases(repository.name));
    return releaseItem(repository, release);
  }));
  return items.sort((a, b) => a.repository.localeCompare(b.repository));
}

export async function getRepositoryReleaseDetail(topic, repositoryName, channel) {
  const repositories = await getRepositoriesByTopic(topic);
  const repository = repositories.find((item) => item.name === repositoryName);
  if (!repository) return null;
  const releases = releasesForChannel(await getReleases(repository.name), channel);
  return {
    repository: repository.name,
    repositoryIcon: repository.owner?.avatar_url || "",
    description: repository.description || "No description provided.",
    updatedAt: releases[0]?.release.published_at || repository.updated_at || "",
    releases: releases.map(({ release }) => ({
      tagName: release.tag_name,
      version: release.tag_name,
      name: release.name || release.tag_name,
      publishedAt: release.published_at || "",
      url: release.html_url || repository.html_url,
      prerelease: Boolean(release.prerelease),
      platform: (release.assets || []).map((asset) => asset.name).join(", "),
    })),
  };
}

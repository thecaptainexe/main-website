import { SITE_CONFIG } from "../config/site";

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function requestJson(url, extraHeaders = {}) {
  const response = await fetch(url, {
    headers: {
      ...GITHUB_HEADERS,
      ...extraHeaders,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchGithubUser(owner = SITE_CONFIG.githubOwner) {
  return requestJson(`https://api.github.com/users/${owner}`);
}

export async function fetchGithubProjectRepos(owner = SITE_CONFIG.githubOwner) {
  const repos = await requestJson(`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`);

  const projectTopic = (SITE_CONFIG.githubProjectsTopic || "project").toLowerCase();

  const enriched = await Promise.all(
    repos
      .filter((repo) => !repo.fork && repo.private === false)
      .map(async (repo) => {
        try {
          const topics = await requestJson(`https://api.github.com/repos/${owner}/${repo.name}/topics`);
          return {
            ...repo,
            topics: Array.isArray(topics?.names) ? topics.names : [],
          };
        } catch {
          return {
            ...repo,
            topics: [],
          };
        }
      }),
  );

  return enriched
    .filter((repo) => Array.isArray(repo.topics) && repo.topics.map((topic) => String(topic).toLowerCase()).includes(projectTopic))
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "No description provided.",
      html_url: repo.html_url,
      homepage: repo.homepage || "",
      language: repo.language || "N/A",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      topics: repo.topics || [],
      updated_at: repo.updated_at,
    }))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

export async function fetchApprovedTestimonials(owner = SITE_CONFIG.githubOwner, repo = SITE_CONFIG.githubRepository) {
  const discussions = await requestJson(`https://api.github.com/repos/${owner}/${repo}/discussions?per_page=100`);

  return discussions
    .filter((discussion) => Array.isArray(discussion.labels) && discussion.labels.some((label) => label && label.name === "approved"))
    .map((discussion) => ({
      id: discussion.id,
      title: discussion.title || "Testimonial",
      body: sanitizeText(discussion.body || ""),
      author: discussion.user?.login || "Anonymous",
      created_at: discussion.created_at,
      url: discussion.html_url,
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function fetchGithubStats(owner = SITE_CONFIG.githubOwner) {
  const [user, repos, events] = await Promise.all([
    fetchGithubUser(owner),
    fetchGithubProjectRepos(owner),
    requestJson(`https://api.github.com/users/${owner}/events/public?per_page=100`),
  ]);

  const currentYear = new Date().getFullYear();

  const recentPushRepos = new Set(
    events
      .filter((event) => event.type === "PushEvent")
      .filter((event) => {
        const createdAt = new Date(event.created_at).getTime();
        const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return createdAt >= threshold;
      })
      .map((event) => event.repo?.name)
      .filter(Boolean),
  );

  const commitSearch = await requestJson(
    `https://api.github.com/search/commits?q=author:${owner}&per_page=1`,
    { Accept: "application/vnd.github.cloak-preview+json" },
  );

  return {
    yearsExperience: Math.max(0, currentYear - 2017),
    projectsDone: 10 + Number(user.public_repos || 0),
    ongoingProjects: 3 + recentPushRepos.size,
    githubCommits: 130904 + Number(commitSearch.total_count || 0),
    projectCount: repos.length,
  };
}

function sanitizeText(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\(([^)]+)\)/g, " ")
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, "$1")
    .replace(/[#*_>`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

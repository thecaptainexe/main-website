# Standalone deployments

Each app is an independent Vercel project. Set **Root Directory** to the app
folder below, enable **Include source files outside of the Root Directory**
(the shared workspace package is imported by the API handlers), and use the
same install command for every project:

| Project / hostname | Root Directory | Build command | Install command |
| --- | --- | --- | --- |
| Website / `thecaptainexe.me` | `apps/website` | `npm run build` | `npm install` |
| Changelog / `changelog.thecaptainexe.me` | `apps/changelog` | `npm run build` | `npm install` |
| Status / `status.thecaptainexe.me` | `apps/status` | `npm run build` | `npm install` |
| Labs / `labs.thecaptainexe.me` | `apps/labs` | `npm run build` | `npm install` |
| Downloads / `downloads.thecaptainexe.me` | `apps/downloads` | `npm run build` | `npm install` |
| CDN / `cdn.thecaptainexe.me` | `apps/cdn` | `npm run build` | `npm install` |

The apps run separately in development. From the repository root:

```sh
npm run dev:website    # http://localhost:5173
npm run dev:changelog  # Vite chooses the next available port
npm run dev:status
npm run dev:labs
npm run dev:downloads
npm run dev:cdn
```

API handlers use `GITHUB_TOKEN` server-side only. Set `GITHUB_OWNER` when the
repositories live under another owner. Status checks are opt-in through
`PUBLIC_SITE_URL`, `CDN_HEALTH_URL`, `VERCEL_HEALTH_URL`, and
`CLOUDFLARE_HEALTH_URL`; unset services are shown as **Not configured** rather
than being reported as healthy. Configure `VITE_DISCORD_USER_ID` only in the
website project.

Changelog reads public-topic repositories and combines commits with release
events, while Downloads and Labs read `app` and `labs` topics respectively.
Release assets are never proxied: release buttons always open GitHub.

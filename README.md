# CaptainEXE Monorepo

Official source repository for the CaptainEXE website and standalone subdomain applications.

## Overview

This npm-workspace monorepo contains:

- `apps/website` → `https://thecaptainexe.dev`
- `apps/changelog` → `https://changelog.thecaptainexe.dev`
- `apps/status` → `https://status.thecaptainexe.dev`
- `apps/labs` → `https://labs.thecaptainexe.dev`
- `apps/downloads` → `https://downloads.thecaptainexe.dev`
- `packages/shared` → shared design tokens, contracts, and server utilities

## Tech stack

- React
- Vite
- JavaScript
- CSS
- GitHub API integration patterns (future server-side use)

## Development

```bash
npm install
```

| App | Command | Local URL |
| --- | --- | --- |
| Website | `npm run dev:website` | http://localhost:5173 |
| Changelog | `npm run dev:changelog` | http://localhost:5174 |
| Status | `npm run dev:status` | http://localhost:5175 |
| Labs | `npm run dev:labs` | http://localhost:5176 |
| Downloads | `npm run dev:downloads` | http://localhost:5177 |

Build independently with `npm run build:website`, `npm run build:changelog`,
`npm run build:status`, `npm run build:labs`, or `npm run build:downloads`.

## Project structure

```text
apps/
  website/
  changelog/
  status/
  labs/
  downloads/
packages/
  shared/

.github/
  DISCUSSION_TEMPLATE/
  workflows/

public/
  assets/

docs/
```

## Environment variables

This project uses a public `.env.example` for placeholders only. Do not add real secrets or tokens to Vite environment variables.

```bash
cp .env.example .env
```

## GitHub topic-driven systems

Website projects use the `project` topic. Changelog repositories use `public`,
Labs uses `labs`, and Downloads uses `app`. Repository names are never
hardcoded.

## GitHub Testimonials

A GitHub Discussion template and moderation workflow are scaffolded under `.github/` to support a `Testimonials` category with `pending`, `approved`, and `rejected` labels.

## Security

See `SECURITY.md`.

## Contributing

See `CONTRIBUTING.md`.

## License

See `LICENSE`.

## Deployment

Each `apps/*` directory is an independent Vercel project root. Configure
`GITHUB_TOKEN` only in the server-side standalone projects; never use
`VITE_GITHUB_TOKEN`. The API handlers return generic public errors and cache
upstream content.

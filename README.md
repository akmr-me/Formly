# Formly

A Typeform-style form builder with block-based editing, draft/publish snapshots, and a one-question-per-page submission experience.

**Live demo:** [formly.akmr.me](https://formly.akmr.me)

## Highlights

- **Block-based builder** — statement, text, number, URL, date, address, single/multi select, dropdown
- **Draft → publish workflow** — edit blocks in draft, publish a snapshot to `PublishedBlock` for stable public forms
- **Auth & ownership** — email/password signup, JWT httpOnly cookies, per-user form dashboard
- **Public submission flow** — paginated questions, local progress saving, success screen
- **Responses** — owner-only table view with CSV export
- **Production deploy** — Docker Compose + Nginx reverse proxy

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, TanStack Query, Radix UI |
| Backend | Express 5, TypeScript, Zod, JWT, bcrypt |
| Database | PostgreSQL, Prisma schema + Kysely queries |
| Deploy | Docker, Nginx, `deploy.sh` |

## Features

### Form builder
- Desktop builder with live preview and block sidebar
- Rich text descriptions (Quill), cover images, text alignment
- Per-block settings: required flag, placeholders, min/max limits
- Statement blocks with Loom/Vimeo/PDF embeds
- Select blocks with configurable options

### Public forms
- One block per page with progress bar
- Answers saved in `localStorage` until final submit
- HTML5 validation for number min/max and long-text character limits
- Branded success screen after submission

### Owner dashboard
- List owned forms with response counts
- Edit builder, view responses, open public link when published

## Architecture

```
Browser
  ├── Next.js client (port 3000)
  └── /api → Express server (port 8000)
                ├── Auth (JWT cookie)
                ├── Forms / Blocks / Responses
                └── PostgreSQL
```

**Publish model:** `Block` rows are editable drafts. On publish, blocks are copied to `PublishedBlock` so live respondents always see a stable snapshot. Adding or deleting blocks resets the form to draft.

## Local development

### Prerequisites
- Node.js 20+
- Docker (for Postgres)

### 1. Start Postgres

```bash
docker compose up -d
```

Postgres runs on `localhost:5433`. pgAdmin is available at `http://localhost:8080`.

### 2. Server

```bash
cd server
npm install
# Create server .env with DATABASE_URL pointing to localhost:5433
npm run prisma:migrate
npm run dev
```

Server: `http://localhost:8000`

### 3. Client

```bash
cd client
npm install
npm run dev
```

Client: `http://localhost:3000`

The client talks to `http://localhost:8000/api` in development.

### Useful scripts

```bash
# Client typecheck + lint
cd client && npm run check

# Server build
cd server && npm run build
```

## Production deployment

1. Copy `.env.production.example` to `.env.production` and set secrets (`JWT_SECRET`, `POSTGRES_PASSWORD`, `DOMAIN`, etc.).
2. Run:

```bash
DOMAIN=formly.example.com CLIENT_PORT=5000 SERVER_PORT=5001 ./deploy.sh
```

`deploy.sh` builds Docker images, runs migrations, and configures Nginx (HTTP + HTTPS when a Let's Encrypt cert exists).

## Project structure

```
Formly/
├── client/                 # Next.js app
│   ├── app/                # Routes (login, builder, responses, public form)
│   ├── components/         # UI (atomic design: ui → molecules → organisms → templates)
│   ├── hooks/              # React Query mutations
│   └── services/           # API clients
├── server/
│   ├── src/routes/         # Express routes
│   ├── src/repositories/   # Kysely data access
│   ├── src/validators/     # Zod block/form schemas
│   └── prisma/schema/      # Database schema + migrations
├── deploy.sh               # Production deploy script
└── docker-compose.prod.yml
```

## Block types

| Type | Description |
|------|-------------|
| `statement` | Intro / welcome screen |
| `shortText` | Short free-text answer |
| `longText` | Long answer with optional min/max characters |
| `number` | Numeric input with optional min/max |
| `websiteUrl` | URL input |
| `single` | Single-select options |
| `multi` | Multi-select options |
| `dropdown` | Dropdown list |
| `date` | Date picker |
| `address` | Configurable address fields |

## Environment variables

See `.env.production.example` for the full list. Key values:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Auth token signing secret |
| `CORS_ORIGIN` | Allowed frontend origin |
| `NEXT_PUBLIC_API_URL` | Client API base (`/api` in production) |
| `DOMAIN` | Public hostname for Nginx + deploy |


## Embed on other websites

Published forms can be embedded on any site with an iframe.

**Embed URL:** `https://your-domain.com/embed/{formId}`

```html
<iframe
  src="https://your-domain.com/embed/qCrA9qZ9"
  width="100%"
  height="600"
  style="border:0;"
  loading="lazy"
  title="Formly form"
></iframe>
```

In the builder, click **Embed** (available after publish) to copy the iframe code.

On successful submit, embedded forms send a `postMessage` to the parent page:

```js
window.addEventListener("message", (event) => {
  if (event.data?.type === "formly:submitted") {
    console.log("Form submitted:", event.data.formId);
  }
});
```

## Roadmap

- [ ] Response analytics (charts, per-question breakdown)
- [ ] Form themes / branding
- [ ] URL parameter autofill on public forms
- [ ] Conditional logic / branching
- [ ] Email notifications on new responses

## License

Personal project — all rights reserved.

# Saasan

Saasan is a civic technology platform for Nepal focused on transparency, accountability, and public participation.

The current codebase includes:

- a shared backend API
- an internal admin dashboard
- a citizen-facing mobile-first web app

The immediate goal is to ship a stable first public release that helps people:

- monitor corruption
- track politicians
- explore civic and political data
- participate in polls and feedback loops

## Current Apps

### `saasan-be-nest`

NestJS backend API with MongoDB, JWT authentication, Redis caching, and core civic domain modules.

Current backend domains include:

- auth and users
- reports and evidence
- dashboard stats
- polling
- politics
- geography
- events
- cases

### `saasan-dashboard-react`

Internal admin dashboard used to manage platform data and operations.

Current admin areas include:

- dashboard overview
- reports
- report metadata
- politicians and parties
- users
- geography
- polling

### `saasan-mobile-react`

Citizen-facing mobile-first React app.

Current citizen-facing areas include:

- authentication
- home dashboard
- reports
- politics
- polls

## Product Direction

Saasan is being built as a broader civic platform with multiple products and subdomains, including:

- `saasannepal.com` for public civic data
- `citizen.saasannepal.com` for the citizen portal
- `admin.saasannepal.com` for internal administration
- future products such as politician, survey, diaspora, loksewa, and institutional API access

Today, this repository is the working platform core for that broader vision.

## Repository Structure

```text
saasan/
├── saasan-be-nest/           # Shared backend API
├── saasan-dashboard-react/   # Admin dashboard
├── saasan-mobile-react/      # Citizen-facing mobile-first web app
├── package.json              # Root helper scripts
└── README.md
```

## Tech Stack

### Backend

- NestJS
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Redis caching
- Cloudinary for media uploads

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Prerequisites

Install these before running the project locally:

- Node.js 20+ recommended
- `pnpm`
- MongoDB
- Redis

## Local Development

There are now root-level helper commands to speed up setup and local development.

### Fast setup

From the project root:

```bash
pnpm setup:all
```

Then start all apps together:

```bash
pnpm dev
```

Current root helper commands:

- `pnpm install:all` installs dependencies for the root, backend, and dashboard
- `pnpm setup:env` copies example env files
- `pnpm dev:all` starts the backend API, backend worker, dashboard, mobile, and politician apps together

## Backend Modules

The backend is currently organized as a modular monolith. The major modules are:

- `auth`
- `user`
- `report`
- `dashboard`
- `poll`
- `politics`
- `location`
- `event`
- `case`
- `common`

This structure is intentional for the current stage of the project. The goal is to stabilize the platform core before expanding into more standalone products.

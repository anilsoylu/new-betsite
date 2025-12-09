# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Football/soccer statistics web application built with Next.js 16 and React 19. Displays live matches, league standings, player stats, and team information sourced from the Sportmonks API.

## Commands

```bash
bun dev          # Start development server (http://localhost:3000)
bun build        # Production build
bun lint         # Lint with Biome
bun format       # Format with Biome
```

## Architecture

### Data Flow
```
Sportmonks API → sportmonks-client.ts → sportmonks-mappers.ts → football-api.ts → queries.ts → Components
```

1. **sportmonks-client.ts** - API wrapper handling auth, query building, caching, and error handling
2. **sportmonks-mappers.ts** - Transforms raw API responses to domain types
3. **football-api.ts** - High-level query functions (getFixturesByDate, getStandingsBySeason, etc.)
4. **queries.ts** - Server-side data aggregation using Promise.all for parallel fetching

### Type System
- Raw API types: `src/types/sportmonks/raw/` - Direct API response shapes
- Domain types: `src/types/football.ts` - Clean internal types
- Always map raw → domain via `sportmonks-mappers.ts`

### State Management
- **Server**: Next.js server components with configurable cache revalidation
- **Client**: Zustand store (`stores/favorites-store.ts`) for user favorites with localStorage persistence

### Key Patterns
- Server components for data fetching, client components for interactivity
- Path alias: `@/*` → `./src/*`
- React Compiler enabled for automatic optimization
- Radix UI + Tailwind CSS for accessible, styled components

## Environment Variables

Required:
- `API_SPORTMONKS_KEY` - Sportmonks API key (server-only)

Optional:
- `CONTENTFUL_*` - CMS integration
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` / `HCAPTCHA_SECRET_KEY` - Captcha
- `BUNNY_CDN_URL` - CDN
- `SMTP_*` - Email

Environment validation via Zod in `src/lib/env.ts`.

## API Routes

- `/api/fixtures?date=YYYY-MM-DD` - Fixtures by date
- `/api/fixtures/[id]/live` - Live fixture updates
- `/api/players/search` - Player search
- `/api/teams/search` - Team search

## Styling

Tailwind CSS 4 with OKLch color space. Theme variables in `globals.css`. Dark mode via `next-themes`.

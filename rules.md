# Agent Rules

## Priority
Ship working features fast. Every decision should optimize for demo-ready over production-perfect.

## Code Style
- No unnecessary abstractions — write the direct thing, not a wrapper around the thing
- No custom hooks unless the logic is reused in 3+ places
- No service layers, repositories, or adapter patterns
- Inline logic is fine; extract only when duplication is obvious

## Data Access
- Query Supabase directly in components or route handlers
- Use `lib/supabaseClient.ts` — do not create alternate clients
- No ORM, no query builder wrappers
- Keep queries close to where the data is used

## UI
- Always reach for shadcn components first (`components/ui/`)
- Add new shadcn components with `npx shadcn@latest add <name>` before writing custom ones
- Use Tailwind utility classes directly — no custom CSS unless unavoidable
- Client components are the default; use `"use server"` / server components only when there is a clear reason

## What to Skip
- Unit tests
- Error boundaries
- Loading skeletons (unless the UI obviously needs it)
- Optimistic updates
- Pagination (use limits instead)
- Auth middleware complexity — a single Supabase auth check inline is enough

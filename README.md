# Dashboard App

A modern dashboard built with Next.js and React. It includes product and order management, mock API integration, schema-validated forms, and a clean component library.

## Tech Stack
- Next.js `16` (App Router)
- React `19`
- TypeScript `5`
- Tailwind CSS `4` with `@tailwindcss/postcss`
- Radix UI primitives (`@radix-ui/react-*`)
- Lucide icons (`lucide-react`)
- React Hook Form + Zod + Resolvers (`react-hook-form`, `zod`, `@hookform/resolvers`)
- Date utilities (`date-fns`) and `react-day-picker`
- Notifications (`sonner`)
- Theming (`next-themes`)
- Data utilities: TanStack Query/Table (`@tanstack/react-query`, `@tanstack/react-table`)
- Charts (`recharts`)
- Utility libs: `clsx`, `class-variance-authority`, `tailwind-merge`

## Prerequisites
- Node.js `>= 18.18`
- A package manager: `npm` (default), or `yarn`/`pnpm`/`bun`
- No environment variables required — the app uses an in-memory mock API

## Getting Started
1. Install dependencies:
   ```bash
   git clone https://github.com/apucsd/dashboard-task.git
   cd dashboard-task
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Scripts
- `npm run dev` — start the Next.js dev server
- `npm run build` — production build
- `npm run start` — start the production server after build
- `npm run lint` — run ESLint

## Project Structure
```
src/
  app/                    # App Router pages and layouts
    dashboard/            # Dashboard routes (products, orders, etc.)
  components/             # UI and layout components
    ui/                   # Reusable UI components (Radix + Tailwind)
  lib/
    api.ts                # Mock API layer
    mock-data.ts          # In-memory data used by the API
    schemas.ts            # Zod schemas and types
    utils.ts              # Helpers and utilities
```

## Development Notes
- UI styles: Tailwind CSS v4 is configured via PostCSS. Ensure `@tailwindcss/postcss` and `tailwindcss` are installed (they are in `devDependencies`).
- Forms: Validated with Zod; numeric fields are handled explicitly to avoid `NaN`.
- Mock API: The app uses `src/lib/api.ts` to simulate backend actions. No external services are required.
- Toasts: Errors and success messages use `sonner`.

## Common Tasks
- Update product status: Implemented via the mock API in `src/lib/api.ts` and used within `src/app/dashboard/products/page.tsx`.
- Create orders: Form at `src/app/dashboard/orders/create/page.tsx` with live order summary.

## Deployment
- Build and run locally:
  ```bash
  npm run build && npm run start
  ```
- Or deploy to Vercel. Next.js `16` is fully supported.

## Troubleshooting
- Styles not applying? Confirm Tailwind v4 is active and `src/app/globals.css` is loaded.
- Type errors in forms? Check Zod schema in `src/lib/schemas.ts` and ensure inputs coerce/validate as intended.

---
This project was bootstrapped with `create-next-app`. Contributions and feedback are welcome.

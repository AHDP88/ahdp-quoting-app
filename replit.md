# Deck and Pergola Quoting App

## Project Overview
A full-stack web application for generating accurate price quotes for deck and pergola construction projects. Built with React/TypeScript frontend, Express backend, and PostgreSQL database.

## Architecture

### Frontend (`client/src/`)
- **Framework**: React 18 with TypeScript
- **Router**: Wouter for client-side routing
- **State Management**: TanStack React Query (v5) for server state
- **UI Library**: shadcn with Tailwind CSS
- **Pricing System**: Real prices from AHDP Pricing Sheet via `ahdpPricing.ts` + `quoteCalculator.ts`
- **Pages**:
  - `/` - Home page
  - `/create-quote` - Multi-step quote builder
  - `/quotes` - List all quotes (Quote Pipeline with filter tabs + lifecycle actions)
  - `/quotes/:id` - Quote details with status bar, deposit tracking, job handover, CRM export
  - `/settings` - Pricing Settings (Price Catalog, Import, Changelog)
  - `/admin/login` - Admin authentication
  - `/admin/dashboard` - Admin dashboard for quote/config management

### Backend (`server/`)
- **Framework**: Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Validation**: Zod schemas
- **API Routes**:
  - **Quotes**: `POST/GET/PATCH/DELETE /api/quotes`
  - **Quote Status**: `PATCH /api/quotes/:id/status` — lightweight lifecycle transitions (sets status + timestamp)
  - **Job Handover**: `PATCH /api/quotes/:id/job` — updates handover fields post-approval
  - **CRM Export**: `GET /api/quotes/:id/crm-export` — structured JSON for Airtable/Make/Zapier
  - **Pricing Catalog**: `GET/POST/PATCH/DELETE /api/settings/pricing` — full CRUD on pricing items
  - **Pricing Meta**: `GET /api/settings/pricing/meta` — categories, suppliers, item count
  - **Pricing Seed**: `POST /api/settings/pricing/seed` — idempotent seed from AHDP defaults (100+ items)
  - **Import Upload**: `POST /api/settings/pricing/import/upload` — CSV/Excel base64 upload, auto column detection, preview
  - **Import Apply**: `POST /api/settings/pricing/import/:id/apply` — apply selected rows from pending import
  - **Import Cancel**: `POST /api/settings/pricing/import/:id/cancel` — cancel pending import
  - **Import History**: `GET /api/settings/imports` — list all supplier imports
  - **Changelog**: `GET /api/settings/pricing/changelog` — audit trail of all price changes
  - **Materials**: `GET/POST/PATCH/DELETE /api/pricing/materials`
  - **Add-ons**: `GET/POST/PATCH/DELETE /api/pricing/addons`
  - **Labour Rates**: `GET/POST/PATCH/DELETE /api/pricing/labour-rates`

### Database (`shared/schema.ts`)
- **Users Table**: Admin authentication (username, password)
- **Quotes Table**: Comprehensive quote data (all project specs)
- **Materials Table**: Base materials with pricing per m²
- **Addons Table**: Optional features with flexible unit pricing
- **Labour Rates Table**: Labour costs per unit type
- **Pricing Strategy**: Prices stored as integers (cents) to avoid floating-point errors

## Key Features

### Quote Builder (Multi-Step Form)
1. **Basic Info** - Project type and client details
2. **Decking Section** - Dimensions, materials, board types, fasteners
3. **Verandah/Pergola Section** - Structure, roof, painting options
4. **Walls & Screening** - Cladding, materials, heights
5. **Construction Details** - Access, footings, special requirements
6. **Site Requirements** - Ground conditions, council approval
7. **Extras** - Additional trades and options

### Admin Dashboard
- View and manage all quotes
- Export quotes to CSV
- Configuration management for materials and pricing
- Authentication via username/password

### 3D Visualization
- Interactive deck visualization playground
- Customizable dimensions and materials
- Real-time preview rendering

## Development Guidelines

### Frontend
- Use `wouter` for routing (imports from wouter)
- Use `@tanstack/react-query` for data fetching
- Form validation with `react-hook-form` + Zod schemas
- Import shadcn components via `@` alias (e.g., `@/components/ui/button`)
- Use `lucide-react` for icons, `react-icons/si` for logos
- Environment variables prefixed with `VITE_` (access via `import.meta.env`)

### Backend
- Validate all requests with Zod schemas from `drizzle-zod`
- Use storage interface (IStorage) for all database operations
- Keep routes thin - logic should be in storage layer
- Return consistent API responses (statusCode + JSON)

### Database
- Never manually write SQL migrations - use `npm run db:push`
- If data-loss warning appears, use `npm run db:push --force`
- All models defined in `shared/schema.ts` with proper Zod schemas
- Use `createInsertSchema` for validation, `$inferSelect` for types

## Running the Application
```bash
npm run dev
```
Starts Express backend (port 5000) and Vite frontend dev server on the same port.

## Key File Locations
- **Pages**: `client/src/pages/`
- **Components**: `client/src/components/`
- **UI Components**: `client/src/components/ui/` (shadcn)
- **Utilities**: `client/src/lib/` (queryClient, utils, hooks)
- **Database Schema**: `shared/schema.ts`
- **Storage Layer**: `server/storage.ts`
- **API Routes**: `server/routes.ts`
- **Main App**: `client/src/App.tsx`

## Common Tasks

### Adding a New Form Field
1. Add column to `quotes` table in `shared/schema.ts`
2. Update `insertQuoteSchema` in `shared/schema.ts`
3. Add form field to appropriate component in `client/src/components/`
4. Run `npm run db:push` to sync database

### Adding a New API Endpoint
1. Add method to `IStorage` interface in `server/storage.ts`
2. Implement method in `DatabaseStorage` class
3. Create route handler in `server/routes.ts`
4. Use Zod validation for request body

### Styling Updates
- Override colors in `client/src/index.css` for Colorbond palette consistency
- Use Tailwind classes with shadcn components
- Maintain responsive design (mobile, tablet, desktop)

## Admin Authentication
- Username/password stored in PostgreSQL users table
- Session management handled client-side (simple token pattern)
- Protected routes checked in components

## Notes
- All dropdown options centralized in `dropdownOptions.ts` for consistency
- Colorbond standard palette used for all color-related fields
- Type safety enforced throughout with TypeScript and Zod validation
- All queries use TanStack Query with proper cache invalidation on mutations

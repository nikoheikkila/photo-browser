# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A SvelteKit photo browser application that demonstrates **Hexagonal/Clean Architecture** principles in a frontend context. The app fetches and displays photos from the JSONPlaceholder Typicode API, organized by albums.

## Essential Commands

This project uses [Task](https://taskfile.dev) as the primary task runner. All commands should be prefixed with `task`.

### Development

```fish
task dev          # Start development server (port 5173)
task build        # Build for production
task serve        # Preview production build locally
```

### Testing

The project has **three separate test configurations** with different environments:

```fish
# Run all tests (lint + unit + component + e2e)
task test

# Individual test suites
task test:unit              # Unit tests with Vitest (Node environment)
task test:unit:watch        # Unit tests in watch mode (no coverage)
task test:components        # Component tests with Vitest (happy-dom)
task test:components:watch  # Component tests in watch mode
task test:e2e               # E2E tests with Playwright (requires build first)

# Run specific test files
npx vitest run --config vitest.unit.ts tests/unit/PhotoBrowser.test.ts
npx vitest run --config vitest.components.ts tests/components/listing.test.ts
npx playwright test tests/e2e/listing.spec.ts
```

**Important**: Unit and component tests use **different Vitest configs**:
- `vitest.unit.ts` - Node environment, includes `tests/unit/*.test.ts`
- `vitest.components.ts` - happy-dom environment, includes `tests/components/*.test.ts`, uses setup file

E2E tests run against a production build and will automatically start a preview server.

### Code Quality

```fish
task lint         # Run all linting checks (Prettier, ESLint, svelte-check)
task format       # Auto-fix formatting and linting issues
```

The `lint` task runs:
1. Prettier check
2. ESLint
3. `svelte-kit sync` (generates types)
4. `svelte-check` (TypeScript validation for Svelte files)

### Installation

```fish
task install      # Install dependencies (auto-creates .env from .env.example)
```

## Architecture

This codebase implements **Hexagonal Architecture** (Ports & Adapters) to decouple business logic from external dependencies.

### Core Structure

```
src/
├── lib/
│   ├── domain/          # Domain entities and schemas (Photo, validation rules)
│   ├── services/        # Business logic (PhotoBrowser, PhotoCalculator)
│   └── adapters/        # External integrations (APIGateway implements PhotoGateway)
├── routes/              # SvelteKit pages (+page.ts, +page.svelte)
└── components/          # UI components (presentational)

tests/
├── unit/                # Business logic tests (services, domain) + FakeGateway
├── components/          # Svelte component rendering tests
└── e2e/                 # Full user journey tests
```

### Key Architectural Patterns

#### Port-Adapter Pattern

**Port** (Interface): `PhotoGateway<T>` in `src/lib/adapters/Gateway.ts`
- Defines the contract for fetching photos
- Three methods: `fetchPhotos`, `fetchPhoto`, `fetchPhotosByAlbumId`

**Adapters** (Implementations):
- **Production**: `APIGateway` - Uses Axios to call Typicode API
- **Testing**: `FakeGateway` (in `tests/unit/FakeGateway.ts`) - Uses Faker.js for test data

This allows `PhotoBrowser` service to work with any gateway implementation without knowing the data source.

#### Domain Layer

- **Entities**: `Photo` type defined with Zod schema in `src/lib/domain/Photo.ts`
- **Validation**: Runtime type validation using Zod schemas (see `src/lib/domain/Schema.ts`)
- **Factory Pattern**: `createPhoto(data: Dictionary): Photo` validates and constructs Photo entities
- All domain entities are immutable and strongly typed

#### Service Layer

`PhotoBrowser` (`src/lib/services/PhotoBrowser.ts`):
- Orchestrates data fetching through the gateway
- Applies business rules (e.g., limit validation)
- Returns validated domain entities
- Provides fluent API (`withLimit()` returns `this`)

Key methods:
- `loadPhotos()` - Fetch all photos
- `loadPhoto(id)` - Fetch single photo
- `loadFromAlbum(albumId)` - Fetch photos by album
- `groupPhotosByAlbum()` - Returns photos grouped as `Albums` dictionary

#### SvelteKit Integration

Routes use `+page.ts` loaders to fetch data server-side:
- Import the singleton `browser` instance from `$lib/services`
- Call service methods in the `load` function
- Pass data to `+page.svelte` as typed `PageData`
- Handle errors with SvelteKit's `error()` helper

Example pattern:
```typescript
export const load: PageLoad<Response> = async () => {
  try {
    return {
      albums: await browser.withLimit(500).groupPhotosByAlbum()
    };
  } catch (err) {
    handleError(err);
    throw error(500, 'Could not load photos');
  }
};
```

### Dependency Flow

```
Routes/Components (UI Layer)
        ↓
  Services (Business Logic)
        ↓
    PhotoGateway (Port/Interface)
        ↓
  APIGateway/FakeGateway (Adapters)
        ↓
  External API / Test Data
```

**Critical Rule**: Dependencies point inward. Services depend on `PhotoGateway` interface, NOT on `APIGateway` implementation.

## Testing Strategy

### Test Organization

- **`tests/unit/*.test.ts`** - Pure logic tests (services, gateways, domain models)
  - Uses `FakeGateway` for dependency injection
  - Node environment (no DOM)
  - Coverage enabled
  
- **`tests/components/*.test.ts`** - Svelte component rendering tests
  - Uses `@testing-library/svelte`
  - happy-dom environment (lightweight DOM)
  - Tests component rendering, user interactions, accessibility
  
- **`tests/e2e/*.spec.ts`** - Full browser tests with Playwright
  - Tests complete user workflows
  - Runs against production build
  - Configured in `playwright.config.ts`

### Testing Patterns

#### Unit Tests
- Use `FakeGateway` for test doubles
- `feedWith(stubs)` - Provide fake data
- `setError(error)` - Simulate errors
- Test validation rules and edge cases

#### Component Tests
- `render(Component, { data })` - Render with props
- Use Testing Library queries (`getByRole`, `findByText`, etc.)
- Focus on accessibility (proper roles, alt text)
- Helper: `randomPhoto()` from `tests/helpers.ts` generates test data

#### E2E Tests (following your Playwright rules)
- Use `test.step()` to group related actions
- Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`)
- Use auto-retrying web-first assertions (`await expect(locator).toHaveText()`)
- Tests in `test.describe()` blocks with `beforeEach` for setup
- All E2E tests follow the structure from your test writing guidelines

### Running Individual Tests

```fish
# Single test file
npx vitest run --config vitest.unit.ts tests/unit/PhotoBrowser.test.ts

# Single test suite by name
npx vitest run --config vitest.unit.ts -t "loading all photos"

# Watch mode for specific file
npx vitest watch --config vitest.components.ts tests/components/listing.test.ts

# Single E2E test
npx playwright test tests/e2e/listing.spec.ts

# E2E with UI mode
npx playwright test --ui
```

## Configuration

### Environment Variables

Required variable in `.env` (auto-copied from `.env.example` on install):

```
PUBLIC_PHOTO_API_URL='https://jsonplaceholder.typicode.com'
```

SvelteKit convention: `PUBLIC_*` variables are exposed to browser code.

### Path Aliases

Defined in `svelte.config.js`:
- `$lib/*` → `src/lib/*` (built-in SvelteKit alias)
- `$components/*` → `src/components/*` (custom alias)

### Important Config Files

- `svelte.config.js` - SvelteKit config with Netlify adapter, path aliases
- `vite.config.js` - Vite config (minimal, just SvelteKit plugin)
- `vitest.unit.ts` - Unit test config (Node env, coverage enabled)
- `vitest.components.ts` - Component test config (happy-dom, setup file)
- `playwright.config.ts` - E2E config (port 5173, auto-start preview server)
- `Taskfile.yaml` - All development commands with dependency management

### Deployment

Configured for **Netlify** with `@sveltejs/adapter-netlify`:
- Edge: disabled
- Split: enabled (splits routes into separate functions)
- Config in `netlify.toml`

### Test Configuration Differences

| Config | Environment | Test Files | Coverage | Setup |
|--------|-------------|------------|----------|-------|
| `vitest.unit.ts` | Node | `tests/unit/*.test.ts` | Enabled (c8) | None |
| `vitest.components.ts` | happy-dom | `tests/components/*.test.ts` | Disabled | `tests/components/setup.ts` |
| `playwright.config.ts` | Real browser | `tests/e2e/*.spec.ts` | N/A | Webserver auto-start |

## Code Patterns to Follow

### Domain Models
- Define entities with Zod schemas for runtime validation
- Use factory functions (`createPhoto`) to construct validated entities
- Keep entities immutable (readonly properties)

### Services
- Inject gateways via constructor
- Throw descriptive errors for validation failures
- Return domain entities, not raw API responses
- Use fluent interfaces where appropriate (`withLimit`)

### Components
- Keep presentational components in `src/components/`
- Use proper semantic HTML and ARIA attributes
- Test accessibility with role-based queries

### SvelteKit Routes
- Data fetching in `+page.ts` server-side loaders
- Use typed `PageData` in components
- Handle errors with `error()` helper
- Server-side rendering enabled by default

## Reference Documentation

See the [blog post guide](https://nikoheikkila.fi/blog/clean-frontend-architecture-with-sveltekit) for detailed explanation of the architecture design process.

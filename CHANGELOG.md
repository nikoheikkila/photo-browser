# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0]

### Major Updates - November 2025

#### Changed

**Framework & Core Dependencies**
- Updated SvelteKit from v1.16.2 to v2.48.4 (major version)
- Updated Svelte from v3.59.0 to v4.2.20 (v4 for testing compatibility)
- Updated @sveltejs/vite-plugin-svelte from bundled to v3.1.2
- Updated Vite from v4.3.9 to v7.2.0 (major version)
- Updated TypeScript from v5.0.4 to v5.9.3

**Testing Tools**
- Updated Vitest from v0.31.0 to v4.0.7 (major version)
- Migrated from @vitest/coverage-c8 to @vitest/coverage-v8
- Updated @playwright/test from v1.33.0 to v1.56.1
- Updated @faker-js/faker from v7.6.0 to v10.1.0 (major version)
- Updated @testing-library/svelte from v3.2.2 to v5.2.8 (major version)
- Updated @testing-library/jest-dom from v5.16.5 to v6.7.0
- Switched from happy-dom v9.10.9 to jsdom (latest) for component tests

**Linting & Formatting**
- Migrated from ESLint + Prettier to Biome v2.3.4 (unified tooling)
- Removed ESLint-related packages and Prettier plugins
- Added biome.json configuration with project-specific rules

**Build & Deploy**
- Updated @sveltejs/adapter-netlify from v2.0.7 to v5.2.4 (major version)

**CI/CD**
- Updated GitHub Actions workflow to use latest action versions
- Updated actions/checkout from v3 to v4
- Updated actions/setup-node from v3 to v4
- Updated arduino/setup-task from v1 to v2
- Updated Node.js runtime from 18.x to 22.x (latest LTS)

**Libraries**
- Updated axios from v1.4.0 to v1.13.2
- Updated zod from v3.22.3 to v4.1.12 (major version)
- Updated nock from v13.3.1 to v14.0.10
- Updated svelte-check from v3.3.1 to v4.3.3
- Updated tslib from v2.5.0 to v2.8.1

#### Fixed

**Configuration Updates**
- Fixed `svelte.config.js`: Updated `vitePreprocess` import from `@sveltejs/kit/vite` to `@sveltejs/vite-plugin-svelte`
- Fixed `vite.config.js`: Moved `fs.allow` configuration into `server.fs.allow` (Vite v7 requirement)
- Updated `vitest.unit.ts` and `vitest.components.ts`: Changed coverage provider from 'c8' to 'v8'
- Updated `vitest.unit.ts` and `vitest.components.ts`: Changed deprecated `cache.dir` to `cacheDir` (Vitest v4 requirement)
- Fixed `app.html`: Removed hardcoded `<title>` tag to allow page-specific titles from `<svelte:head>`

**Test Fixes**
- Updated Faker.js API calls: `faker.datatype.number()` → `faker.number.int({ min: 1, max: 1000 })`
- Updated Faker.js API calls: `faker.datatype.string()` → `faker.string.alpha()`
- Fixed PhotoCalculator test: Changed from random to fixed test values for deterministic results
- Fixed Gateway test: Added proper nock configuration with `disableNetConnect()` and `afterEach` cleanup
- Fixed PhotoBrowser test: Updated asymmetric matchers to use `expect.arrayContaining()` and `expect.objectContaining()`
- Removed `.concurrent` from all describe blocks to fix nock interceptor issues
- Added missing imports: `beforeEach`, `expect`, `vitest` to test files
- Updated E2E test expectations to match actual page titles with "Photo Browser | " prefix
- Added missing `await` to all `expect().rejects.toThrowError()` assertions (15 tests) for Vitest v3+ compatibility

**Code Quality**
- Fixed Biome linting errors in `src/lib/domain/Group.ts`: Replaced assignment in expression with explicit if statement
- Fixed all import organization according to Biome rules
- Fixed all code formatting issues with `biome check --write`

#### Added

**New Configuration Files**
- Added `biome.json` for unified linting and formatting
- Added `renovate.json` for automated dependency updates
- Added `jsdom` package for Svelte 4 component testing compatibility
- Added CHANGELOG.md for tracking changes

**New TODO**
- Added note about Svelte 5 migration: Component tests currently use Svelte 4 due to @testing-library/svelte compatibility. Future updates should monitor for Svelte 5 support.

#### Removed

- Removed ESLint and all eslint-* packages
- Removed Prettier and prettier-* packages  
- Removed happy-dom in favor of jsdom
- Removed unused TypeScript ESLint packages
- Removed `.eslintrc.cjs` configuration file

**Breaking Changes Handled**
- SvelteKit v2: Updated import paths and configuration
- Svelte v4: Chose v4 over v5 for component test stability
- Vitest v4: Updated test syntax and coverage provider
- Vite v7: Updated configuration structure
- Faker v10: Updated API calls throughout tests
- Zod v4: No breaking changes in current usage
- nock v14: Updated HTTP mocking configuration

---

## [1.0.0]

### Added
- Initial release with SvelteKit, Svelte 3, and hexagonal architecture
- Photo browser with album grouping
- Full test suite (unit, component, E2E)
- Deployment to Netlify

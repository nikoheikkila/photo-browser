# 🌅 SvelteKit Photo Browser 🌉

A website for browsing photos and albums delivered via Typicode API.

The real purpose of this project is to demonstrate building a modern frontend application architecture with **SvelteKit** and **Hexagonal / Clean Architecture** principles.

<!-- TODO: Add blog post link here -->

## Demo

See the demo application on [**Netlify**](https://sveltekit-photo-browser.netlify.app/).

## Instructions

First, install [Taskfile](https://taskfile.dev/installation).

```shell
# Install dependencies
task install

# Run application in development mode
task dev
```

## Architecture

<!-- TODO: add architecture diagram to repository and link here -->

### Components

Components used to build this application:

- Svelte & SvelteKit
- TypeScript
- Zod schema parser
- Dracula UI

### Structure

The structure follows the Hexagonal / Clean Architecture principles regarding:

- **domain layer** describing photo entities and relevant business logic
- **service layer** handling the use cases for listing individual or multiple photos and albums
- **Svelte components** rendering with data provided through view models
- **infrastructure layer** handling
  - page visits via an inbound adapter
  - error handling via an outbound adapter
  - external API calls via an outbound adapter

Additionally, SvelteKit uses routing based on filesystem structure.

### Tests

The architecture has been designed with testability as the first priority.

- Unit tests built with Vitest targeting the use cases and domain logic. Dependency to the external API is replaced with a test double returning stub responses (see `*.test.ts` files for details).
- Acceptance tests built with Playwright targeting the user interface of the application (see `*.spec.ts` files for details).

The full test suite runs in a matter of minutes, which is acceptable for a robust feedback loop.

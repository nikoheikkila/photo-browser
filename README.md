# 🌅 SvelteKit Photo Browser 🌉

A website for browsing photos and albums delivered via Typicode API.

The real purpose of this project is to demonstrate building a modern frontend application architecture with **SvelteKit** and **Hexagonal / Clean Architecture** principles.

<!-- TODO: Add blog post series link here -->

## Demo

See the demo application on [**Netlify**](https://sveltekit-photo-browser.netlify.app/).

## Instructions

1. Install [Taskfile](https://taskfile.dev/installation).
2. Install project dependencies with `task install`
3. Run application development mode with `task dev`
4. Make changes
5. Run tests with `task test`

## Architecture

Overview of the software architecture and design is visualised in a Mermaid diagram below.

```mermaid
classDiagram
    direction

    class SvelteKit {
        <<Framework>>
    }

    class Layout {
        load(LayoutParams params) LayoutData
    }

    class Page {
        ssr : boolean
        csr : boolean
        load(RouteParams params) PageData
    }

    class Component
    class Script
    class HTML
    class Style

    class PhotoBrowser {
        <<Service>>
        withLimit(int limit) self
        loadPhotos() Array~Photo~
        loadPhoto(int id) Photo
        loadFromAlbum(int albumId) Array~Photo~
        groupPhotosByAlbum() Array~Album~
    }

    class PhotoCalculator {
        <<Service>>
        parseFullSize() Tuple~int~
        parseThumbnailSize() Tuple~int~
    }

    class Photo {
        <<Entity>>
        id : int
        albumId : int
        title : string
        url : URL
        thumbnailUrl : URL
    }

    class PhotoGateway~T~ {
        <<interface>>
        fetchPhotos(FetchParams args) Array~T~
	    fetchPhoto(int id) T
	    fetchPhotosByAlbumId(int albumId, FetchParams params) Dictionary~T~
    }

    class APIGateway~T~ {
        <<Adapter>>
    }

    class Typicode {
        <<REST API>>
    }

    class Vitest {
        <<Test Framework>>
    }

    class FakeGateway~T~ {
        <<Test Double>>
    }

    class FakerJS {
        <<library>>
    }

    SvelteKit "1" --> "1" PhotoBrowser : uses
    SvelteKit "1" --> "1" PhotoCalculator : uses
    SvelteKit "1" --> "1" Layout : loads
    Layout "1" --> "*" Page : contains
    Page "1" --o "*" Component : renders
    Component "1" --> "1" Script : contains
    Component "1" --> "1" HTML : contains
    Component "1" --> "1" Style : contains

    PhotoBrowser --> APIGateway : uses
    Vitest --> FakeGateway : uses
    PhotoGateway "1" --> "*" Photo : fetches

    APIGateway --|> PhotoGateway : implements
    APIGateway ..> Typicode : uses
    FakeGateway --|> PhotoGateway : implements
    FakeGateway ..> FakerJS : uses
```

### Components

Modules used to build this application:

- [**Svelte**](https://svelte.dev/)
- [**SvelteKit**](https://kit.svelte.dev/)
- **Zod** schema parser
- **Axios**
- **TypeScript**
- **Dracula UI**

### Structure

The structure follows the Hexagonal / Clean Architecture principles regarding:

- **application layer** using
  - SvelteKit routes to retrieve data for view models
  - Svelte components to render UIs
- **service layer** handling the use cases for
  - grouping all photos by album
  - retrieving a photos belonging to a specific album
  - retrieving a single photo
  - calculating sizes for photos and thumbnails
- **domain layer** describing photo entities and relevant business logic
- **infrastructure layer** handling
  - external REST calls via an outbound adapter
  - error handling via an outbound adapter (only `console.error` for now)

### Tests

The architecture has been designed with testability as the first priority.

Unit tests are built with [**Vitest**](https://vitest.dev/) targeting the use cases and domain logic. Dependency to the external API is replaced with a test double returning stub responses. See `*.test.ts` files under `src/` directory for details.

Acceptance tests are built with [**Playwright**](https://playwright.dev/) targeting the application UI. See `*.spec.ts` files under `tests/`directory for details.

The full test suite runs in a matter of minutes both locally and in **GitHub Actions**, which is acceptable for a robust feedback loop.

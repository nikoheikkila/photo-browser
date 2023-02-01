# 🌅 SvelteKit Photo Browser 🌉

A website for browsing photos and albums delivered via Typicode API.

The real purpose of this project is to demonstrate building a modern frontend application architecture with **SvelteKit** and **Hexagonal / Clean Architecture** principles.

## Clean Frontend Architecture with SvelteKit

Read [the guide](https://nikoheikkila.fi/blog/clean-frontend-architecture-with-sveltekit) in my blog where I'm building the application and explaining the design process behind it.

## Demo

See the demo application on [**Netlify**](https://sveltekit-photo-browser.netlify.app/).

## Instructions

1. Install [Task](https://taskfile.dev/installation)
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

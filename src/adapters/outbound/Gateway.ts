import { env } from '$env/dynamic/public';

export type FetchParams = {
	limit: number;
};

export interface PhotoGateway<T extends Dictionary> {
	fetchPhotos(args: FetchParams): Promise<T[]>;
	fetchPhoto(id: number): Promise<T>;
	fetchPhotosByAlbumId(albumId: number, params: FetchParams): Promise<T[]>;
}

export class APIGateway implements PhotoGateway<Dictionary> {
	private readonly fetch: Fetcher;

	constructor(fetch?: Fetcher) {
		this.fetch = fetch || globalThis.fetch;
	}

	public async fetchPhotos(args: FetchParams): Promise<Dictionary[]> {
		return this.get('/photos', args);
	}

	public async fetchPhoto(id: number): Promise<Dictionary> {
		return this.get(`/photos/${id}`);
	}

	public async fetchPhotosByAlbumId(albumId: number, params: FetchParams): Promise<Dictionary[]> {
		return this.get(`/albums/${albumId}/photos`, params);
	}

	private async get(route: string, query?: FetchParams) {
		return this.fetch(URLBuilder.build(route, query)).then(this.toJSON);
	}

	private toJSON(response: Response) {
		if (!response.ok) {
			throw new Error(`Request failed with status code ${response.status}`);
		}

		return response.json();
	}
}

export class FakeGateway implements PhotoGateway<Dictionary> {
	private stubs: Dictionary[] = [];
	private error: Error | null = null;

	private readonly stubPhoto = {
		id: 1,
		albumId: 3,
		title: 'My Photo',
		url: 'https://via.placeholder.com/600/92c952',
		thumbnailUrl: 'https://via.placeholder.com/150/92c952'
	};

	public feedWith(stubs: Dictionary[]) {
		this.stubs = stubs;
	}

	public setError(error: Error) {
		this.error = error;
	}

	public async fetchPhotos(args: FetchParams): Promise<Dictionary[]> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return [...this.stubs];

		const { limit } = args;

		return Array.from({ length: limit }, (_, index) => {
			return {
				...this.stubPhoto,
				id: index + 1
			};
		});
	}

	public async fetchPhoto(id: number): Promise<Dictionary> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return this.stubs[0];

		return {
			...this.stubPhoto,
			id
		};
	}

	public async fetchPhotosByAlbumId(albumId: number, params: FetchParams): Promise<Dictionary[]> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return [...this.stubs];

		const { limit } = params;

		return Array.from({ length: limit }, (_, index) => {
			return {
				...this.stubPhoto,
				id: index + 1,
				albumId
			};
		});
	}
}

class URLBuilder {
	public static build(route: string, query?: FetchParams) {
		const url = this.verifyURL();
		url.pathname = route;

		for (const [key, value] of Object.entries(query || {})) {
			url.searchParams.append(key, value.toString());
		}

		return url;
	}

	private static verifyURL() {
		const url = env.PUBLIC_PHOTO_API_URL;

		if (!url || url.length === 0) {
			throw new Error('Missing environment variable: PUBLIC_PHOTO_API_URL');
		}

		return new URL(url);
	}
}

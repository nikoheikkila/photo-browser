import Environment from './Environment';

export type FetchParams = {
	/**
	 * Maximum number of entities to return.
	 * Note the underscore prefix required by Typicode API.
	 */
	_limit: number;
};

export interface PhotoGateway<T = Dictionary> {
	fetchPhotos(args: FetchParams): Promise<T[]>;
	fetchPhoto(id: number): Promise<T>;
	fetchPhotosByAlbumId(albumId: number, params: FetchParams): Promise<T[]>;
}

export class APIGateway implements PhotoGateway<Dictionary> {
	private readonly urlBuilder: URLBuilder;

	constructor() {
		this.urlBuilder = new URLBuilder();
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
		return fetch(this.urlBuilder.build(route, query)).then(this.toJSON);
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

	public async fetchPhotos(params: FetchParams): Promise<Dictionary[]> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return [...this.stubs];

		const { _limit: limit } = params;

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

		const { _limit: limit } = params;

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
	private readonly environment: Environment;

	constructor() {
		this.environment = new Environment();
	}
	public build(route: string, query?: FetchParams) {
		const url = new URL(this.environment.getPublicVariable('PUBLIC_PHOTO_API_URL'));
		url.pathname = route;

		for (const [key, value] of Object.entries(query || {})) {
			url.searchParams.append(key, value.toString());
		}

		return url;
	}
}

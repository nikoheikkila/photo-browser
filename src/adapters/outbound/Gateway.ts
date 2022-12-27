import * as process from 'process';

export type Dictionary = Record<string, unknown>;

export type FetchParams = {
	limit: number;
};

export interface PhotoGateway<T> {
	fetchPhotos(args: FetchParams): Promise<T[]>;
	fetchPhoto(id: number): Promise<T>;
	fetchPhotosByAlbumId(albumId: number, params: FetchParams): Promise<T[]>;
}

export class APIGateway implements PhotoGateway<Dictionary> {
	private readonly baseURL = 'https://jsonplaceholder.typicode.com';

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
		return fetch(this.buildURL(route, query)).then(this.toJSON).catch(this.handleError);
	}

	private toJSON(response: Response) {
		if (!response.ok) {
			throw new Error(`Request failed with status code ${response.status}`);
		}

		return response.json();
	}

	private handleError(error: Error): never {
		console.error(error);
		throw error;
	}

	private buildURL(route: string, query: FetchParams | undefined) {
		const url = new URL(this.baseURL);
		url.pathname = route;

		for (const [key, value] of Object.entries(query || {})) {
			url.searchParams.append(key, value.toString());
		}

		return url;
	}
}

export class FakeGateway implements PhotoGateway<Dictionary> {
	private stubs: Dictionary[] = [];
	private error: Error | null = null;
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
				id: index + 1,
				albumId: 10,
				title: 'My Photo',
				url: 'https://via.placeholder.com/600/92c952',
				thumbnailUrl: 'https://via.placeholder.com/150/92c952'
			};
		});
	}

	public async fetchPhoto(id: number): Promise<Dictionary> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return this.stubs[0];

		return {
			id,
			albumId: 10,
			title: 'My Photo',
			url: 'https://via.placeholder.com/600/92c952',
			thumbnailUrl: 'https://via.placeholder.com/150/92c952'
		};
	}

	public async fetchPhotosByAlbumId(albumId: number, params: FetchParams): Promise<Dictionary[]> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return [...this.stubs];

		const { limit } = params;

		return Array.from({ length: limit }, (_, index) => {
			return {
				id: index + 1,
				albumId,
				title: 'My Photo',
				url: 'https://via.placeholder.com/600/92c952',
				thumbnailUrl: 'https://via.placeholder.com/150/92c952'
			};
		});
	}
}

export default () => {
	return process.env.NODE_ENV === 'test' ? new FakeGateway() : new APIGateway();
};

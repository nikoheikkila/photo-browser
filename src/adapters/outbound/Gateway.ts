import axios, { HttpStatusCode } from 'axios';
import type { AxiosInstance } from 'axios';

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

export class APIGateway implements PhotoGateway {
	private readonly client: AxiosInstance;
	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL
		});
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

	private async get<T>(route: string, params?: FetchParams): Promise<T> {
		const response = await this.client.get<T>(route, {
			params
		});

		if (response.status !== HttpStatusCode.Ok) {
			throw new Error(
				`Request failed with status code ${response.status} and message ${response.statusText}`
			);
		}

		return response.data;
	}
}

export class FakeGateway implements PhotoGateway {
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

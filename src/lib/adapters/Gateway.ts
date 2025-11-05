import type { AxiosInstance } from 'axios';
import axios, { AxiosError } from 'axios';

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
	constructor(baseURL?: string) {
		this.client = axios.create({
			baseURL: this.validateBaseURL(baseURL)
		});
	}

	public async fetchPhotos(args?: FetchParams): Promise<Dictionary[]> {
		return this.get('/photos', args);
	}

	public async fetchPhoto(id: number): Promise<Dictionary> {
		return this.get(`/photos/${id}`);
	}

	public async fetchPhotosByAlbumId(albumId: number, params?: FetchParams): Promise<Dictionary[]> {
		return this.get(`/albums/${albumId}/photos`, params);
	}

	private async get<T>(route: string, params?: FetchParams): Promise<T> {
		return this.client
			.get<T>(route, {
				params
			})
			.then((response) => response.data)
			.catch(this.handleError);
	}

	private handleError(error: Error): never {
		if (error instanceof AxiosError && error.response) {
			const { status, data: message } = error.response;
			throw new AxiosError(`HTTP ${status}: ${message}`);
		}

		throw error;
	}

	private validateBaseURL(baseURL: string | undefined): string {
		try {
			return new URL(baseURL || '').href;
		} catch {
			throw new Error(`Invalid base URL '${baseURL}' given`);
		}
	}
}

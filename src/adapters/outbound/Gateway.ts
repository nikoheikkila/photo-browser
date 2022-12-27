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
	public async fetchPhotos(args: FetchParams): Promise<Dictionary[]> {
		const { limit } = args;

		const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}`);
		return await response.json();
	}

	public async fetchPhoto(id: number): Promise<Dictionary> {
		const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`);
		return await response.json();
	}

	public async fetchPhotosByAlbumId(albumId: number, params: FetchParams): Promise<Dictionary[]> {
		const { limit } = params;

		const response = await fetch(
			`https://jsonplaceholder.typicode.com/albums/${albumId}/photos?_limit=${limit}`
		);
		return await response.json();
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

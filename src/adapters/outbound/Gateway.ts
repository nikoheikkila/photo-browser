import * as process from 'process';

export type JSONResponse = Record<string, unknown>;

export type FetchPhotosArgs = {
	limit: number;
};

export interface PhotoGateway {
	fetchPhotos(args: FetchPhotosArgs): Promise<JSONResponse[]>;
	fetchPhoto(id: number): Promise<JSONResponse>;
}

export class APIGateway implements PhotoGateway {
	public async fetchPhotos(args: FetchPhotosArgs): Promise<JSONResponse[]> {
		const { limit } = args;

		const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}`);
		return await response.json();
	}

	public async fetchPhoto(id: number): Promise<JSONResponse> {
		const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`);
		return await response.json();
	}
}

export class FakeGateway implements PhotoGateway {
	private stubs: JSONResponse[] = [];
	private error: Error | null = null;
	public feedWith(stubs: JSONResponse[]) {
		this.stubs = stubs;
	}

	public setError(error: Error) {
		this.error = error;
	}

	public async fetchPhotos(args: FetchPhotosArgs): Promise<JSONResponse[]> {
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

	public async fetchPhoto(id: number): Promise<JSONResponse> {
		return {
			id,
			albumId: 10,
			title: 'My Photo',
			url: 'https://via.placeholder.com/600/92c952',
			thumbnailUrl: 'https://via.placeholder.com/150/92c952'
		};
	}
}

export default () => {
	return process.env.NODE_ENV === 'test' ? new FakeGateway() : new APIGateway();
};

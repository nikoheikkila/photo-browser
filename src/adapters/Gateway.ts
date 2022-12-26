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

import type { PhotoGateway } from '../adapters/Gateway';
import type { Photo } from '../domain/Photo';
import { createPhoto } from '../domain/Photo';

export default class PhotoBrowser {
	private readonly gateway: PhotoGateway;
	private readonly defaultLimit = 100;

	constructor(gateway: PhotoGateway) {
		this.gateway = gateway;
	}

	public async loadPhotos(limit?: number): Promise<Photo[]> {
		const response = await this.gateway.fetchPhotos({
			limit: limit ?? this.defaultLimit
		});

		return this.responseToArray(response).map(createPhoto);
	}

	private responseToArray(response: string) {
		if (response.length === 0) {
			throw new Error('Received empty JSON response');
		}

		try {
			return Array.from<Record<string, unknown>>(JSON.parse(response));
		} catch (error: unknown) {
			throw new Error('Received malformed JSON response');
		}
	}
}

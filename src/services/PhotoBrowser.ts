import type { Dictionary, PhotoGateway } from '../adapters/outbound/Gateway';
import type { Photo } from '../domain/Photo';
import { createPhoto } from '../domain/Photo';

export default class PhotoBrowser {
	private readonly gateway: PhotoGateway<Dictionary>;
	private limit = 100;

	constructor(gateway: PhotoGateway<Dictionary>) {
		this.gateway = gateway;
	}

	public withLimit(limit: number): this {
		if (limit < 1) throw new Error('Photo limit must be greater than zero');

		this.limit = limit;
		return this;
	}

	public async loadPhotos(): Promise<Photo[]> {
		const response = await this.fetchPhotos();

		return response.map(createPhoto);
	}

	public async loadPhoto(id: number): Promise<Photo> {
		if (id < 1) {
			throw new Error('Photo ID must be greater than zero');
		}

		const response = await this.gateway.fetchPhoto(id);

		return createPhoto(response);
	}

	public async loadFromAlbum(albumId: number): Promise<Photo[]> {
		const response = await this.gateway.fetchPhotosByAlbumId(albumId, { limit: this.limit });

		return response.map(createPhoto);
	}

	private async fetchPhotos() {
		try {
			return await this.gateway.fetchPhotos({
				limit: this.limit
			});
		} catch (error: unknown) {
			throw new Error(`Received error from server: '${error}'`);
		}
	}
}

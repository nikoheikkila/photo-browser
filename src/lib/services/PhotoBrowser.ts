import type { PhotoGateway } from '../adapters/Gateway';
import type { Photo } from '../domain/Photo';
import { createPhoto } from '../domain/Photo';
import { groupByKey } from '../domain/Group';

export type Albums = Dictionary<number, Photo[]>;

export default class PhotoBrowser {
	private readonly gateway: PhotoGateway;
	private limit = 1000;

	constructor(gateway: PhotoGateway) {
		this.gateway = gateway;
	}

	public withLimit(limit: number): this {
		if (limit < 1) throw new Error('Photo limit must be greater than zero');

		this.limit = limit;
		return this;
	}

	public async loadPhotos(): Promise<Photo[]> {
		return this.gateway
			.fetchPhotos({ _limit: this.limit })
			.then((response) => response.map(createPhoto));
	}

	public async loadPhoto(id: number): Promise<Photo> {
		if (id < 1) {
			throw new Error('Photo ID must be greater than zero');
		}

		return this.gateway.fetchPhoto(id).then(createPhoto);
	}

	public async loadFromAlbum(albumId: number): Promise<Photo[]> {
		if (albumId < 1) {
			throw new Error('Album ID must be greater than zero');
		}

		return this.gateway
			.fetchPhotosByAlbumId(albumId, { _limit: this.limit })
			.then((response) => response.map(createPhoto));
	}

	public async groupPhotosByAlbum(): Promise<Albums> {
		return this.loadPhotos().then(groupByKey<Photo>((photo) => photo.albumId));
	}
}

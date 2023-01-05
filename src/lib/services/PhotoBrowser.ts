import type { PhotoGateway } from '../adapters/outbound/Gateway';
import type { Photo } from '../domain/Photo';
import { Dimensions } from '../domain/Schema';
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

	public static parseFullSize(photo: Photo): Dimensions {
		return this.parseSizeFromURL(photo.url, { width: 600, height: 600 });
	}

	public static parseThumbnailSize(photo: Photo): Dimensions {
		return this.parseSizeFromURL(photo.thumbnailUrl, { width: 150, height: 150 });
	}

	private static parseSizeFromURL(url: URL, fallback: Dimensions): Dimensions {
		const dimension = url.pathname.match(/^\/(\d+)\/(.+)$/)?.at(1);
		const result = Number.parseInt(dimension || '', 10);

		if (Number.isNaN(result) || result === 0) {
			return fallback;
		}

		return Dimensions.parse({
			width: result,
			height: result
		});
	}
}

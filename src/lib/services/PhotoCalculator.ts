import type { Photo } from '$lib/domain/Photo';
import type { Dimensions } from '$lib/domain/Dimensions';
import { parseDimensions } from '../domain/Dimensions';

export class PhotoCalculator {
	private readonly photo: Photo;
	private readonly dimensionPattern: RegExp = /^\/(\d+)\/(.+)$/;
	private readonly defaultFullSize: Dimensions = { width: 600, height: 600 };

	private readonly defaultThumbnailSize: Dimensions = { width: 150, height: 150 };

	constructor(photo: Photo) {
		this.photo = photo;
	}

	public parseFullSize(): Dimensions {
		return this.parseSizeFromURL(this.photo.url, this.defaultFullSize);
	}

	public parseThumbnailSize(): Dimensions {
		return this.parseSizeFromURL(this.photo.thumbnailUrl, this.defaultThumbnailSize);
	}

	private parseSizeFromURL(url: URL, fallback: Dimensions): Dimensions {
		const dimension = url.pathname.match(this.dimensionPattern)?.at(1);
		const result = Number.parseInt(dimension || '');

		if (Number.isNaN(result) || result < 1) {
			return parseDimensions(fallback);
		}

		return parseDimensions({
			width: result,
			height: result
		});
	}
}

import type { Dimensions } from '$lib/domain/Dimensions';
import type { Photo } from '$lib/domain/Photo';
import { parseDimensions } from '../domain/Dimensions';

export class PhotoCalculator {
	private readonly photo: Photo;
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
		const pathSegments = url.pathname.split('/').filter(Boolean).at(0);
		const result = Number(pathSegments);

		try {
			return parseDimensions({
				width: result,
				height: result
			});
		} catch {
			return parseDimensions(fallback);
		}
	}
}

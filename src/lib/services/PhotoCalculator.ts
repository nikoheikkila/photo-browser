import type { Photo } from '$lib/domain/Photo';
import { Dimensions } from '$lib/domain/Dimensions';

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
		const dimension = url.pathname.match(/^\/(\d+)\/(.+)$/)?.at(1);
		const result = Number.parseInt(dimension || '', 10);

		if (Number.isNaN(result) || result === 0) {
			return Dimensions.parse(fallback);
		}

		return Dimensions.parse({
			width: result,
			height: result
		});
	}
}

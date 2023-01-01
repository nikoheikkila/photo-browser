import * as z from 'zod';

const positiveInteger = (error: string) => z.number().int().min(1, { message: error });
const nonEmptyString = (error: string) => z.string().min(1, { message: error });

const validURL = (error: string) =>
	z
		.string()
		.url({ message: error })
		.transform((url) => new URL(url));

const Photo = z.object({
	id: positiveInteger('Photo ID must be greater than zero'),
	albumId: positiveInteger('Album ID must be greater than zero'),
	title: nonEmptyString('Title must be a non-empty string'),
	url: validURL('Photo URL must be valid'),
	thumbnailUrl: validURL('Thumbnail URL must be valid')
});

const Dimensions = z.object({
	width: positiveInteger('Width must be greater than zero'),
	height: positiveInteger('Height must be greater than zero')
});

export type Photo = z.infer<typeof Photo>;
export type Dimensions = z.infer<typeof Dimensions>;

export function createPhoto(data: Dictionary): Photo {
	const result = Photo.safeParse(data);

	if (!result.success) {
		throw new Error(`Received malformed JSON response: ${result.error.message}`);
	}

	return result.data;
}

export const parseFullSize = (photo: Photo) =>
	parseSizeFromURL(photo.url, { width: 600, height: 600 });

export const parseThumbnailSize = (photo: Photo) =>
	parseSizeFromURL(photo.thumbnailUrl, { width: 150, height: 150 });

const parseSizeFromURL = (url: URL, fallback: Dimensions): Dimensions => {
	const dimension = url.pathname.match(/^\/(\d+)\/(.+)$/)?.at(1);
	const result = Number.parseInt(dimension || '', 10);

	if (Number.isNaN(result) || result === 0) {
		return fallback;
	}

	return Dimensions.parse({
		width: result,
		height: result
	});
};

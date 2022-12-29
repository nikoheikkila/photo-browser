import * as z from 'zod';
import { handleError } from '../adapters/outbound/Errors';

const positiveInteger = (defaultValue: number) =>
	z.number().int().min(1).optional().default(defaultValue);
const nonEmptyString = (defaultValue = '') => z.string().min(1).optional().default(defaultValue);

const validURL = () =>
	z
		.string()
		.url()
		.transform((url) => new URL(url));

export const schema = z.object({
	id: positiveInteger(1),
	albumId: positiveInteger(1),
	title: nonEmptyString('Title'),
	url: validURL(),
	thumbnailUrl: validURL()
});

export type Photo = z.infer<typeof schema>;

export function createPhoto(args: Record<string, unknown>): Photo {
	try {
		return schema.parse(args);
	} catch (error: unknown) {
		handleError(error);

		if (error instanceof z.ZodError) {
			throw new Error('Received malformed JSON response');
		}

		throw error;
	}
}

type Dimensions = { width: number; height: number };

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

	return {
		width: result,
		height: result
	};
};

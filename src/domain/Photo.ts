import * as z from 'zod';
import * as Schema from './Schema';
export const Photo = z.object({
	id: Schema.positiveInteger('Photo ID must be greater than zero'),
	albumId: Schema.positiveInteger('Album ID must be greater than zero'),
	title: Schema.nonEmptyString('Title must be a non-empty string'),
	url: Schema.validURL('Photo URL must be valid'),
	thumbnailUrl: Schema.validURL('Thumbnail URL must be valid')
});

export type Photo = z.infer<typeof Photo>;
export function createPhoto(data: Dictionary): Photo {
	const result = Photo.safeParse(data);

	if (!result.success) {
		throw new Error(`Received malformed JSON response: ${result.error.message}`);
	}

	return result.data;
}

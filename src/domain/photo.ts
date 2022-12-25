import * as z from 'zod';

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

export function create(args: Record<string, unknown> = {}): Photo {
	return schema.parse(args);
}

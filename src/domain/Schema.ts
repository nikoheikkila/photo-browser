import * as z from 'zod';

export const positiveInteger = (error: string) => z.number().int().min(1, { message: error });
export const nonEmptyString = (error: string) => z.string().min(1, { message: error });

export const validURL = (error: string) =>
	z
		.string()
		.url({ message: error })
		.transform((url) => new URL(url));
export const Dimensions = z.object({
	width: positiveInteger('Width must be greater than zero'),
	height: positiveInteger('Height must be greater than zero')
});

export type Dimensions = z.infer<typeof Dimensions>;

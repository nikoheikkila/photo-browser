import * as z from 'zod';
import { positiveInteger } from './Schema';

const Dimensions = z.object({
	width: positiveInteger('Width must be greater than zero'),
	height: positiveInteger('Height must be greater than zero')
});

export type Dimensions = z.infer<typeof Dimensions>;

export function parseDimensions(data: Dictionary): Dimensions {
	const result = Dimensions.safeParse(data);

	if (!result.success) {
		throw new Error(`Can not parse dimensions from invalid data: ${result.error.message}`);
	}

	return result.data;
}

import * as z from 'zod';
import { positiveInteger } from './Schema';

export const Dimensions = z.object({
	width: positiveInteger('Width must be greater than zero'),
	height: positiveInteger('Height must be greater than zero')
});

export type Dimensions = z.infer<typeof Dimensions>;

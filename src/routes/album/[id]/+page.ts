import { handleError } from '../../../adapters/outbound/Errors';
import type { Photo } from '../../../domain/Photo';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { parseNumericParameter } from '../../../helpers';
import { browser } from '../../../services';

type Response = {
	albumId: number;
	photos: Photo[];
};

export const load: PageLoad<Response> = async ({ params }) => {
	const id = parseNumericParameter(params.id, `Invalid album ID '${params.id}' given`);

	try {
		const photos = await browser.withLimit(50).loadFromAlbum(id);

		return { albumId: id, photos };
	} catch (err: unknown) {
		handleError(err);
		throw error(404, `Could not find album with ID ${id}`);
	}
};

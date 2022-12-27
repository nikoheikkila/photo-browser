import type { PageLoad } from './$types';
import PhotoBrowser from '../../../services/PhotoBrowser';
import { APIGateway } from '../../../adapters/outbound/Gateway';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const id = Number.parseInt(params.id, 10);
	const browser = new PhotoBrowser(new APIGateway());

	try {
		const photo = await browser.loadPhoto(id);

		return { photo };
	} catch (err: unknown) {
		throw error(404, {
			message: `Photo not found with given ID ${id}`
		});
	}
}) satisfies PageLoad;

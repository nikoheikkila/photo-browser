import type { PageLoad } from './$types';
import PhotoBrowser from '../services/PhotoBrowser';
import { APIGateway } from '../adapters/Gateway';
import { error } from '@sveltejs/kit';

export const load = (async () => {
	const browser = new PhotoBrowser(new APIGateway());

	try {
		const photos = await browser.loadPhotos();

		return { photos };
	} catch (err: unknown) {
		throw error(500, {
			message: `Failed to load photos. Reason: ${err}`
		});
	}
}) satisfies PageLoad;

import { error } from '@sveltejs/kit';
import { handleError } from '$lib/adapters/outbound/Errors';
import type { Albums } from '$lib/services/PhotoBrowser';
import type { PageLoad } from './$types';
import { browser } from '$lib/services';

type Response = {
	albums: Albums;
};

export const load: PageLoad<Response> = async () => {
	try {
		const albums = await browser.withLimit(500).groupPhotosByAlbum();

		return { albums };
	} catch (err: unknown) {
		handleError(err);
		throw error(500, 'Could not load photos');
	}
};

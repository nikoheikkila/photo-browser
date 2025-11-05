import type { HttpError } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { HttpStatusCode } from 'axios';
import { handleError } from '$lib/adapters/Errors';
import { browser } from '$lib/services';
import type { Albums } from '$lib/services/PhotoBrowser';
import type { PageLoad } from './$types';

type Response = {
	albums: Albums;
};

export const load: PageLoad<Response> = async () => {
	try {
		return {
			albums: await browser.withLimit(500).groupPhotosByAlbum()
		};
	} catch (err: unknown) {
		handleError(err);
		throw errorWhileLoadingPhotos();
	}
};

const errorWhileLoadingPhotos = (): HttpError =>
	error(HttpStatusCode.InternalServerError, 'Could not load photos');

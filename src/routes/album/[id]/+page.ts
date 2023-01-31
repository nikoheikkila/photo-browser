import { handleError } from '$lib/adapters/Errors';
import type { Photo } from '$lib/domain/Photo';
import type { PageLoad } from './$types';
import type { HttpError } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { browser } from '$lib/services';
import { HttpStatusCode } from 'axios';

type Response = {
	albumId: number;
	photos: Photo[];
};

export const load: PageLoad<Response> = async ({ params }) => {
	const albumId = Number.parseInt(params.id);

	if (Number.isNaN(albumId)) {
		throw invalidAlbum(params.id);
	}

	try {
		return {
			albumId,
			photos: await browser.withLimit(50).loadFromAlbum(albumId)
		};
	} catch (error: unknown) {
		handleError(error);
		throw notFoundAlbum(albumId);
	}
};

const invalidAlbum = (id: string): HttpError =>
	error(HttpStatusCode.BadRequest, `Invalid album ID '${id}' given`);

const notFoundAlbum = (id: number): HttpError =>
	error(HttpStatusCode.NotFound, `Could not find album with ID ${id}`);

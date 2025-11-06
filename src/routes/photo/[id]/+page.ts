import type { HttpError } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { HttpStatusCode } from 'axios';
import { formatError } from '$lib/adapters/Errors';
import type { Photo } from '$lib/domain/Photo';
import { browser } from '$lib/services';
import type { PageLoad } from './$types';

type Response = {
	photo: Photo;
};

export const load: PageLoad<Response> = async ({ params }) => {
	const id = Number.parseInt(params.id, 10);

	if (Number.isNaN(id)) {
		throw invalidPhoto(params.id);
	}

	try {
		return {
			photo: await browser.loadPhoto(id)
		};
	} catch (error: unknown) {
		console.error(formatError(error));
		throw notFoundPhoto(id);
	}
};

const notFoundPhoto = (id: number): HttpError =>
	error(HttpStatusCode.NotFound, `Could not find photo with ID ${id}`);

const invalidPhoto = (id: string): HttpError =>
	error(HttpStatusCode.BadRequest, `Invalid photo ID '${id}' given`);

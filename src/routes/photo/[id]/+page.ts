import { error } from '@sveltejs/kit';
import type { HttpError } from '@sveltejs/kit';
import { handleError } from '$lib/adapters/outbound/Errors';
import type { Photo } from '$lib/domain/Photo';
import type { PageLoad } from './$types';
import { parseNumericParameter } from '../../helpers';
import { browser } from '$lib/services';
import { HttpStatusCode } from 'axios';

type Response = {
	photo: Photo;
};

export const load: PageLoad<Response> = async ({ params }) => {
	const id = parseNumericParameter(params.id);

	if (Number.isNaN(id)) {
		throw invalidPhoto(params.id);
	}

	try {
		return {
			photo: await browser.loadPhoto(id)
		};
	} catch (err: unknown) {
		handleError(err);
		throw notFoundPhoto(id);
	}
};

const notFoundPhoto = (id: number): HttpError =>
	error(HttpStatusCode.NotFound, `Could not find photo with ID ${id}`);

const invalidPhoto = (id: string): HttpError =>
	error(HttpStatusCode.BadRequest, `Invalid photo ID '${id}' given`);

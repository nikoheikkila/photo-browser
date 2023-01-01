import type { HttpError, Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import PhotoBrowser from '../../services/PhotoBrowser';
import type { Albums } from '../../services/PhotoBrowser';
import type { RouteParams } from '../../routes/$types';
import type { Photo } from '../../domain/Photo';
import { handleError } from '../outbound/Errors';
import { APIGateway } from '../outbound/Gateway';
import { PUBLIC_PHOTO_API_URL } from '$env/static/public';

export type AlbumPhotos = {
	albumId: number;
	photos: Photo[];
};

export type AllPhotos = {
	albums: Albums;
};

export type SinglePhoto = {
	photo: Photo;
};

type LoadAllPhotosRoute = Load<RouteParams, null, Dictionary, AllPhotos, '/'>;

type LoadSinglePhotoRoute = Load<
	RouteParams & { id: string },
	null,
	Dictionary,
	SinglePhoto,
	'/photo/[id]'
>;

type LoadAlbumRoute = Load<
	RouteParams & { id: string },
	null,
	Dictionary,
	AlbumPhotos,
	'/album/[id]'
>;

const browser = new PhotoBrowser(new APIGateway(PUBLIC_PHOTO_API_URL));

export const loadPhotos: LoadAllPhotosRoute = async () => {
	try {
		const albums = await browser.withLimit(500).groupPhotosByAlbum();

		return { albums };
	} catch (error: unknown) {
		handleError(error);
		throw internalError('Could not load photos');
	}
};

export const loadPhoto: LoadSinglePhotoRoute = async ({ params }) => {
	const id = parseNumericParameter(params.id, `Invalid photo ID '${params.id}' given`);

	try {
		const photo = await browser.loadPhoto(id);

		return { photo };
	} catch (error: unknown) {
		handleError(error);
		throw notFoundError(`Could not find photo with ID ${id}`);
	}
};

export const loadAlbum: LoadAlbumRoute = async ({ params }) => {
	const id = parseNumericParameter(params.id, `Invalid album ID '${params.id}' given`);

	try {
		const photos = await browser.withLimit(50).loadFromAlbum(id);

		return { albumId: id, photos };
	} catch (error: unknown) {
		handleError(error);
		throw notFoundError(`Could not find album with ID ${id}`);
	}
};

const parseNumericParameter = (numeric: string, errorMessage: string): number => {
	const id = Number.parseInt(numeric, 10);

	if (Number.isNaN(id)) {
		throw badRequestError(errorMessage);
	}

	return id;
};

const notFoundError = (message: string): HttpError =>
	error(404, {
		message
	});

const internalError = (message: string): HttpError =>
	error(500, {
		message
	});

const badRequestError = (message: string): HttpError =>
	error(400, {
		message
	});

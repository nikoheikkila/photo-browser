import type { HttpError, Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import PhotoBrowser from '../../services/PhotoBrowser';
import type { RouteParams } from '../../routes/$types';
import type { Photo } from '../../domain/Photo';
import * as Group from '../../domain/Group';
import { handleError } from '../outbound/Errors';
import { APIGateway } from '../outbound/Gateway';
import * as Environment from '../outbound/Environment';

export type AlbumPhotos = {
	albumId: number;
	photos: Photo[];
};

export type GroupedPhotos = {
	photos: Dictionary<number, Photo[]>;
};

export type SinglePhoto = {
	photo: Photo;
};

type LoadPhotosRoute = Load<RouteParams, null, Dictionary, GroupedPhotos, '/'>;
type LoadPhotoRoute = Load<
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

const browser = new PhotoBrowser(
	new APIGateway(Environment.getPublicVariable('PUBLIC_PHOTO_API_URL'))
);
const groupByAlbum = Group.byKey((photo: Photo) => photo.albumId);

export const loadPhotos: LoadPhotosRoute = async () => {
	try {
		const photos = await browser.withLimit(500).loadPhotos();

		return { photos: groupByAlbum(photos) };
	} catch (error: unknown) {
		handleError(error);
		throw internalError('Failed to load photos');
	}
};

export const loadPhoto: LoadPhotoRoute = async ({ params }) => {
	const id = parseNumericParameter(params.id, `Invalid photo ID '${params.id}' given`);

	try {
		const photo = await browser.loadPhoto(id);

		return { photo };
	} catch (error: unknown) {
		handleError(error);
		throw notFoundError(`Could not load photo with ID ${id}`);
	}
};

export const loadAlbum: LoadAlbumRoute = async ({ params }) => {
	const id = parseNumericParameter(params.id, `Invalid album ID '${params.id}' given`);

	try {
		const photos = await browser.withLimit(50).loadFromAlbum(id);

		return { albumId: id, photos };
	} catch (error: unknown) {
		handleError(error);
		throw notFoundError(`Could not load album with ID ${id}`);
	}
};

const parseNumericParameter = (numeric: string, errorMessage: string): number => {
	const id = Number.parseInt(numeric, 10);

	if (Number.isNaN(id) || id < 1) {
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

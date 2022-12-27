import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import PhotoBrowser from '../../services/PhotoBrowser';
import Gateway from '../outbound/Gateway';
import type { RouteParams } from '../../routes/$types';
import type { Photo } from '../../domain/Photo';

type Dictionary = Record<string, unknown>;

export type SinglePhotoResponse = {
	photo: Photo;
};

export type PhotoCollectionResponse = {
	photos: Photo[];
};

type LoadPhotosRoute = Load<RouteParams, null, Dictionary, PhotoCollectionResponse, '/'>;
type LoadPhotoRoute = Load<
	RouteParams & { id: string },
	null,
	Dictionary,
	SinglePhotoResponse,
	'/photo/[id]'
>;

type LoadAlbumRoute = Load<
	RouteParams & { id: string },
	null,
	Dictionary,
	PhotoCollectionResponse,
	'/album/[id]'
>;

export const loadPhotos: LoadPhotosRoute = async () => {
	const browser = new PhotoBrowser(Gateway());

	try {
		const photos = await browser.loadPhotos();

		return { photos };
	} catch (err: unknown) {
		throw error(500, {
			message: `Failed to load photos. Reason: ${err}`
		});
	}
};

export const loadPhoto: LoadPhotoRoute = async ({ params }) => {
	const id = Number.parseInt(params.id, 10);
	const browser = new PhotoBrowser(Gateway());

	try {
		const photo = await browser.loadPhoto(id);

		return { photo };
	} catch (err: unknown) {
		throw error(404, {
			message: `Photo not found with given ID ${id}`
		});
	}
};

export const loadAlbum: LoadAlbumRoute = async ({ params }) => {
	const id = Number.parseInt(params.id, 10);
	const browser = new PhotoBrowser(Gateway());

	try {
		const photos = await browser.loadFromAlbum(id);

		return { photos };
	} catch (err: unknown) {
		throw error(404, {
			message: `Photo album not found with given ID ${id}`
		});
	}
};

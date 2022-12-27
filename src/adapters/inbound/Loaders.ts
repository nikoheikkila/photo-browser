import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import PhotoBrowser from '../../services/PhotoBrowser';
import Gateway from '../outbound/Gateway';
import type { RouteParams } from '../../routes/$types';
import type { Photo } from '../../domain/Photo';

type Dictionary = Record<string, unknown>;
type LoadPhotosRoute = Load<RouteParams, null, Dictionary, { photos: Photo[] }, '/'>;
type LoadPhotoRoute = Load<
	RouteParams & { id: string },
	null,
	Dictionary,
	{ photo: Photo },
	'/photo/[id]'
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

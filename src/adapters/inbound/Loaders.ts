import type { HttpError, Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import PhotoBrowser from '../../services/PhotoBrowser';
import Gateway from '../outbound/Gateway';
import type { RouteParams } from '../../routes/$types';
import type { Photo } from '../../domain/Photo';
import * as Group from '../../domain/Group';

type Dictionary = Record<string, unknown>;

export type AllPhotos = {
	photos: Photo[];
};

export type GroupedPhotos = {
	photos: Record<number, Photo[]>;
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
	AllPhotos,
	'/album/[id]'
>;

export const loadPhotos: LoadPhotosRoute = async () => {
	const groupByAlbum = Group.byKey((photo: Photo) => photo.albumId);
	const browser = new PhotoBrowser(Gateway());

	try {
		const photos = await browser.loadPhotos();

		return { photos: groupByAlbum(photos) };
	} catch (err: unknown) {
		console.error(err);
		throw internalError('Failed to load photos');
	}
};

export const loadPhoto: LoadPhotoRoute = async ({ params }) => {
	const id = Number.parseInt(params.id, 10);
	const browser = new PhotoBrowser(Gateway());

	try {
		const photo = await browser.loadPhoto(id);

		return { photo };
	} catch (err: unknown) {
		console.error(err);
		throw notFoundError(`Could not load photo with ID ${id}`);
	}
};

export const loadAlbum: LoadAlbumRoute = async ({ params }) => {
	const id = Number.parseInt(params.id, 10);
	const browser = new PhotoBrowser(Gateway());

	try {
		const photos = await browser.loadFromAlbum(id);

		return { photos };
	} catch (err: unknown) {
		console.error(err);
		throw notFoundError(`Could not load album with ID ${id}`);
	}
};

const notFoundError = (message: string): HttpError =>
	error(404, {
		message
	});

const internalError = (message: string): HttpError =>
	error(500, {
		message
	});

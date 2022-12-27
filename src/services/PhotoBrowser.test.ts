import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { FakeGateway } from '../adapters/outbound/Gateway';
import PhotoBrowser from './PhotoBrowser';
import { faker } from '@faker-js/faker';

describe('PhotoBrowser', () => {
	let gateway: FakeGateway;
	let browser: PhotoBrowser;

	beforeEach(() => {
		console.error = vitest.fn();
		gateway = new FakeGateway();
		browser = new PhotoBrowser(gateway);
	});

	describe('loading photos', () => {
		test('returns a collection of photos', async () => {
			const photos = await browser.loadPhotos();

			expect(photos.length).toBeGreaterThan(0);
		});

		test('returns a limited collection of photos', async () => {
			const limit = 5;
			const photos = await browser.withLimit(limit).loadPhotos();

			expect(photos).toHaveLength(limit);
		});

		test('returns a collection containing a valid photo', async () => {
			const expectedPhoto = {
				id: 1,
				albumId: 1,
				title: 'Title',
				url: 'https://example.com',
				thumbnailUrl: 'https://example.com'
			};
			gateway.feedWith([expectedPhoto]);

			const [actualPhoto] = await browser.loadPhotos();

			expect(actualPhoto).toStrictEqual({
				...expectedPhoto,
				url: new URL(expectedPhoto.url),
				thumbnailUrl: new URL(expectedPhoto.thumbnailUrl)
			});
		});

		test('throws error on invalid limit', () => {
			expect(() => browser.withLimit(0)).toThrowError('Photo limit must be greater than zero');
		});

		test('throws error on null server response', async () => {
			gateway.feedWith([{}]);

			expect(() => browser.loadPhotos()).rejects.toThrowError('Received malformed JSON response');
		});

		test('throws error on malformed server response', async () => {
			gateway.feedWith([{ key: faker.datatype.string() }]);

			expect(() => browser.loadPhotos()).rejects.toThrowError('Received malformed JSON response');
		});

		test('throws error on server error', async () => {
			const expectedError = 'Could not load photos';
			gateway.setError(new Error(expectedError));

			expect(() => browser.loadPhotos()).rejects.toThrowError(new RegExp(expectedError));
		});
	});

	describe('loading a single photo', () => {
		test('returns a single entity', async () => {
			const id = faker.datatype.number({ min: 1 });

			const photo = await browser.loadPhoto(id);

			expect(photo.id).toBe(id);
			expect(photo.albumId).toBeGreaterThan(0);
			expect(photo.title).not.toBe('');
			expect(photo.url).toBeInstanceOf(URL);
			expect(photo.thumbnailUrl).toBeInstanceOf(URL);
		});

		test('throws error with ID less than 1', async () => {
			expect(() => browser.loadPhoto(0)).rejects.toThrowError('Photo ID must be greater than zero');
		});

		test('throws error on null server response', async () => {
			gateway.feedWith([{}]);

			expect(() => browser.loadPhoto(1)).rejects.toThrowError('Received malformed JSON response');
		});

		test('throws error on malformed server response', async () => {
			gateway.feedWith([{ key: faker.datatype.string() }]);

			expect(() => browser.loadPhoto(1)).rejects.toThrowError('Received malformed JSON response');
		});

		test('throws error on server error', async () => {
			const expectedError = 'Could not load photo with ID 1';
			gateway.setError(new Error(expectedError));

			expect(() => browser.loadPhoto(1)).rejects.toThrowError(new RegExp(expectedError));
		});
	});

	describe('loading photos by album', () => {
		test('returns a collection of photos in the same album', async () => {
			const albumId = faker.datatype.number({ min: 1 });

			const photos = await browser.loadFromAlbum(albumId);
			const albumPhotos = photos.filter((photo) => photo.albumId === albumId);

			expect(albumPhotos).toHaveLength(photos.length);
		});

		test('returns a limited collection of photos in the same album', async () => {
			const albumId = faker.datatype.number({ min: 1 });
			const limit = 5;

			const photos = await browser.withLimit(limit).loadFromAlbum(albumId);

			expect(photos).toHaveLength(limit);
		});

		test('throws error on null server response', async () => {
			gateway.feedWith([{}]);

			expect(() => browser.loadFromAlbum(1)).rejects.toThrowError(
				'Received malformed JSON response'
			);
		});

		test('throws error on malformed server response', async () => {
			gateway.feedWith([{ key: faker.datatype.string() }]);

			expect(() => browser.loadFromAlbum(1)).rejects.toThrowError(
				'Received malformed JSON response'
			);
		});

		test('throws error on server error', async () => {
			const expectedError = 'Could not load album with ID 1';
			gateway.setError(new Error(expectedError));

			expect(() => browser.loadFromAlbum(1)).rejects.toThrowError(new RegExp(expectedError));
		});
	});
});

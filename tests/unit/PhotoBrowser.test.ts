import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, test, vitest } from 'vitest';
import PhotoBrowser from '$lib/services/PhotoBrowser';
import { randomPayload, randomPhoto } from '../helpers';
import { FakeGateway } from './FakeGateway';

describe('Photo Browser', () => {
	let gateway: FakeGateway;
	let browser: PhotoBrowser;

	beforeEach(() => {
		console.error = vitest.fn();
		gateway = new FakeGateway();
		browser = new PhotoBrowser(gateway);
	});

	describe('loading all photos', () => {
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

			expect(actualPhoto).toMatchObject({
				...expectedPhoto,
				url: new URL(expectedPhoto.url),
				thumbnailUrl: new URL(expectedPhoto.thumbnailUrl)
			});
		});

		test('throws error with zero as limit', () => {
			expect(() => browser.withLimit(0)).toThrowError('Photo limit must be greater than zero');
		});

		test('throws error with null server response', async () => {
			gateway.feedWith([{}]);

			await expect(browser.loadPhotos()).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with malformed server response', async () => {
			gateway.feedWith([{ key: faker.string.alpha() }]);

			await expect(browser.loadPhotos()).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with server error', async () => {
			const expectedError = 'Could not load photos';
			gateway.setError(new Error(expectedError));

			await expect(browser.loadPhotos()).rejects.toThrowError(new RegExp(expectedError));
		});
	});

	describe('loading a single photo', () => {
		test('returns a valid single photo', async () => {
			const id = faker.number.int({ min: 1, max: 1000 });

			const photo = await browser.loadPhoto(id);

			expect(photo.id).toBe(id);
			expect(photo.albumId).toBeGreaterThan(0);
			expect(photo.title.length).toBeGreaterThan(0);
			expect(photo.url).toBeInstanceOf(URL);
			expect(photo.thumbnailUrl).toBeInstanceOf(URL);
		});

		test('throws error with ID less than 1', async () => {
			await expect(browser.loadPhoto(0)).rejects.toThrowError(/Photo ID must be greater than zero/);
		});

		test('throws error with album ID less than 1', async () => {
			gateway.feedWith([
				randomPhoto({
					id: 1,
					albumId: 0
				})
			]);

			await expect(browser.loadPhoto(1)).rejects.toThrowError(/Album ID must be greater than zero/);
		});

		test('throws error with empty title', async () => {
			gateway.feedWith([
				randomPhoto({
					id: 1,
					title: ''
				})
			]);

			await expect(browser.loadPhoto(1)).rejects.toThrowError(/Title must be a non-empty string/);
		});

		test('throws error with invalid photo URL', async () => {
			gateway.feedWith([
				randomPhoto({
					id: 1,
					url: 'not a URL'
				})
			]);

			await expect(browser.loadPhoto(1)).rejects.toThrowError(/Photo URL must be valid/);
		});

		test('throws error with invalid thumbnail URL', async () => {
			gateway.feedWith([
				randomPhoto({
					id: 1,
					thumbnailUrl: 'not a URL'
				})
			]);

			await expect(browser.loadPhoto(1)).rejects.toThrowError(/Thumbnail URL must be valid/);
		});

		test('throws error with empty server response', async () => {
			gateway.feedWith([{}]);

			await expect(browser.loadPhoto(1)).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with non-schematic server response', async () => {
			gateway.feedWith([{ key: faker.string.alpha() }]);

			await expect(browser.loadPhoto(1)).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with server error', async () => {
			const expectedError = 'Could not load photo with ID 1';
			gateway.setError(new Error(expectedError));

			await expect(browser.loadPhoto(1)).rejects.toThrowError(new RegExp(expectedError));
		});
	});

	describe('loading photos by album', () => {
		test('returns a collection of photos in the same album', async () => {
			const albumId = faker.number.int({ min: 1, max: 1000 });

			const photos = await browser.loadFromAlbum(albumId);
			const albumPhotos = photos.filter((photo) => photo.albumId === albumId);

			expect(albumPhotos).toHaveLength(photos.length);
		});

		test('returns a limited collection of photos in the same album', async () => {
			const albumId = faker.number.int({ min: 1, max: 1000 });
			const limit = 5;

			const photos = await browser.withLimit(limit).loadFromAlbum(albumId);

			expect(photos).toHaveLength(limit);
		});

		test('throws error with ID less than 1', async () => {
			await expect(browser.loadFromAlbum(0)).rejects.toThrowError(
				/Album ID must be greater than zero/
			);
		});

		test('throws error with empty server response', async () => {
			gateway.feedWith([{}]);

			await expect(browser.loadFromAlbum(1)).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with non-schematic server response', async () => {
			gateway.feedWith([{ key: faker.string.alpha() }]);

			await expect(browser.loadFromAlbum(1)).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with server error', async () => {
			const expectedError = 'Could not load album with ID 1';
			gateway.setError(new Error(expectedError));

			await expect(browser.loadFromAlbum(1)).rejects.toThrowError(new RegExp(expectedError));
		});
	});

	describe('boundary value validation', () => {
		test('throws on negative limit', () => {
			expect(() => browser.withLimit(-1)).toThrowError('Photo limit must be greater than zero');
		});

		test('accepts limit of 1 as valid', () => {
			expect(browser.withLimit(1)).toBe(browser);
		});

		test('throws on negative photo ID', async () => {
			await expect(browser.loadPhoto(-1)).rejects.toThrow(/Photo ID must be greater than zero/);
		});

		test('throws on negative album ID', async () => {
			await expect(browser.loadFromAlbum(-1)).rejects.toThrow(/Album ID must be greater than zero/);
		});

		test('accepts photo ID of 1 as valid', async () => {
			const photo = await browser.loadPhoto(1);

			expect(photo.id).toBe(1);
		});

		test('accepts album ID of 1 as valid', async () => {
			const photos = await browser.loadFromAlbum(1);

			expect(photos).toBeInstanceOf(Array);
		});
	});

	describe('grouping photos into albums', () => {
		test('returns a single group having a single photo', async () => {
			const payload = randomPayload({ id: 1, albumId: 2 });
			gateway.feedWith([payload]);

			const albums = await browser.groupPhotosByAlbum();

			expect(albums).toMatchObject({
				[payload.albumId]: expect.arrayContaining([
					expect.objectContaining({
						id: payload.id
					})
				])
			});
		});

		test('returns multiple groups having a single photo', async () => {
			const collection = [
				randomPayload({
					id: 1,
					albumId: 5
				}),
				randomPayload({
					id: 3,
					albumId: 6
				}),
				randomPayload({
					id: 2,
					albumId: 5
				}),
				randomPayload({
					id: 4,
					albumId: 6
				})
			];
			gateway.feedWith(collection);

			const albums = await browser.groupPhotosByAlbum();

			expect(albums).toMatchObject({
				5: expect.arrayContaining([
					expect.objectContaining({ id: 1 }),
					expect.objectContaining({ id: 2 })
				]),
				6: expect.arrayContaining([
					expect.objectContaining({ id: 3 }),
					expect.objectContaining({ id: 4 })
				])
			});
		});

		test('returns multiple groups having multiple photos', async () => {
			const collection = [
				randomPayload({
					id: 1,
					albumId: 5
				}),
				randomPayload({
					id: 3,
					albumId: 6
				}),
				randomPayload({
					id: 2,
					albumId: 5
				}),
				randomPayload({
					id: 4,
					albumId: 6
				})
			];
			gateway.feedWith(collection);

			const albums = await browser.groupPhotosByAlbum();

			expect(albums).toMatchObject({
				5: expect.arrayContaining([
					expect.objectContaining({ id: 1 }),
					expect.objectContaining({ id: 2 })
				]),
				6: expect.arrayContaining([
					expect.objectContaining({ id: 3 }),
					expect.objectContaining({ id: 4 })
				])
			});
		});
	});
});

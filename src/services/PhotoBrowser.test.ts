import { faker } from '@faker-js/faker';
import { FakeGateway } from '../adapters/outbound/Gateway';
import type { Photo } from '../domain/Photo';
import PhotoBrowser from './PhotoBrowser';

const { arrayContaining, objectContaining } = expect;

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

			expect(() => browser.loadPhotos()).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with malformed server response', async () => {
			gateway.feedWith([{ key: faker.datatype.string() }]);

			expect(() => browser.loadPhotos()).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with server error', async () => {
			const expectedError = 'Could not load photos';
			gateway.setError(new Error(expectedError));

			expect(() => browser.loadPhotos()).rejects.toThrowError(new RegExp(expectedError));
		});
	});

	describe('loading a single photo', () => {
		test('returns a valid single photo', async () => {
			const id = faker.datatype.number({ min: 1 });

			const photo = await browser.loadPhoto(id);

			expect(photo.id).toBe(id);
			expect(photo.albumId).toBeGreaterThan(0);
			expect(photo.title.length).toBeGreaterThan(0);
			expect(photo.url).toBeInstanceOf(URL);
			expect(photo.thumbnailUrl).toBeInstanceOf(URL);
		});

		test('throws error with ID less than 1', async () => {
			expect(() => browser.loadPhoto(0)).rejects.toThrowError('Photo ID must be greater than zero');
		});

		test('throws error with album ID less than 1', async () => {
			gateway.feedWith([
				randomPhoto({
					id: 1,
					albumId: 0
				})
			]);

			expect(() => browser.loadPhoto(1)).rejects.toThrowError(/Album ID must be greater than zero/);
		});

		test('throws error with empty title', async () => {
			gateway.feedWith([
				randomPhoto({
					id: 1,
					title: ''
				})
			]);

			expect(() => browser.loadPhoto(1)).rejects.toThrowError(/Title must be a non-empty string/);
		});

		test('throws error with invalid photo URL', async () => {
			gateway.feedWith([
				randomPhoto({
					id: 1,
					url: 'not a URL'
				})
			]);

			expect(() => browser.loadPhoto(1)).rejects.toThrowError(/Photo URL must be valid/);
		});

		test('throws error with invalid thumbnail URL', async () => {
			gateway.feedWith([
				randomPhoto({
					id: 1,
					thumbnailUrl: 'not a URL'
				})
			]);

			expect(() => browser.loadPhoto(1)).rejects.toThrowError(/Thumbnail URL must be valid/);
		});

		test('throws error with empty server response', async () => {
			gateway.feedWith([{}]);

			expect(() => browser.loadPhoto(1)).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with non-schematic server response', async () => {
			gateway.feedWith([{ key: faker.datatype.string() }]);

			expect(() => browser.loadPhoto(1)).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with server error', async () => {
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

		test('throws error with ID less than 1', async () => {
			expect(() => browser.loadFromAlbum(0)).rejects.toThrowError(
				'Album ID must be greater than zero'
			);
		});

		test('throws error with empty server response', async () => {
			gateway.feedWith([{}]);

			expect(() => browser.loadFromAlbum(1)).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with non-schematic server response', async () => {
			gateway.feedWith([{ key: faker.datatype.string() }]);

			expect(() => browser.loadFromAlbum(1)).rejects.toThrowError(
				/Can not parse photo from invalid data/
			);
		});

		test('throws error with server error', async () => {
			const expectedError = 'Could not load album with ID 1';
			gateway.setError(new Error(expectedError));

			expect(() => browser.loadFromAlbum(1)).rejects.toThrowError(new RegExp(expectedError));
		});
	});

	describe('grouping photos into albums', () => {
		test('returns a single group having a single photo', async () => {
			const payload = randomPayload({ id: 1, albumId: 2 });
			gateway.feedWith([payload]);

			const albums = await browser.groupPhotosByAlbum();

			expect(albums).toMatchObject({
				[payload.albumId]: arrayContaining([
					objectContaining({
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
				5: arrayContaining([objectContaining({ id: 1 }), objectContaining({ id: 2 })]),
				6: arrayContaining([objectContaining({ id: 3 }), objectContaining({ id: 4 })])
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
				5: arrayContaining([objectContaining({ id: 1 }), objectContaining({ id: 2 })]),
				6: arrayContaining([objectContaining({ id: 3 }), objectContaining({ id: 4 })])
			});
		});
	});

	describe('parsing width and height of a photo', () => {
		test('returns width and height of a photo', () => {
			const photo = randomPhoto({
				url: new URL('https://via.placeholder.com/640/92c952'),
				thumbnailUrl: new URL('https://via.placeholder.com/128/92c952')
			});

			verifyPhotoHasExactWidthAndHeight(photo, 640, 640);
			verifyThumbnailHasExactWidthAndHeight(photo, 128, 128);
		});

		test('returns default width and height for photo with invalid URL', () => {
			const photo = randomPhoto({
				url: new URL('https://via.placeholder.com/92c952'),
				thumbnailUrl: new URL('https://via.placeholder.com/92c952')
			});

			verifyPhotoHasExactWidthAndHeight(photo, 600, 600);
			verifyThumbnailHasExactWidthAndHeight(photo, 150, 150);
		});

		test('returns default width and height for URl with zero dimension', () => {
			const photo = randomPhoto({
				url: new URL('https://via.placeholder.com/0/92c952'),
				thumbnailUrl: new URL('https://via.placeholder.com/0/92c952')
			});

			verifyPhotoHasExactWidthAndHeight(photo, 600, 600);
			verifyThumbnailHasExactWidthAndHeight(photo, 150, 150);
		});

		const verifyPhotoHasExactWidthAndHeight = (photo: Photo, width: number, height: number) => {
			const size = PhotoBrowser.parseFullSize(photo);

			expect(size.width).toBe(width);
			expect(size.height).toBe(height);
		};

		const verifyThumbnailHasExactWidthAndHeight = (photo: Photo, width: number, height: number) => {
			const size = PhotoBrowser.parseThumbnailSize(photo);

			expect(size.width).toBe(width);
			expect(size.height).toBe(height);
		};
	});
});

const randomPayload = (extra: Dictionary = {}) => ({
	id: faker.datatype.number({ min: 1 }),
	albumId: faker.datatype.number({ min: 1 }),
	title: faker.lorem.sentence(),
	url: faker.internet.url().concat('/'),
	thumbnailUrl: faker.internet.url().concat('/'),
	...extra
});

const randomPhoto = (extra: Dictionary = {}): Photo => ({
	...randomPayload(),
	url: new URL(faker.internet.url()),
	thumbnailUrl: new URL(faker.internet.url()),
	...extra
});

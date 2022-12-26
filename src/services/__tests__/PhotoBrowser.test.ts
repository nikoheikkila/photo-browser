import { beforeEach, describe, expect, test, vitest } from 'vitest';
import type { FetchPhotosArgs, JSONResponse, PhotoGateway } from '../../adapters/Gateway';
import PhotoBrowser from '../PhotoBrowser';
import { faker } from '@faker-js/faker';

export class FakeGateway implements PhotoGateway {
	private stubs: JSONResponse[] = [];
	private error: Error | null = null;
	public feedWith(stubs: JSONResponse[]) {
		this.stubs = stubs;
	}

	public setError(error: Error) {
		this.error = error;
	}

	public async fetchPhotos(args: FetchPhotosArgs): Promise<JSONResponse[]> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return [...this.stubs];

		const { limit } = args;

		return Array.from({ length: limit }, (_, index) => {
			return {
				id: index + 1,
				albumId: faker.datatype.number({ min: 1, max: 100 }),
				title: faker.lorem.sentence(5),
				url: faker.image.cats(1920, 1080, true),
				thumbnailUrl: faker.image.abstract(100, 100, true)
			};
		});
	}

	public async fetchPhoto(id: number): Promise<JSONResponse> {
		return {
			id,
			albumId: faker.datatype.number({ min: 1, max: 100 }),
			title: faker.lorem.sentence(5),
			url: faker.image.cats(1920, 1080, true),
			thumbnailUrl: faker.image.abstract(100, 100, true)
		};
	}
}

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
			gateway.setError(new Error('Could not load photos'));

			expect(() => browser.loadPhotos()).rejects.toThrowError(
				"Received error from server: 'Error: Could not load photos'"
			);
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
	});
});

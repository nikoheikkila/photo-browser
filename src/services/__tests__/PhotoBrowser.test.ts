import { beforeEach, describe, expect, test } from 'vitest';
import type { FetchPhotosArgs, PhotoGateway } from '../../adapters/Gateway';
import PhotoBrowser from '../PhotoBrowser';
import { faker } from '@faker-js/faker';

export class FakeGateway implements PhotoGateway {
	private stub: string | null = null;
	public feedWith(response: string) {
		this.stub = response;
	}
	public async fetchPhotos(args: FetchPhotosArgs): Promise<string> {
		if (this.stub !== null) return this.stub;

		const { limit } = args;

		const items = Array.from({ length: limit }, (_, index) => {
			return {
				id: index + 1,
				albumId: faker.datatype.number({ min: 1, max: 100 }),
				title: faker.lorem.sentence(5),
				url: faker.image.cats(1920, 1080, true),
				thumbnailUrl: faker.image.abstract(100, 100, true)
			};
		});

		return JSON.stringify(items);
	}
}

describe('PhotoBrowser', () => {
	let gateway: FakeGateway;
	let browser: PhotoBrowser;

	beforeEach(() => {
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
			const photos = await browser.loadPhotos(limit);

			expect(photos).toHaveLength(limit);
		});

		test('returns an empty collection on empty server response', async () => {
			gateway.feedWith('[]');

			const photos = await browser.loadPhotos();

			expect(photos).toHaveLength(0);
		});

		test('throws error on null server response', async () => {
			gateway.feedWith('');

			expect(() => browser.loadPhotos()).rejects.toThrowError('Received empty JSON response');
		});

		test('throws error on malformed server response', async () => {
			gateway.feedWith(faker.datatype.string());

			expect(() => browser.loadPhotos()).rejects.toThrowError('Received malformed JSON response');
		});
	});
});

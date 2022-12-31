import { APIGateway } from './Gateway';
import type { Interceptor, Scope } from 'nock';
import nock from 'nock';
import { faker } from '@faker-js/faker';
import { describe } from 'vitest';

describe('API Gateway', () => {
	const baseURL = 'https://api.org';

	let scope: Scope;
	let gateway: APIGateway;

	beforeEach(() => {
		scope = nock(baseURL);
		gateway = new APIGateway(baseURL);
	});

	describe('fetching all photos', () => {
		let route: Interceptor;

		beforeEach(() => {
			route = scope.get((path) => path.includes('/photos'));
		});

		test('handles an expected response', async () => {
			const payload = randomPayload();
			route.reply(200, [payload]);

			const photos = await gateway.fetchPhotos();

			expect(photos).toContainEqual(payload);
		});

		test('handles an empty response', async () => {
			route.reply(200, []);

			const photos = await gateway.fetchPhotos();

			expect(photos).toStrictEqual([]);
		});

		test('handles failed request', async () => {
			route.reply(500, 'Connection timeout');

			await expect(gateway.fetchPhotos()).rejects.toThrowError('HTTP 500: Connection timeout');
		});
	});

	describe('fetching a single photo', () => {
		let route: Interceptor;

		beforeEach(() => {
			route = scope.get((path) => path.includes('/photo'));
		});

		test('handles an expected response', async () => {
			const payload = randomPayload();
			route.reply(200, payload);

			const photo = await gateway.fetchPhoto(payload.id);

			expect(photo).toStrictEqual(payload);
		});

		test('handles a not found response', async () => {
			route.reply(404, 'Photo not found with ID 1');

			await expect(gateway.fetchPhoto(1)).rejects.toThrowError(
				'HTTP 404: Photo not found with ID 1'
			);
		});
	});

	describe('fetching photos by album ID', () => {
		let route: Interceptor;

		beforeEach(() => {
			route = scope.get(/\/albums\/\d+\/photos/);
		});

		test('handles an expected response', async () => {
			const payload = randomPayload();
			route.reply(200, [payload]);

			const photos = await gateway.fetchPhotosByAlbumId(payload.albumId);

			expect(photos).toContainEqual(payload);
		});

		test('handles a not found response', async () => {
			route.reply(404, 'Album not found with ID 1');

			await expect(gateway.fetchPhotosByAlbumId(1)).rejects.toThrowError(
				'HTTP 404: Album not found with ID 1'
			);
		});
	});
});

const randomPayload = (extra: Dictionary = {}) => ({
	id: faker.datatype.number({ min: 1 }),
	albumId: faker.datatype.number({ min: 1 }),
	title: faker.lorem.sentence(),
	url: faker.internet.url(),
	thumbnailUrl: faker.internet.url(),
	...extra
});

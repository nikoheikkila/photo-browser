import type { Interceptor, Scope } from 'nock';
import nock from 'nock';
import { describe, test } from 'vitest';
import { APIGateway } from '$lib/adapters/Gateway';
import { randomPayload } from '../helpers';

describe.concurrent('API Gateway', () => {
	const baseURL = 'https://api.org';

	let scope: Scope;
	let gateway: APIGateway;

	beforeEach(() => {
		scope = nock(baseURL);
		gateway = new APIGateway(baseURL);
	});

	describe('validating the base URL', () => {
		test('returns instance of class with valid URL', () => {
			expect(new APIGateway('https://api.org')).toBeInstanceOf(APIGateway);
		});

		test('throws error with undefined URL', () => {
			expect(() => new APIGateway()).toThrowError(/Invalid base URL 'undefined' given/);
		});

		test('throws error with empty URL', () => {
			expect(() => new APIGateway('')).toThrowError(/Invalid base URL '' given/);
		});

		test('throws error with invalid URL', () => {
			expect(() => new APIGateway('abc')).toThrowError(/Invalid base URL 'abc' given/);
		});
	});

	describe('HTTP GET', () => {
		describe('/photos', () => {
			let route: Interceptor;

			beforeEach(() => {
				route = scope.get('/photos');
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

			test('handles a failed request', async () => {
				route.reply(500, 'Connection timeout');

				await expect(gateway.fetchPhotos()).rejects.toThrowError('HTTP 500: Connection timeout');
			});
		});

		describe('/photos/:id', () => {
			let route: Interceptor;

			beforeEach(() => {
				route = scope.get(/^\/photos\/\d+$/);
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

			test('handles a failed request', async () => {
				route.reply(500, 'Connection timeout');

				await expect(gateway.fetchPhoto(1)).rejects.toThrowError('HTTP 500: Connection timeout');
			});
		});

		describe('/albums/:id/photos', () => {
			let route: Interceptor;

			beforeEach(() => {
				route = scope.get(/^\/albums\/\d+\/photos$/);
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

			test('handles a failed request', async () => {
				route.reply(500, 'Connection timeout');

				await expect(gateway.fetchPhotosByAlbumId(1)).rejects.toThrowError(
					'HTTP 500: Connection timeout'
				);
			});
		});
	});
});

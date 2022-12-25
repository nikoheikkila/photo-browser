import { describe, expect, test } from 'vitest';

import * as Photo from '../Photo';

describe('Photo', () => {
	describe('creation', () => {
		test('returns entity with valid data', () => {
			const photo = Photo.createPhoto({
				id: 10,
				albumId: 20,
				title: 'My Cat',
				url: 'https://example.com/cat.jpg',
				thumbnailUrl: 'https://example.com/cat-thumbnail.jpg'
			});

			expect(photo).toMatchObject({
				id: 10,
				albumId: 20,
				title: 'My Cat'
			});
		});

		test('returns entity with URL objects', () => {
			const photo = Photo.createPhoto({
				url: 'https://via.placeholder.com/600/92c952',
				thumbnailUrl: 'https://via.placeholder.com/150/92c952'
			});

			expect(photo.url).toBeInstanceOf(URL);
			expect(photo.thumbnailUrl).toBeInstanceOf(URL);
		});

		test('throws error when malformed URLs', () => {
			expect(() =>
				Photo.createPhoto({
					url: new URL('non-url'),
					thumbnailUrl: new URL('non-url')
				})
			).toThrowError();
		});
	});
});

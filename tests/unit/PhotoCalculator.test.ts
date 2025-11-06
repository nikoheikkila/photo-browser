import { faker } from '@faker-js/faker';
import { describe, expect, test } from 'vitest';
import type { Dimensions } from '$lib/domain/Dimensions';
import type { Photo } from '$lib/domain/Photo';
import { PhotoCalculator } from '$lib/services/PhotoCalculator';
import { randomPhoto } from '../helpers';

describe('Photo Calculator', () => {
	test('returns the width and height of a photo', () => {
		const full = 600;
		const thumbnail = 150;
		const nonce = faker.string.alpha();

		const photo = randomPhoto({
			url: randomURL(full, nonce),
			thumbnailUrl: randomURL(thumbnail, nonce)
		});

		expectPhotoHasExactSize(photo, { width: full, height: full });
		expectThumbnailHasExactSize(photo, { width: thumbnail, height: thumbnail });
	});

	test('returns default width and height for photo with invalid URL', () => {
		const nonce = faker.string.alpha();

		const photo = randomPhoto({
			url: new URL(`https://via.placeholder.com/${nonce}`),
			thumbnailUrl: new URL(`https://via.placeholder.com/${nonce}`)
		});

		expectPhotoHasExactSize(photo, { width: 600, height: 600 });
		expectThumbnailHasExactSize(photo, { width: 150, height: 150 });
	});

	test('returns default width and height for URl with zero dimension', () => {
		const size = 0;
		const nonce = faker.string.alpha();

		const photo = randomPhoto({
			url: randomURL(size, nonce),
			thumbnailUrl: randomURL(size, nonce)
		});

		expectPhotoHasExactSize(photo, { width: 600, height: 600 });
		expectThumbnailHasExactSize(photo, { width: 150, height: 150 });
	});

	const expectPhotoHasExactSize = (photo: Photo, expected: Dimensions) => {
		const actual = new PhotoCalculator(photo).parseFullSize();

		expect(actual).toStrictEqual(expected);
	};

	const expectThumbnailHasExactSize = (photo: Photo, expected: Dimensions) => {
		const actual = new PhotoCalculator(photo).parseThumbnailSize();

		expect(actual).toStrictEqual(expected);
	};

	const randomURL = (size: number, nonce = '') =>
		new URL(`${faker.internet.url()}/${size}/${nonce}`);

	describe('regex pattern matching edge cases', () => {
		test('handles negative dimension values', () => {
			const photo = randomPhoto({
				url: new URL('https://example.com/-10/abc'),
				thumbnailUrl: new URL('https://example.com/-5/abc')
			});

			expectPhotoHasExactSize(photo, { width: 600, height: 600 });
			expectThumbnailHasExactSize(photo, { width: 150, height: 150 });
		});

		test('handles URL without numeric dimension', () => {
			const photo = randomPhoto({
				url: new URL('https://example.com/photo.jpg'),
				thumbnailUrl: new URL('https://example.com/thumb.jpg')
			});

			expectPhotoHasExactSize(photo, { width: 600, height: 600 });
			expectThumbnailHasExactSize(photo, { width: 150, height: 150 });
		});

		test('requires regex match from start of pathname', () => {
			const photo = randomPhoto({
				url: new URL('https://example.com/prefix/150/photo'),
				thumbnailUrl: new URL('https://example.com/prefix/150/thumb')
			});

			expectPhotoHasExactSize(photo, { width: 600, height: 600 });
			expectThumbnailHasExactSize(photo, { width: 150, height: 150 });
		});

		test('requires multiple characters after dimension', () => {
			const photo = randomPhoto({
				url: new URL('https://example.com/150/ab'),
				thumbnailUrl: new URL('https://example.com/100/xy')
			});

			expectPhotoHasExactSize(photo, { width: 150, height: 150 });
			expectThumbnailHasExactSize(photo, { width: 100, height: 100 });
		});

		test('parseInt with empty string fallback returns NaN', () => {
			const photo = randomPhoto({
				url: new URL('https://example.com/notanumber/photo'),
				thumbnailUrl: new URL('https://example.com/xyz/thumb')
			});

			expectPhotoHasExactSize(photo, { width: 600, height: 600 });
			expectThumbnailHasExactSize(photo, { width: 150, height: 150 });
		});

		test('matches regex pattern correctly for valid dimensions', () => {
			const testCases = [
				{ size: 1, expected: { width: 1, height: 1 } },
				{ size: 100, expected: { width: 100, height: 100 } },
				{ size: 999, expected: { width: 999, height: 999 } }
			];

			testCases.forEach(({ size, expected }) => {
				const photo = randomPhoto({
					url: new URL(`https://example.com/${size}/photo`),
					thumbnailUrl: new URL(`https://example.com/${size}/thumb`)
				});

				expectPhotoHasExactSize(photo, expected);
				expectThumbnailHasExactSize(photo, expected);
			});
		});
	});
});

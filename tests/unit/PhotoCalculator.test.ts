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
});

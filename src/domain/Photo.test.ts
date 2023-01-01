import type { Photo } from './Photo';
import { parseFullSize, parseThumbnailSize } from './Photo';
import { faker } from '@faker-js/faker';

describe('Photo', () => {
	describe('parsing dimensions', () => {
		test('returns full width and height of the photo', () => {
			const photo = randomPhoto({
				url: new URL('https://via.placeholder.com/640/92c952'),
				thumbnailUrl: new URL('https://via.placeholder.com/128/92c952')
			});

			verifyPhotoHasExactWidthAndHeight(photo, 640, 640);
			verifyThumbnailHasExactWidthAndHeight(photo, 128, 128);
		});

		test('returns default width and height for invalid photo', () => {
			const photo = randomPhoto({
				url: new URL('https://via.placeholder.com/92c952'),
				thumbnailUrl: new URL('https://via.placeholder.com/92c952')
			});

			verifyPhotoHasExactWidthAndHeight(photo, 600, 600);
			verifyThumbnailHasExactWidthAndHeight(photo, 150, 150);
		});

		test('returns default width and height for zero dimension', () => {
			const photo = randomPhoto({
				url: new URL('https://via.placeholder.com/0/92c952'),
				thumbnailUrl: new URL('https://via.placeholder.com/0/92c952')
			});

			verifyPhotoHasExactWidthAndHeight(photo, 600, 600);
			verifyThumbnailHasExactWidthAndHeight(photo, 150, 150);
		});
	});
});

const randomPhoto = (extra: Partial<Photo> = {}): Photo => {
	return {
		id: faker.datatype.number({ min: 1 }),
		albumId: faker.datatype.number({ min: 1 }),
		title: faker.random.words(),
		url: new URL(faker.internet.url()),
		thumbnailUrl: new URL(faker.internet.url()),
		...extra
	};
};

const verifyPhotoHasExactWidthAndHeight = (photo: Photo, width: number, height: number) => {
	const size = parseFullSize(photo);

	expect(size.width).toBe(width);
	expect(size.height).toBe(height);
};

const verifyThumbnailHasExactWidthAndHeight = (photo: Photo, width: number, height: number) => {
	const size = parseThumbnailSize(photo);

	expect(size.width).toBe(width);
	expect(size.height).toBe(height);
};

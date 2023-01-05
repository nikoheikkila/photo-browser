import { PhotoCalculator } from '../PhotoCalculator';
import { randomPhoto } from './';

describe('Photo Calculator', () => {
	test('returns the width and height of a photo', () => {
		const photo = randomPhoto({
			url: new URL('https://via.placeholder.com/640/92c952'),
			thumbnailUrl: new URL('https://via.placeholder.com/128/92c952')
		});
		const calculator = new PhotoCalculator(photo);

		verifyPhotoHasExactWidthAndHeight(calculator, 640, 640);
		verifyThumbnailHasExactWidthAndHeight(calculator, 128, 128);
	});

	test('returns default width and height for photo with invalid URL', () => {
		const photo = randomPhoto({
			url: new URL('https://via.placeholder.com/92c952'),
			thumbnailUrl: new URL('https://via.placeholder.com/92c952')
		});
		const calculator = new PhotoCalculator(photo);

		verifyPhotoHasExactWidthAndHeight(calculator, 600, 600);
		verifyThumbnailHasExactWidthAndHeight(calculator, 150, 150);
	});

	test('returns default width and height for URl with zero dimension', () => {
		const photo = randomPhoto({
			url: new URL('https://via.placeholder.com/0/92c952'),
			thumbnailUrl: new URL('https://via.placeholder.com/0/92c952')
		});
		const calculator = new PhotoCalculator(photo);

		verifyPhotoHasExactWidthAndHeight(calculator, 600, 600);
		verifyThumbnailHasExactWidthAndHeight(calculator, 150, 150);
	});

	const verifyPhotoHasExactWidthAndHeight = (
		calculator: PhotoCalculator,
		width: number,
		height: number
	) => {
		const size = calculator.parseFullSize();

		expect(size.width).toBe(width);
		expect(size.height).toBe(height);
	};

	const verifyThumbnailHasExactWidthAndHeight = (
		calculator: PhotoCalculator,
		width: number,
		height: number
	) => {
		const size = calculator.parseThumbnailSize();

		expect(size.width).toBe(width);
		expect(size.height).toBe(height);
	};
});

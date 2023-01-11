import '@testing-library/jest-dom';
import Page from '../../src/routes/+page.svelte';
import { render, screen } from '@testing-library/svelte';
import { randomPhoto } from '../helpers';

describe('Listing Page', () => {
	const captionPattern = /Caption: \w+/;

	test('displays a warning with empty album set', () => {
		render(Page, {
			data: {
				albums: {}
			}
		});

		const warning = screen.getByRole('alert');
		const heading = screen.getByRole('heading');

		expect(heading).toHaveTextContent('No photos in the gallery');
		expect(warning).toHaveTextContent('Please, check back later');
	});

	test('displays the singular number of photos per album', () => {
		render(Page, {
			data: {
				albums: {
					1: [randomPhoto()]
				}
			}
		});

		const paragraph = screen.getByText(/1 photo in the album/);

		expect(paragraph).toBeVisible();
	});

	test('displays the plural number of photos per album', () => {
		render(Page, {
			data: {
				albums: {
					1: [randomPhoto(), randomPhoto()]
				}
			}
		});

		const paragraph = screen.getByText(/2 photos in the album/);

		expect(paragraph).toBeVisible();
	});

	test('lists all the photos with accessible screen reader texts', () => {
		render(Page, {
			data: {
				albums: {
					1: [randomPhoto()],
					2: [randomPhoto(), randomPhoto()],
					3: [randomPhoto(), randomPhoto(), randomPhoto()]
				}
			}
		});

		const accessiblePhotos = screen.getAllByAltText(captionPattern);

		expect(accessiblePhotos).toHaveLength(6);
	});

	test('photos in page link to a single photo page', () => {
		const id = 1;
		render(Page, {
			data: {
				albums: {
					1: [randomPhoto({ id })]
				}
			}
		});

		const link = screen.getByRole('link', { name: captionPattern });

		expect(link).toHaveAttribute('href', `/photo/${id}`);
	});
});

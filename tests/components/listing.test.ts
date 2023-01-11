import '@testing-library/jest-dom';
import Page from '../../src/routes/+page.svelte';
import { render, screen } from '@testing-library/svelte';
import { randomPhoto } from '$lib/services/__tests__';

describe('Listing Page', () => {
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
					1: [randomPhoto({ title: 'Photo 1' })],
					2: [randomPhoto({ title: 'Photo 2' }), randomPhoto({ title: 'Photo 3' })],
					3: [
						randomPhoto({ title: 'Photo 4' }),
						randomPhoto({ title: 'Photo 5' }),
						randomPhoto({ title: 'Photo 6' })
					]
				}
			}
		});

		const accessiblePhotos = screen.getAllByAltText(/Photo/);

		expect(accessiblePhotos).toHaveLength(6);
	});

	test('photos in page link to a single photo page', () => {
		render(Page, {
			data: {
				albums: {
					1: [randomPhoto({ id: 1, title: 'Photo 1' })]
				}
			}
		});

		const link = screen.getByRole('link', { name: /Photo 1/ });

		expect(link).toHaveAttribute('href', '/photo/1');
	});
});

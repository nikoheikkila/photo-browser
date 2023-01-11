import '@testing-library/jest-dom';
import Page from '../../src/routes/+page.svelte';
import { render, screen } from '@testing-library/svelte';
import { randomPhoto } from '$lib/services/__tests__';

describe('Listing Page', () => {
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

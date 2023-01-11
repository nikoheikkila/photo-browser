import '@testing-library/jest-dom';
import Page from '../../src/routes/photo/[id]/+page.svelte';
import { render, screen } from '@testing-library/svelte';
import { randomPhoto } from '$lib/services/__tests__';

describe('Single photo page', () => {
	test('wraps photo as a figure', () => {
		render(Page, {
			data: {
				photo: randomPhoto()
			}
		});

		const figure = screen.getByRole('figure');

		expect(figure).toBeVisible();
	});

	test('contains a photo caption with title and size', () => {
		render(Page, {
			data: {
				photo: randomPhoto({
					title: 'Selfie',
					url: new URL('https://via.placeholder.com/500/abcdefg')
				})
			}
		});

		const caption = screen.getByRole('caption');

		expect(caption).toHaveTextContent(/Selfie/);
		expect(caption).toHaveTextContent(/500 by 500 pixels/);
	});

	test('contains a photo with accessible alternative text', () => {
		render(Page, {
			data: {
				photo: randomPhoto({ title: 'My friend' })
			}
		});

		const photo = screen.getByRole('img');

		expect(photo).toHaveAttribute('alt', 'Caption: My friend');
	});

	test('contains a link back to the album page', () => {
		render(Page, {
			data: {
				photo: randomPhoto({ albumId: 3 })
			}
		});

		const link = screen.getByRole('link', { name: 'Back to album' });

		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', '/album/3');
	});
});

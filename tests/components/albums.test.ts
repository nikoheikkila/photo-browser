import '@testing-library/jest-dom';
import Page from '../../src/routes/album/[id]/+page.svelte';
import { render, screen } from '@testing-library/svelte';
import { randomPhoto } from '$lib/services/__tests__';

describe('Albums page', () => {
	test('warns user on empty photo sets', () => {
		render(Page, {
			data: {
				albumId: 1,
				photos: []
			}
		});

		const warning = screen.getByRole('alert');
		const heading = screen.getByRole('heading');

		expect(heading).toHaveTextContent('You stumbled upon an empty album');
		expect(warning).toHaveTextContent("Don't worry there will be photos here in the future.");
	});

	test('shows photos belonging to a single album', () => {
		render(Page, {
			data: {
				albumId: 3,
				photos: [
					randomPhoto({ albumId: 3 }),
					randomPhoto({ albumId: 3 }),
					randomPhoto({ albumId: 3 }),
					randomPhoto({ albumId: 3 })
				]
			}
		});

		const title = screen.getByRole('heading', { name: 'Photos from album 3' });
		const photos = screen.getAllByRole('img');

		expect(title).toBeVisible();
		expect(photos).toHaveLength(4);
	});

	test('lists photos with accessible screen reader texts', () => {
		render(Page, {
			data: {
				albumId: 3,
				photos: [
					randomPhoto({ albumId: 3, title: 'Photo 1' }),
					randomPhoto({ albumId: 3, title: 'Photo 2' }),
					randomPhoto({ albumId: 3, title: 'Photo 3' }),
					randomPhoto({ albumId: 3, title: 'Photo 4' })
				]
			}
		});

		const accessiblePhotos = screen.getAllByAltText(/Photo/);

		expect(accessiblePhotos).toHaveLength(4);
	});

	test('photos in album link to a single photo page', () => {
		render(Page, {
			data: {
				albumId: 1,
				photos: [randomPhoto({ id: 1, albumId: 1, title: 'Photo 1' })]
			}
		});

		const link = screen.getByRole('link', { name: /Photo 1/ });

		expect(link).toHaveAttribute('href', '/photo/1');
	});

	test('allows navigating between album pages', () => {
		render(Page, {
			data: {
				albumId: 2,
				photos: [randomPhoto({ id: 1, albumId: 2, title: 'Photo 1' })]
			}
		});

		const previousAlbumLink = screen.getByRole('link', { name: 'Previous album' });
		const nextAlbumLink = screen.getByRole('link', { name: 'Next album' });

		expect(previousAlbumLink).toHaveAttribute('href', '/album/1');
		expect(nextAlbumLink).toHaveAttribute('href', '/album/3');
	});

	test('does not allow navigating to previous album from the first album', () => {
		render(Page, {
			data: {
				albumId: 1,
				photos: [randomPhoto({ id: 1, albumId: 1, title: 'Photo 1' })]
			}
		});

		const previousAlbumLink = screen.queryByRole('link', { name: 'Previous album' });
		const nextAlbumLink = screen.getByRole('link', { name: 'Next album' });

		expect(previousAlbumLink).not.toBeInTheDocument();
		expect(nextAlbumLink).toBeVisible();
	});
});

import '@testing-library/jest-dom';
import Page from '../../src/routes/album/[id]/+page.svelte';
import { render, screen } from '@testing-library/svelte';
import { randomPhoto } from '../helpers';

describe('Albums page', () => {
	const captionPattern = /Caption: \w+/;

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
		const albumId = 3;
		const photos = [randomPhoto({ albumId }), randomPhoto({ albumId })];
		render(Page, {
			data: {
				albumId,
				photos
			}
		});

		const title = screen.getByRole('heading', { name: `Photos from album ${albumId}` });
		const allPhotos = screen.getAllByRole('img');

		expect(title).toBeVisible();
		expect(allPhotos).toHaveLength(photos.length);
	});

	test('lists photos with accessible screen reader texts', () => {
		const albumId = 3;
		const photos = [randomPhoto({ albumId }), randomPhoto({ albumId })];

		render(Page, {
			data: {
				albumId,
				photos
			}
		});

		const accessiblePhotos = screen.getAllByAltText(captionPattern);

		expect(accessiblePhotos).toHaveLength(photos.length);
	});

	test('photos in album link to a single photo page', () => {
		const id = 1;
		const albumId = 3;
		render(Page, {
			data: {
				albumId,
				photos: [randomPhoto({ id, albumId })]
			}
		});

		const link = screen.getByRole('link', { name: captionPattern });

		expect(link).toHaveAttribute('href', `/photo/${id}`);
	});

	test('allows navigating between album pages', () => {
		const albumId = 3;
		render(Page, {
			data: {
				albumId,
				photos: [randomPhoto({ albumId })]
			}
		});

		const previousAlbumLink = screen.getByRole('link', { name: 'Previous album' });
		const nextAlbumLink = screen.getByRole('link', { name: 'Next album' });

		expect(previousAlbumLink).toBeVisible();
		expect(previousAlbumLink).toHaveAttribute('href', `/album/${albumId - 1}`);
		expect(nextAlbumLink).toBeVisible();
		expect(nextAlbumLink).toHaveAttribute('href', `/album/${albumId + 1}`);
	});

	test('does not allow navigating to previous album from the first album', () => {
		const albumId = 1;
		render(Page, {
			data: {
				albumId,
				photos: [randomPhoto({ albumId })]
			}
		});

		const previousAlbumLink = screen.queryByRole('link', { name: 'Previous album' });

		expect(previousAlbumLink).not.toBeInTheDocument();
	});
});

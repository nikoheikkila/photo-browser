import Page from '../../src/routes/album/[id]/+page.svelte';
import type { PageData } from '../../src/routes/album/[id]/$types';
import { render, screen } from '@testing-library/svelte';
import { randomPhoto } from '../helpers';
import { captionPattern } from './helpers';

describe('Albums page', () => {
	const arrange = (data: PageData) => {
		return render(Page, {
			data
		});
	};

	test('warns user on empty photo sets', async () => {
		arrange({
			albumId: 1,
			photos: []
		});

		const warning = await screen.findByRole('alert');
		const heading = await screen.findByRole('heading');

		expect(heading).toHaveTextContent(/you stumbled upon an empty album/i);
		expect(warning).toHaveTextContent(/don't worry there will be photos here in the future/i);
	});

	test('shows photos belonging to a single album', async () => {
		const albumId = 3;
		const photos = [randomPhoto({ albumId }), randomPhoto({ albumId })];
		arrange({
			albumId,
			photos
		});

		const title = await screen.findByRole('heading', { name: `Photos from album ${albumId}` });
		const allPhotos = await screen.findAllByRole('img');

		expect(title).toBeVisible();
		expect(allPhotos).toHaveLength(photos.length);
	});

	test('lists photos with accessible screen reader texts', async () => {
		const albumId = 3;
		const photos = [randomPhoto({ albumId }), randomPhoto({ albumId })];
		arrange({
			albumId,
			photos
		});

		const accessiblePhotos = await screen.findAllByAltText(captionPattern);

		expect(accessiblePhotos).toHaveLength(photos.length);
	});

	test('photos in album link to a single photo page', async () => {
		const id = 1;
		const albumId = 3;
		arrange({
			albumId,
			photos: [randomPhoto({ id, albumId })]
		});

		const link = await screen.findByRole('link', { name: captionPattern });

		expect(link).toHaveAttribute('href', `/photo/${id}`);
	});

	test('allows navigating to next album page', async () => {
		const albumId = 3;
		arrange({
			albumId,
			photos: [randomPhoto({ albumId })]
		});

		const nextAlbumLink = await screen.findByRole('link', { name: /next album/i });

		expect(nextAlbumLink).toBeVisible();
		expect(nextAlbumLink).toHaveAttribute('href', `/album/${albumId + 1}`);
	});

	test('allows navigating to previous album page', async () => {
		const albumId = 3;
		arrange({
			albumId,
			photos: [randomPhoto({ albumId })]
		});

		const previousAlbumLink = await screen.findByRole('link', { name: /previous album/i });

		expect(previousAlbumLink).toBeVisible();
		expect(previousAlbumLink).toHaveAttribute('href', `/album/${albumId - 1}`);
	});

	test('does not allow navigating to previous album from the first album', () => {
		const albumId = 1;
		arrange({
			albumId,
			photos: [randomPhoto({ albumId })]
		});

		const previousAlbumLink = screen.queryByRole('link', { name: /previous album/i });

		expect(previousAlbumLink).not.toBeInTheDocument();
	});
});

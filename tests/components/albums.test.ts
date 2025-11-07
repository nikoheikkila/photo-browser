import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '../../src/routes/album/[id]/+page.svelte';
import type { PageData } from '../../src/routes/album/[id]/$types';
import { randomPhoto } from '../helpers';
import { captionPattern } from './helpers';

describe('Albums page', () => {
	const arrange = (data: PageData) => {
		return render(Page, {
			data
		});
	};

	test('warns user on empty photo sets', async () => {
		const { getByRole } = arrange({
			albumId: 1,
			photos: []
		});

		await expect
			.element(getByRole('heading'))
			.toHaveTextContent(/you stumbled upon an empty album/i);
		await expect
			.element(getByRole('alert'))
			.toHaveTextContent(/don't worry there will be photos here in the future/i);
	});

	test('shows photos belonging to a single album', async () => {
		const albumId = 3;
		const photos = [randomPhoto({ albumId }), randomPhoto({ albumId })];
		const { getByRole } = arrange({
			albumId,
			photos
		});

		await expect
			.element(getByRole('heading', { name: `Photos from album ${albumId}` }))
			.toBeVisible();
		await expect.element(getByRole('img')).toHaveLength(photos.length);
	});

	test('lists photos with accessible screen reader texts', async () => {
		const albumId = 3;
		const photos = [randomPhoto({ albumId }), randomPhoto({ albumId })];
		const { getByAltText } = arrange({
			albumId,
			photos
		});

		await expect.element(getByAltText(captionPattern)).toHaveLength(photos.length);
	});

	test('photos in album link to a single photo page', async () => {
		const id = 1;
		const albumId = 3;
		const { getByRole } = arrange({
			albumId,
			photos: [randomPhoto({ id, albumId })]
		});

		await expect
			.element(getByRole('link', { name: captionPattern }))
			.toHaveAttribute('href', `/photo/${id}`);
	});

	test('allows navigating to next album page', async () => {
		const albumId = 3;
		const { getByRole } = arrange({
			albumId,
			photos: [randomPhoto({ albumId })]
		});

		const nextAlbumLink = getByRole('link', { name: /next album/i });

		await expect.element(nextAlbumLink).toBeVisible();
		await expect.element(nextAlbumLink).toHaveAttribute('href', `/album/${albumId + 1}`);
	});

	test('allows navigating to previous album page', async () => {
		const albumId = 3;
		const { getByRole } = arrange({
			albumId,
			photos: [randomPhoto({ albumId })]
		});

		const previousAlbumLink = getByRole('link', { name: /previous album/i });

		await expect.element(previousAlbumLink).toBeVisible();
		await expect.element(previousAlbumLink).toHaveAttribute('href', `/album/${albumId - 1}`);
	});

	test('does not allow navigating to previous album from the first album', async () => {
		const albumId = 1;
		const { getByRole } = arrange({
			albumId,
			photos: [randomPhoto({ albumId })]
		});

		await expect.element(getByRole('link', { name: /previous album/i })).not.toBeInTheDocument();
	});
});

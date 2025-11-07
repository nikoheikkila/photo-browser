import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '../../src/routes/photo/[id]/+page.svelte';
import type { PageData } from '../../src/routes/photo/[id]/$types';
import { randomPhoto } from '../helpers';

describe('Single photo page', () => {
	const arrange = (data: PageData) => {
		return render(Page, {
			data
		});
	};

	test('wraps photo as a figure', async () => {
		const { getByRole } = arrange({
			photo: randomPhoto()
		});

		await expect.element(getByRole('figure')).toBeVisible();
	});

	test('contains a photo caption with title and size', async () => {
		const { getByRole } = arrange({
			photo: randomPhoto({
				title: 'Selfie',
				url: new URL('https://via.placeholder.com/500/abcdefg')
			})
		});

		const caption = getByRole('caption');

		await expect.element(caption).toHaveTextContent(/Selfie/);
		await expect.element(caption).toHaveTextContent(/500 by 500 pixels/);
	});

	test('contains a photo with accessible alternative text', async () => {
		const { getByAltText } = arrange({
			photo: randomPhoto({ title: 'My friend' })
		});

		await expect.element(getByAltText('Caption: My friend')).toBeVisible();
	});

	test('contains a link back to the album page', async () => {
		const { getByRole } = arrange({
			photo: randomPhoto({ albumId: 3 })
		});

		const link = getByRole('link', { name: /back to album/i });

		await expect.element(link).toBeVisible();
		await expect.element(link).toHaveAttribute('href', '/album/3');
	});
});

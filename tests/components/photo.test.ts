import { render, screen } from '@testing-library/svelte';
import { describe, test } from 'vitest';
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
		arrange({
			photo: randomPhoto()
		});

		const figure = await screen.findByRole('figure');

		expect(figure).toBeVisible();
	});

	test('contains a photo caption with title and size', async () => {
		arrange({
			photo: randomPhoto({
				title: 'Selfie',
				url: new URL('https://via.placeholder.com/500/abcdefg')
			})
		});

		const caption = await screen.findByRole('caption');

		expect(caption).toHaveTextContent(/Selfie/);
		expect(caption).toHaveTextContent(/500 by 500 pixels/);
	});

	test('contains a photo with accessible alternative text', async () => {
		arrange({
			photo: randomPhoto({ title: 'My friend' })
		});

		const photo = await screen.findByAltText('Caption: My friend');

		expect(photo).toBeVisible();
	});

	test('contains a link back to the album page', async () => {
		arrange({
			photo: randomPhoto({ albumId: 3 })
		});

		const link = await screen.findByRole('link', { name: /back to album/i });

		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', '/album/3');
	});
});

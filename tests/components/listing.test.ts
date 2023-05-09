import Page from '../../src/routes/+page.svelte';
import type { PageData } from '../../src/routes/$types';
import { render, screen } from '@testing-library/svelte';
import { randomPhoto } from '../helpers';
import { captionPattern } from './helpers';
import { describe, test } from 'vitest';

describe.concurrent('Listing Page', () => {
	const arrange = (data: PageData) => {
		return render(Page, {
			data
		});
	};

	test('displays a warning with empty album set', async () => {
		arrange({
			albums: {}
		});

		const warning = await screen.findByRole('alert');
		const heading = await screen.findByRole('heading');

		expect(heading).toHaveTextContent(/no photos in the gallery/i);
		expect(warning).toHaveTextContent(/please, check back later/i);
	});

	test('displays the singular number of photos per album', async () => {
		arrange({
			albums: {
				1: [randomPhoto()]
			}
		});

		const paragraph = await screen.findByText(/1 photo in the album/i);

		expect(paragraph).toBeVisible();
	});

	test('displays the plural number of photos per album', async () => {
		arrange({
			albums: {
				1: [randomPhoto(), randomPhoto()]
			}
		});

		const paragraph = await screen.findByText(/2 photos in the album/i);

		expect(paragraph).toBeVisible();
	});

	test('lists all the photos with accessible screen reader texts', async () => {
		arrange({
			albums: {
				1: [randomPhoto()],
				2: [randomPhoto(), randomPhoto()],
				3: [randomPhoto(), randomPhoto(), randomPhoto()]
			}
		});

		const accessiblePhotos = await screen.findAllByAltText(captionPattern);

		expect(accessiblePhotos).toHaveLength(6);
	});

	test('photos in page link to a single photo page', async () => {
		const id = 1;
		arrange({
			albums: {
				1: [randomPhoto({ id })]
			}
		});

		const link = await screen.findByRole('link', { name: captionPattern });

		expect(link).toHaveAttribute('href', `/photo/${id}`);
	});
});

import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '../../src/routes/+page.svelte';
import type { PageData } from '../../src/routes/$types';
import { randomPhoto } from '../helpers';
import { captionPattern } from './helpers';

describe('Listing Page', () => {
	const arrange = (data: PageData) => {
		return render(Page, {
			data
		});
	};

	test('displays a warning with empty album set', async () => {
		const { getByRole } = arrange({
			albums: {}
		});

		await expect.element(getByRole('heading')).toHaveTextContent(/no photos in the gallery/i);
		await expect.element(getByRole('alert')).toHaveTextContent(/please, check back later/i);
	});

	test('displays the singular number of photos per album', async () => {
		const { getByText } = arrange({
			albums: {
				1: [randomPhoto()]
			}
		});

		await expect.element(getByText(/1 photo in the album/i)).toBeVisible();
	});

	test('displays the plural number of photos per album', async () => {
		const { getByText } = arrange({
			albums: {
				1: [randomPhoto(), randomPhoto()]
			}
		});

		await expect.element(getByText(/2 photos in the album/i)).toBeVisible();
	});

	test('lists all the photos with accessible screen reader texts', async () => {
		const { getByAltText } = arrange({
			albums: {
				1: [randomPhoto()],
				2: [randomPhoto(), randomPhoto()],
				3: [randomPhoto(), randomPhoto(), randomPhoto()]
			}
		});

		await expect.element(getByAltText(captionPattern)).toHaveLength(6);
	});

	test('photos in page link to a single photo page', async () => {
		const id = 1;
		const { getByRole } = arrange({
			albums: {
				1: [randomPhoto({ id })]
			}
		});

		await expect
			.element(getByRole('link', { name: captionPattern }))
			.toHaveAttribute('href', `/photo/${id}`);
	});
});

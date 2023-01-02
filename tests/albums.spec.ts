import { expect, test } from '@playwright/test';

export const captionPattern = /^Caption: (.+)$/;

test.describe('Albums page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/album/1');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('page has an accessible title', async ({ page }) => {
		await expect(page).toHaveTitle(/Photos for album \d+/);
	});

	test('shows photos belonging to a single album', async ({ page }) => {
		const title = page.getByRole('heading', { name: 'Photos from album 1' });
		await expect(title).toBeVisible();

		const photos = page.getByAltText(captionPattern);
		await expect(photos).toHaveCount(50);
	});

	test('lists photos with accessible screen reader texts', async ({ page }) => {
		const allPhotos = page.getByRole('img');
		const accessiblePhotos = page.getByAltText(captionPattern);

		const numberOfAllPhotos = await allPhotos.count();

		await expect(accessiblePhotos).toHaveCount(numberOfAllPhotos);
	});

	test('photos in album link to a single photo page', async ({ page }) => {
		const firstLink = page.getByRole('link', { name: captionPattern }).first();

		await firstLink.click();

		await expect(page).toHaveURL(/\/photo\/\d+$/);
	});

	test('allows navigating between album pages', async ({ page }) => {
		const nextAlbumLink = page.getByRole('link', { name: 'Next album' });
		await nextAlbumLink.click();
		await expect(page).toHaveURL('/album/2');

		const previousAlbumLink = page.getByRole('link', { name: 'Previous album' });
		await previousAlbumLink.click();
		await expect(page).toHaveURL('/album/1');
	});

	test('does not allow navigating to previous album from the first album', async ({ page }) => {
		const previousAlbumLink = page.getByRole('link', { name: 'Previous album' });
		await expect(previousAlbumLink).toBeHidden();

		const nextAlbumLink = page.getByRole('link', { name: 'Next album' });
		await expect(nextAlbumLink).toBeVisible();
	});

	test('shows warning on invalid album ID', async ({ page }) => {
		const warning = page.getByRole('alert');

		await page.goto('/album/invalid');

		await expect(warning).toHaveText(/Invalid album ID 'invalid' given/);
	});
});

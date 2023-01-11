import { expect, test } from '@playwright/test';

test.describe('Albums page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/album/1');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('page has an accessible title', async ({ page }) => {
		await expect(page).toHaveTitle(/Photos for album \d+/);
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

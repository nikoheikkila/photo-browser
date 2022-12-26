import { expect, test } from '@playwright/test';

test.describe('Photo listing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('page has expected heading', async ({ page }) => {
		const header = page.getByRole('heading', { name: 'Photo Browser' });

		await expect(header).toBeVisible();
	});

	test('page lists all the photos with accessible screen reader texts', async ({ page }) => {
		const photos = page.locator('img');
		const accessiblePhotos = page.getByAltText(/^Caption: (.+)$/);

		const numberOfAllPhotos = await photos.count();
		expect(numberOfAllPhotos).toBeGreaterThan(0);

		const numberOfAccessiblePhotos = await accessiblePhotos.count();
		await expect(numberOfAccessiblePhotos).toBe(numberOfAllPhotos);
	});
});

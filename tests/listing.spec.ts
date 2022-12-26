import { expect, test } from '@playwright/test';

test.describe('Photo listing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('page has expected heading', async ({ page }) => {
		const header = page.getByRole('heading', { name: 'Photo Browser' });

		await expect(header).toBeVisible();
	});

	test('page lists all the photos with accessible screen reader texts', async ({ page }) => {
		const list = page.locator('.photo-list');

		const numberOfAllPhotos = await list.locator('img').count();
		expect(numberOfAllPhotos).toBeGreaterThan(0);

		const numberOfAccessiblePhotos = await list.getByAltText(/^Caption: (.+)$/).count();
		await expect(numberOfAccessiblePhotos).toBe(numberOfAllPhotos);
	});
});

import { expect, test } from '@playwright/test';

export const captionPattern = /^Caption: (.+)$/;

test.describe('Albums page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/album/1');
	});

	test('shows photos belonging to a single album', async ({ page }) => {
		const numberOfPhotos = await page.getByAltText(captionPattern).count();

		expect(numberOfPhotos).toBeGreaterThan(0);
	});

	test('lists photos with accessible screen reader texts', async ({ page }) => {
		const photos = page.locator('img');
		const accessiblePhotos = page.getByAltText(captionPattern);
		const numberOfAllPhotos = await photos.count();

		await expect(accessiblePhotos).toHaveCount(numberOfAllPhotos);
	});

	test('photos in page link to a single photo page', async ({ page }) => {
		const firstPhoto = page.getByRole('link', { name: captionPattern }).first();

		await firstPhoto.click();

		await expect(page).toHaveURL(/\/photo\/\d+$/);
	});
});

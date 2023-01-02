import { expect, test } from '@playwright/test';
export const captionPattern = /^Caption: (.+)$/;

test.describe('Photo listing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('document has specified English as language', async ({ page }) => {
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	})

	test('page has an accessible title', async ({ page }) => {
		await expect(page).toHaveTitle(/Home/);
	});

	test('page lists all the photos with accessible screen reader texts', async ({ page }) => {
		const allPhotos = page.getByRole('img');
		const accessiblePhotos = page.getByAltText(captionPattern);
		const numberOfAllPhotos = await allPhotos.count();

		await expect(accessiblePhotos).toHaveCount(numberOfAllPhotos);
	});

	test('photos in page link to a single photo page', async ({ page }) => {
		const firstPhoto = page.getByRole('link', { name: captionPattern }).first();

		await firstPhoto.click();

		await expect(page).toHaveURL(/\/photo\/\d+$/);
	});
});

import { expect, test } from '@playwright/test';

test.describe('Photo listing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('has an accessible title', async ({ page }) => {
		await expect(page).toHaveTitle(/Photo Browser \| Home/);
	});

	test('lists a number of photos', async ({ page }) => {
		const numberOfPhotos = await page.getByRole('img').count();

		expect(numberOfPhotos).toBeGreaterThan(0);
	});
});

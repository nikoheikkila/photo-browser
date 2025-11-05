import { expect, test } from '@playwright/test';

test.describe('Albums page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/album/1');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('has an accessible title', async ({ page }) => {
		await expect(page).toHaveTitle(/Photo Browser \| Photos for album \d+/);
	});

	test('lists a number of photos', async ({ page }) => {
		const numberOfPhotos = await page.getByRole('img').count();

		expect(numberOfPhotos).toBeGreaterThan(0);
	});

	test('warns on invalid album ID', async ({ page }) => {
		const warning = page.getByRole('alert');

		await page.goto('/album/invalid');

		await expect(warning).toHaveText(/Invalid album ID 'invalid' given/);
	});
});

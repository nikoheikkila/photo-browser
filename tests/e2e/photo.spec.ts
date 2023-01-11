import { expect, test } from '@playwright/test';

test.describe('Single photo page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/photo/1');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('has an accessible title', async ({ page }) => {
		await expect(page).toHaveTitle(/Photo - \w+/);
	});

	test('lists a single photos', async ({ page }) => {
		const photos = page.getByRole('img');

		await expect(photos).toHaveCount(1);
	});

	test('displays informative error when photo is not found', async ({ page }) => {
		const alert = page.getByRole('alert');

		await page.goto('/photo/invalid');

		await expect(alert).toContainText(/Invalid photo ID 'invalid' given/);
	});
});

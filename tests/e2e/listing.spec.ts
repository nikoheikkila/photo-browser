import { expect, test } from '@playwright/test';

test.describe('Photo listing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('document has specified English as language', async ({ page }) => {
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	});

	test('page has an accessible title', async ({ page }) => {
		await expect(page).toHaveTitle(/Home/);
	});
});

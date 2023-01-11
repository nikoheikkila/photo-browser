import { expect, test } from '@playwright/test';

test.describe('Layout', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('has English as content language', async ({ page }) => {
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	});

	test('allows user to return to home page', async ({ page }) => {
		const homeLink = page.getByRole('navigation').getByRole('link');

		await homeLink.click();

		await expect(page).toHaveURL('/');
	});

	test('has author information in the footer', async ({ page }) => {
		const footer = page.locator('footer');

		await expect(footer).toContainText(/Made by Niko Heikkilä/);
	});
});

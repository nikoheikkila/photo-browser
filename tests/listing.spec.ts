import { expect, test } from '@playwright/test';

test.describe('Photo listing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('page has expected h1', async ({ page }) => {
		const header = page.getByRole('heading', { name: 'Photo Browser' });

		await expect(header).toBeVisible();
	});
});

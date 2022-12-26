import { expect, test } from '@playwright/test';

test.describe('Single photo page', () => {
	test('shows details for a single photo', async ({ page }) => {
		await page.goto('/photo/1');

		const photo = page.getByAltText(/^Caption: (.+)$/);

		await expect(photo).toBeVisible();
	});
});

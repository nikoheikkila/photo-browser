import { expect, test } from '@playwright/test';
export const captionPattern = /^Caption: (.+)$/;

test.describe('Single photo page', () => {
	test('shows details for a single photo', async ({ page }) => {
		await page.goto('/photo/1');

		const photo = page.getByAltText(captionPattern);

		await expect(photo).toBeVisible();
	});

	test('allows user to return to home page', async ({ page }) => {
		await page.goto('/photo/1');
		const homeLink = page.getByRole('link', { name: 'Home' });

		await homeLink.click();

		await expect(page).toHaveURL('/');
	});

	test('allows user to return to album page', async ({ page }) => {
		await page.goto('/photo/1');
		const albumLink = page.getByRole('link', { name: 'Back to album' });

		await albumLink.click();

		await expect(page).toHaveURL(/\/album\/\d/);
	});
});

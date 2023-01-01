import { expect, test } from '@playwright/test';
export const captionPattern = /^Caption: (.+)$/;

test.describe('Single photo page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/photo/1');
		await expect(page.getByRole('main')).toBeVisible();
	});

	test('shows details for a single photo', async ({ page }) => {
		const figure = page.getByRole('figure');
		await expect(figure).toBeVisible();

		const caption = figure.getByRole('caption');
		await expect(caption).not.toBeEmpty();

		const photo = figure.getByRole('img');
		await expect(photo).toHaveAttribute('alt', captionPattern);
	});

	test('allows user to return to home page', async ({ page }) => {
		const homeLink = page.getByRole('navigation').getByRole('link');

		await homeLink.click();

		await expect(page).toHaveURL('/');
	});

	test('allows user to return to album page', async ({ page }) => {
		const albumLink = page.getByRole('link', { name: 'Back to album' });

		await albumLink.click();

		await expect(page).toHaveURL(/\/album\/\d/);
	});

	test('displays informative error when photo is not found', async ({ page }) => {
		const alert = page.getByRole('alert');

		await page.goto('/photo/invalid');

		await expect(alert).toContainText(/Invalid photo ID 'invalid' given/);
	});
});

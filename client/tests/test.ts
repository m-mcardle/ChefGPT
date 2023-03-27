import { expect, test } from '@playwright/test';

test('page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Chat GPT' })).toBeVisible();
});

const { test, expect } = require('@playwright/test');

test.describe('Homepage Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://demoqa.com');
    });

    test('Verify homepage title and Elements section navigation', async ({ page }) => {
        // Verify title
        await expect(page).toHaveTitle('DEMOQA');

        // Click Elements card using CSS selector
        await page.click('.category-cards .card:first-child');
        await page.waitForURL('**/elements');
        
        // Add a small wait for the page to settle
        await page.waitForTimeout(2000);
        
        // Use a more specific selector and longer timeout
        const header = page.locator('body > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > div:nth-child(1)');
        await expect(header).toBeVisible({ timeout: 10000 });
        await expect(header).toHaveText('Elements', { timeout: 10000 });

        // Verify left panel is visible
        await expect(page.locator('.left-pannel')).toBeVisible();
    });

    test('Verify Cards are visible on homepage', async ({ page }) => {
        // Verify all cards using CSS selectors
        const cardSelectors = [
            '.category-cards .card:nth-child(1)',  // Elements
            '.category-cards .card:nth-child(2)',  // Forms
            '.category-cards .card:nth-child(3)',  // Alerts
            '.category-cards .card:nth-child(4)',  // Widgets
            '.category-cards .card:nth-child(5)',  // Interactions
            '.category-cards .card:nth-child(6)'   // Book Store
        ];

        const expectedTexts = [
            'Elements',
            'Forms',
            'Alerts, Frame & Windows',
            'Widgets',
            'Interactions',
            'Book Store Application'
        ];

        // Verify each card is visible and has correct text
        for (let i = 0; i < cardSelectors.length; i++) {
            const card = page.locator(cardSelectors[i]);
            await expect(card).toBeVisible();
            await expect(card.locator('h5')).toHaveText(expectedTexts[i]);
        }
    });

    test('Verify Selenium Training banner exists and navigates correctly', async ({ page }) => {
        // Verify banner using CSS selector
        const banner = page.locator('.home-banner a img');
        await expect(banner).toBeVisible();

        // Click banner and verify navigation
        const popupPromise = page.waitForEvent('popup');
        await banner.click();
        const popup = await popupPromise;
        
        // Verify new page
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/.*selenium-training/);
    });
});
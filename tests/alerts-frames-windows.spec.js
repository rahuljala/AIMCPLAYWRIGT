import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AlertsFramesWindowsPage } from '../pages/AlertsFramesWindowsPage';

test.describe('Alerts, Frames and Windows Features', () => {
    let homePage;
    let alertsFramesWindowsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        alertsFramesWindowsPage = new AlertsFramesWindowsPage(page);
        await page.goto('/');
        await homePage.clickOnAlertsCard();
    });

    test.describe('Browser Windows', () => {
        test('should handle new tab @smoke', async ({ page, context }) => {
            await alertsFramesWindowsPage.navigateToBrowserWindows();
            
            // Using enhanced BasePage switchToNewWindow method
            const newPage = await alertsFramesWindowsPage.switchToNewWindow(async () => {
                await alertsFramesWindowsPage.clickElement('#tabButton');
            });
            
            await expect(newPage).toHaveURL(/.*\/sample/);
            await expect(newPage.locator('#sampleHeading')).toHaveText('This is a sample page');
            await newPage.close();
        });

        test('should handle new window @regression', async ({ page, context }) => {
            await alertsFramesWindowsPage.navigateToBrowserWindows();
            
            const newPage = await alertsFramesWindowsPage.switchToNewWindow(async () => {
                await alertsFramesWindowsPage.clickElement('#windowButton');
            });
            
            await expect(newPage).toHaveURL(/.*\/sample/);
            await expect(newPage.locator('#sampleHeading')).toHaveText('This is a sample page');
            await newPage.close();
        });

        test('should handle new window message @regression', async ({ page, context }) => {
            await alertsFramesWindowsPage.navigateToBrowserWindows();
            
            const newPage = await alertsFramesWindowsPage.switchToNewWindow(async () => {
                await alertsFramesWindowsPage.clickElement('#messageWindowButton');
            });
            
            await newPage.waitForLoadState();
            await expect(newPage).toBeTruthy();
            await newPage.close();
        });
    });

    test.describe('Alerts', () => {
        test('should handle simple alert @smoke', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            
            // Using enhanced BasePage handleAlert method
            await alertsFramesWindowsPage.handleAlert(true);
            // Verification is implicit in successful handling
        });

        test('should handle timed alert @regression', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            
            // Using timer alert handling with timeout
            await test.step('Wait for and handle timer alert', async () => {
                await alertsFramesWindowsPage.handleTimerAlert();
            });
        });

        test('should handle confirm alert - Accept @smoke', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            
            await alertsFramesWindowsPage.handleConfirmAlert(true);
            await expect(page.locator('#confirmResult')).toHaveText('You selected Ok');
        });

        test('should handle confirm alert - Dismiss @regression', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            
            await alertsFramesWindowsPage.handleConfirmAlert(false);
            await expect(page.locator('#confirmResult')).toHaveText('You selected Cancel');
        });

        test('should handle prompt alert @smoke', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            
            const promptText = 'Test Automation';
            await alertsFramesWindowsPage.handlePromptAlert(promptText);
            await expect(page.locator('#promptResult')).toHaveText(`You entered ${promptText}`);
        });
    });

    test.describe('Frames', () => {
        test('should interact with single frame @smoke', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToFrames();
            
            // Using enhanced BasePage frame handling
            const frame1 = await alertsFramesWindowsPage.switchToFrame('#frame1');
            await expect(frame1.locator('#sampleHeading')).toHaveText('This is a sample page');
            
            const frame2 = await alertsFramesWindowsPage.switchToFrame('#frame2');
            await expect(frame2.locator('#sampleHeading')).toHaveText('This is a sample page');
        });

        test('should handle nested frames @regression', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToNestedFrames();
            
            // Parent frame
            const parentFrame = await alertsFramesWindowsPage.switchToFrame('#frame1');
            await expect(parentFrame.locator('body')).toContainText('Parent frame');
            
            // Child frame within parent
            const childFrame = parentFrame.frameLocator('iframe');
            await expect(childFrame.locator('body')).toContainText('Child Iframe');
        });

        test('should verify frame dimensions @regression', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToFrames();
            
            // Get frame elements
            const frame1 = page.locator('#frame1');
            const frame2 = page.locator('#frame2');
            
            // Verify frame dimensions
            await expect(frame1).toHaveAttribute('width', '500px');
            await expect(frame1).toHaveAttribute('height', '350px');
            await expect(frame2).toHaveAttribute('width', '100px');
            await expect(frame2).toHaveAttribute('height', '100px');
        });
    });

    test.describe('Modal Dialogs', () => {
        test('should handle small modal @smoke', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToModalDialogs();
            
            // Open small modal
            await alertsFramesWindowsPage.openSmallModal();
            
            // Verify modal content
            await expect(page.locator('.modal-body')).toBeVisible();
            await expect(page.locator('.modal-body')).toContainText('This is a small modal');
            await expect(page.locator('.modal-header')).toContainText('Small Modal');
            
            // Close modal
            await alertsFramesWindowsPage.closeSmallModal();
            await expect(page.locator('.modal-body')).not.toBeVisible();
        });

        test('should handle large modal @regression', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToModalDialogs();
            
            // Open large modal
            await alertsFramesWindowsPage.openLargeModal();
            
            // Verify modal content
            await expect(page.locator('.modal-body')).toBeVisible();
            await expect(page.locator('.modal-body')).toContainText('Lorem Ipsum');
            await expect(page.locator('.modal-header')).toContainText('Large Modal');
            
            // Close modal
            await alertsFramesWindowsPage.closeLargeModal();
            await expect(page.locator('.modal-body')).not.toBeVisible();
        });

        test('should verify modal backdrop @regression', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToModalDialogs();
            
            // Open modal and verify backdrop
            await alertsFramesWindowsPage.openSmallModal();
            await expect(page.locator('.modal-backdrop')).toBeVisible();
            
            // Click outside modal
            await page.mouse.click(0, 0);
            await expect(page.locator('.modal-body')).toBeVisible();
            
            // Close properly
            await alertsFramesWindowsPage.closeSmallModal();
            await expect(page.locator('.modal-backdrop')).not.toBeVisible();
        });
    });
});
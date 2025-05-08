import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { WidgetsPage } from '../pages/WidgetsPage';
import { TestData } from '../testdata/TestData';

test.describe('Widgets Page Features', () => {
    let homePage;
    let widgetsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        widgetsPage = new WidgetsPage(page);
        await page.goto('/');
        await homePage.clickOnWidgetsCard();
    });

    test.describe('Accordian', () => {
        test('should toggle and verify content of all sections @smoke', async ({ page }) => {
            await widgetsPage.navigateToAccordian();

            // First section
            await widgetsPage.toggleSection(1);
            const content1 = await widgetsPage.getSectionContent(1);
            await expect(content1).toContain('Lorem Ipsum');
            
            // Verify first section stays open while opening second
            await widgetsPage.toggleSection(2);
            await expect(page.locator('#section1Content')).toBeVisible();
            const content2 = await widgetsPage.getSectionContent(2);
            await expect(content2).toContain('Contrary to popular belief');

            // Third section
            await widgetsPage.toggleSection(3);
            const content3 = await widgetsPage.getSectionContent(3);
            await expect(content3).toContain('It is a long established fact');
        });

        test('should collapse expanded section @regression', async ({ page }) => {
            await widgetsPage.navigateToAccordian();
            
            // Expand and collapse first section
            await widgetsPage.toggleSection(1);
            await expect(page.locator('#section1Content')).toBeVisible();
            
            await widgetsPage.toggleSection(1);
            await expect(page.locator('#section1Content')).not.toBeVisible();
        });
    });

    test.describe('Auto Complete', () => {
        test('should handle multiple color selection @smoke', async ({ page }) => {
            await widgetsPage.navigateToAutoComplete();
            const colors = TestData.getColors().slice(0, 3);
            await widgetsPage.typeMultipleColors(colors);

            // Verify all colors are selected
            for (const color of colors) {
                await expect(page.locator('.auto-complete__multi-value'))
                    .toContainText(color);
            }
        });

        test('should handle single color selection @regression', async ({ page }) => {
            await widgetsPage.navigateToAutoComplete();
            const color = TestData.getColors()[0];
            await widgetsPage.typeSingleColor(color);
            await expect(page.locator('.auto-complete__single-value')).toHaveText(color);
        });

        test('should remove selected color @regression', async ({ page }) => {
            await widgetsPage.navigateToAutoComplete();
            const colors = TestData.getColors().slice(0, 2);
            await widgetsPage.typeMultipleColors(colors);
            
            // Remove first color
            await page.click('.auto-complete__multi-value__remove:first-child');
            await expect(page.locator('.auto-complete__multi-value')).not.toContainText(colors[0]);
            await expect(page.locator('.auto-complete__multi-value')).toContainText(colors[1]);
        });
    });

    test.describe('Date Picker', () => {
        test('should select date @smoke', async ({ page }) => {
            await widgetsPage.navigateToDatePicker();
            const futureDate = '05/08/2025';
            await widgetsPage.setDate(futureDate);
            const dateValue = await page.inputValue('#datePickerMonthYearInput');
            await expect(dateValue).toBe(futureDate);
        });

        test('should select date and time @regression', async ({ page }) => {
            await widgetsPage.navigateToDatePicker();
            const dateTime = 'May 8, 2025 3:00 PM';
            await widgetsPage.setDateAndTime(dateTime);
            const dateTimeValue = await page.inputValue('#dateAndTimePickerInput');
            await expect(dateTimeValue).toContain(dateTime);
        });

        test('should handle date validation @regression', async ({ page }) => {
            await widgetsPage.navigateToDatePicker();
            
            // Try invalid date
            await page.fill('#datePickerMonthYearInput', 'invalid');
            await page.keyboard.press('Enter');
            
            // Should revert to valid date
            const dateValue = await page.inputValue('#datePickerMonthYearInput');
            await expect(dateValue).toMatch(/\d{2}\/\d{2}\/\d{4}/);
        });
    });

    test.describe('Slider', () => {
        test('should move slider to specific value @smoke', async ({ page }) => {
            await widgetsPage.navigateToSlider();
            await widgetsPage.moveSlider(75);
            
            const slider = page.locator('.range-slider');
            await expect(slider).toHaveValue('75');
        });

        test('should handle keyboard controls @regression', async ({ page }) => {
            await widgetsPage.navigateToSlider();
            await page.click('.range-slider');
            
            // Move with arrow keys
            for (let i = 0; i < 5; i++) {
                await page.keyboard.press('ArrowRight');
            }
            
            const slider = page.locator('.range-slider');
            const value = await slider.inputValue();
            await expect(parseInt(value)).toBeGreaterThan(0);
        });
    });

    test.describe('Progress Bar', () => {
        test('should start and stop progress @smoke', async ({ page }) => {
            await widgetsPage.navigateToProgressBar();
            
            await widgetsPage.startProgress();
            await widgetsPage.waitForProgress(50);
            await widgetsPage.stopProgress();
            
            const progressBar = page.locator('.progress-bar');
            const progressValue = await progressBar.getAttribute('aria-valuenow');
            expect(parseInt(progressValue)).toBeGreaterThanOrEqual(50);
        });

        test('should reset progress @regression', async ({ page }) => {
            await widgetsPage.navigateToProgressBar();
            
            await widgetsPage.startProgress();
            await widgetsPage.waitForProgress(30);
            await widgetsPage.resetProgress();
            
            const progressBar = page.locator('.progress-bar');
            await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
        });

        test('should complete progress bar @regression', async ({ page }) => {
            await widgetsPage.navigateToProgressBar();
            
            await widgetsPage.startProgress();
            await widgetsPage.waitForProgress(100);
            
            const progressBar = page.locator('.progress-bar');
            await expect(progressBar).toHaveAttribute('aria-valuenow', '100');
            await expect(page.locator('#resetButton')).toBeVisible();
        });
    });

    test.describe('Tabs', () => {
        test('should switch between tabs @smoke', async ({ page }) => {
            await widgetsPage.navigateToTabs();
            
            // Test each tab
            await widgetsPage.switchToTab('what');
            await expect(page.locator('#demo-tabpane-what')).toBeVisible();
            
            await widgetsPage.switchToTab('origin');
            await expect(page.locator('#demo-tabpane-origin')).toBeVisible();
            
            await widgetsPage.switchToTab('use');
            await expect(page.locator('#demo-tabpane-use')).toBeVisible();
        });

        test('should handle disabled tab @regression', async ({ page }) => {
            await widgetsPage.navigateToTabs();
            await expect(page.locator('#demo-tab-more')).toBeDisabled();
        });
    });

    test.describe('Tool Tips', () => {
        test('should display tooltip on hover @smoke', async ({ page }) => {
            await widgetsPage.navigateToToolTips();
            
            const tooltipText = await widgetsPage.getTooltipText();
            await expect(tooltipText).toBe('You hovered over the Button');
        });

        test('should display tooltip for text field @regression', async ({ page }) => {
            await widgetsPage.navigateToToolTips();
            
            await page.hover('#toolTipTextField');
            const tooltip = await page.locator('.tooltip-inner');
            await expect(tooltip).toHaveText('You hovered over the text field');
        });
    });

    test.describe('Select Menu', () => {
        test('should handle old style select @smoke', async ({ page }) => {
            await widgetsPage.navigateToSelectMenu();
            await widgetsPage.selectOldStyle('3'); // Select 'Yellow'
            
            const select = page.locator('#oldSelectMenu');
            await expect(select).toHaveValue('3');
        });

        test('should handle multi select @regression', async ({ page }) => {
            await widgetsPage.navigateToSelectMenu();
            await widgetsPage.selectMultiple(['volvo', 'saab']);
            
            const select = page.locator('#cars');
            await expect(select).toHaveValues(['volvo', 'saab']);
        });
    });
});
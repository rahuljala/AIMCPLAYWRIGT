import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ElementsPage } from '../../pages/ElementsPage';
import { FormsPage } from '../../pages/FormsPage';
import { AlertsFramesWindowsPage } from '../../pages/AlertsFramesWindowsPage';
import { WidgetsPage } from '../../pages/WidgetsPage';
import { InteractionsPage } from '../../pages/InteractionsPage';
import { TestData } from '../../testdata/TestData';
import path from 'path';

test.describe('Regression Tests', () => {
    test.describe('Elements Regression', () => {
        let homePage;
        let elementsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            elementsPage = new ElementsPage(page);
            await page.goto('/');
            await homePage.clickOnElementsCard();
        });

        test('R01: should handle check box tree structure', async ({ page }) => {
            await elementsPage.navigateToCheckBox();
            await elementsPage.clickElement('button[title="Expand all"]');
            await elementsPage.clickElement('text=Downloads');
            const result = elementsPage.page.locator('#result');
            await expect(result).toContainText(['downloads', 'wordFile', 'excelFile']);
        });

        test('R02: should perform CRUD operations on web table', async ({ page }) => {
            await elementsPage.navigateToWebTables();
            const tableData = TestData.getTableRecord();
            
            await elementsPage.addNewTableRecord(tableData);
            await elementsPage.searchTable(tableData.firstName);
            await expect(page.locator('.rt-tbody')).toContainText([tableData.firstName, tableData.lastName]);
            
            await elementsPage.editTableRecord(0);
            await elementsPage.fillInput('#firstName', 'Updated' + tableData.firstName);
            await elementsPage.clickElement('#submit');
            
            await elementsPage.searchTable('Updated');
            await expect(page.locator('.rt-tbody')).toContainText('Updated' + tableData.firstName);
            
            await elementsPage.deleteTableRecord(0);
            await elementsPage.searchTable('Updated' + tableData.firstName);
            await expect(page.locator('.rt-tbody')).not.toContainText('Updated' + tableData.firstName);
        });

        test('R03: should handle different types of links', async ({ page }) => {
            await elementsPage.navigateToLinks();
            
            const newPage = await page.context().waitForEvent('page', async () => {
                await elementsPage.clickElement('#simpleLink');
            });
            await expect(newPage).toHaveURL('https://demoqa.com/');
            await newPage.close();
            
            const apiCalls = [
                { id: 'created', code: '201' },
                { id: 'no-content', code: '204' },
                { id: 'moved', code: '301' },
                { id: 'bad-request', code: '400' },
                { id: 'unauthorized', code: '401' },
                { id: 'forbidden', code: '403' },
                { id: 'invalid-url', code: '404' }
            ];

            for (const call of apiCalls) {
                await elementsPage.clickElement(`#${call.id}`);
                await expect(page.locator('#linkResponse')).toContainText(call.code);
            }
        });
    });

    test.describe('Forms Regression', () => {
        let homePage;
        let formsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            formsPage = new FormsPage(page);
            await page.goto('/');
            await homePage.clickOnFormsCard();
            await formsPage.navigateToPracticeForm();
        });

        test('R04: should validate required fields', async ({ page }) => {
            await formsPage.submitForm();
            const requiredFields = {
                firstName: '#firstName',
                lastName: '#lastName',
                gender: '[name="gender"]',
                mobile: '#userNumber'
            };
            for (const [field, selector] of Object.entries(requiredFields)) {
                await expect(page.locator(selector)).toHaveClass(/field-error/);
            }
        });

        test('R05: should validate mobile number format', async ({ page }) => {
            const personalInfo = TestData.getPersonalInfo();
            await formsPage.fillPersonalInfo({
                ...personalInfo,
                mobile: '123'
            });
            await formsPage.submitForm();
            await expect(page.locator('#userNumber')).toHaveClass(/field-error/);

            await formsPage.fillPersonalInfo(personalInfo);
            await formsPage.submitForm();
            await expect(page.locator('#userNumber')).not.toHaveClass(/field-error/);
        });

        test('R06: should validate email format', async ({ page }) => {
            const personalInfo = TestData.getPersonalInfo();
            await formsPage.fillPersonalInfo({
                ...personalInfo,
                email: 'invalid-email'
            });
            await formsPage.submitForm();
            await expect(page.locator('#userEmail')).toHaveClass(/field-error/);

            await formsPage.fillPersonalInfo(personalInfo);
            await formsPage.submitForm();
            await expect(page.locator('#userEmail')).not.toHaveClass(/field-error/);
        });

        test('R07: should handle state and city dependent dropdowns', async ({ page }) => {
            const address = TestData.getAddress();
            await formsPage.fillAddress(address);
            await expect(page.locator('#state')).toContainText(address.state);
            await expect(page.locator('#city')).toContainText(address.city);
            await page.click('#state .css-19bqh2r');
            await expect(page.locator('#city')).toBeDisabled();
        });
    });

    test.describe('Alerts Windows Frames Regression', () => {
        let homePage;
        let alertsFramesWindowsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            alertsFramesWindowsPage = new AlertsFramesWindowsPage(page);
            await page.goto('/');
            await homePage.clickOnAlertsCard();
        });

        test('R08: should handle timed alert', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            await test.step('Wait for and handle timer alert', async () => {
                await alertsFramesWindowsPage.handleTimerAlert();
            });
        });

        test('R09: should handle new window', async ({ page, context }) => {
            await alertsFramesWindowsPage.navigateToBrowserWindows();
            const newPage = await alertsFramesWindowsPage.switchToNewWindow(async () => {
                await alertsFramesWindowsPage.clickElement('#windowButton');
            });
            await expect(newPage).toHaveURL(/.*\/sample/);
            await expect(newPage.locator('#sampleHeading')).toHaveText('This is a sample page');
            await newPage.close();
        });

        test('R10: should handle nested frames', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToNestedFrames();
            const parentFrame = await alertsFramesWindowsPage.switchToFrame('#frame1');
            await expect(parentFrame.locator('body')).toContainText('Parent frame');
            const childFrame = parentFrame.frameLocator('iframe');
            await expect(childFrame.locator('body')).toContainText('Child Iframe');
        });

        test('R11: should handle large modal', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToModalDialogs();
            await alertsFramesWindowsPage.openLargeModal();
            await expect(page.locator('.modal-body')).toBeVisible();
            await expect(page.locator('.modal-body')).toContainText('Lorem Ipsum');
            await expect(page.locator('.modal-header')).toContainText('Large Modal');
            await alertsFramesWindowsPage.closeLargeModal();
            await expect(page.locator('.modal-body')).not.toBeVisible();
        });
    });

    test.describe('Widgets Regression', () => {
        let homePage;
        let widgetsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            widgetsPage = new WidgetsPage(page);
            await page.goto('/');
            await homePage.clickOnWidgetsCard();
        });

        test('R12: should handle slider movements', async ({ page }) => {
            await widgetsPage.navigateToSlider();
            await widgetsPage.moveSlider(75);
            const slider = page.locator('.range-slider');
            await expect(slider).toHaveValue('75');

            await page.click('.range-slider');
            for (let i = 0; i < 5; i++) {
                await page.keyboard.press('ArrowRight');
            }
            const value = await slider.inputValue();
            await expect(parseInt(value)).toBeGreaterThan(75);
        });

        test('R13: should handle progress bar operations', async ({ page }) => {
            await widgetsPage.navigateToProgressBar();
            await widgetsPage.startProgress();
            await widgetsPage.waitForProgress(50);
            await widgetsPage.stopProgress();
            const progressBar = page.locator('.progress-bar');
            const progressValue = await progressBar.getAttribute('aria-valuenow');
            expect(parseInt(progressValue)).toBeGreaterThanOrEqual(50);

            await widgetsPage.resetProgress();
            await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
        });
    });

    test.describe('Interactions Regression', () => {
        let homePage;
        let interactionsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            interactionsPage = new InteractionsPage(page);
            await page.goto('/');
            await homePage.clickOnInteractionsCard();
        });

        test('R14: should handle grid sorting', async ({ page }) => {
            await interactionsPage.navigateToSortable();
            await interactionsPage.switchToGridView();

            const gridItems = page.locator('.grid-container .list-group-item');
            await expect(gridItems).toHaveCount(9);

            const initialPositions = await gridItems.all();
            const firstItem = initialPositions[0];
            const fourthItem = initialPositions[3];
            await firstItem.dragTo(fourthItem);

            const newItems = await gridItems.all();
            expect(await newItems[3].textContent()).toBe(await firstItem.textContent());
        });

        test('R15: should handle resize operations', async ({ page }) => {
            await interactionsPage.navigateToResizable();
            const box = page.locator(interactionsPage.resizableBox);
            const initialBox = await box.boundingBox();

            await interactionsPage.resizeBox(50, 50);
            const newBox = await box.boundingBox();
            expect(newBox.width).toBeGreaterThan(initialBox.width);
            expect(newBox.height).toBeGreaterThan(initialBox.height);
            expect(newBox.width).toBeLessThanOrEqual(500);
            expect(newBox.height).toBeLessThanOrEqual(300);

            await interactionsPage.resizeBox(-200, -200);
            const finalBox = await box.boundingBox();
            expect(finalBox.width).toBeGreaterThanOrEqual(150);
            expect(finalBox.height).toBeGreaterThanOrEqual(150);
        });
    });
});
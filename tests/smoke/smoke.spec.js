import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ElementsPage } from '../../pages/ElementsPage';
import { FormsPage } from '../../pages/FormsPage';
import { AlertsFramesWindowsPage } from '../../pages/AlertsFramesWindowsPage';
import { WidgetsPage } from '../../pages/WidgetsPage';
import { InteractionsPage } from '../../pages/InteractionsPage';
import { TestData } from '../../testdata/TestData';
import path from 'path';

test.describe('Smoke Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test.describe('Elements', () => {
        let homePage;
        let elementsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            elementsPage = new ElementsPage(page);
            await homePage.clickOnElementsCard();
            await page.waitForLoadState('networkidle');
        });

        test('should submit text box form with valid data', async ({ page }) => {
            await elementsPage.navigateToTextBox();
            await elementsPage.waitForPageLoad();
            const textBoxData = TestData.getTextBoxData();
            await elementsPage.fillTextBoxForm(textBoxData);

            const output = page.locator('#output');
            await expect(output).toBeVisible({ timeout: 10000 });
            
            await expect(output.locator('#name')).toContainText(textBoxData.fullName);
            await expect(output.locator('#email')).toContainText(textBoxData.email);
            await expect(output.locator('#currentAddress')).toContainText(textBoxData.currentAddress);
            await expect(output.locator('#permanentAddress')).toContainText(textBoxData.permanentAddress);
        });

        test('should handle radio button selection', async ({ page }) => {
            await elementsPage.navigateToRadioButton();
            await elementsPage.waitForPageLoad();
            
            await elementsPage.retryClick('text=Yes');
            await expect(elementsPage.page.locator('.text-success')).toHaveText('Yes');
            
            await elementsPage.retryClick('text=Impressive');
            await expect(elementsPage.page.locator('.text-success')).toHaveText('Impressive');
        });

        test('should handle different button clicks', async ({ page }) => {
            await elementsPage.navigateToButtons();
            await elementsPage.waitForPageLoad();
            
            await elementsPage.page.dblclick('#doubleClickBtn');
            await expect(elementsPage.page.locator('#doubleClickMessage')).toBeVisible();
            
            await elementsPage.page.click('#rightClickBtn', { button: 'right' });
            await expect(elementsPage.page.locator('#rightClickMessage')).toBeVisible();
            
            await elementsPage.retryClick("//button[text()='Click Me']");
            await expect(elementsPage.page.locator('#dynamicClickMessage')).toBeVisible();
        });
    });

    test.describe('Forms', () => {
        let homePage;
        let formsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            formsPage = new FormsPage(page);
            await homePage.clickOnFormsCard();
            await page.waitForLoadState('networkidle');
        });

        test('Complete Student Registration Form', async ({ page }) => {
            await formsPage.navigateToPracticeForm();
            await formsPage.waitForPageLoad();
            
            const formData = {
                personalInfo: TestData.getPersonalInfo(),
                dateOfBirth: TestData.getDateOfBirth(),
                subjects: TestData.getSubjects(),
                hobbies: TestData.getHobbies(),
                picturePath: path.join(process.cwd(), 'testdata', 'sample.jpg'),
                address: TestData.getAddress()
            };

            await formsPage.fillStudentRegistrationForm(formData);

            const modal = page.locator('.modal-content');
            await expect(modal).toBeVisible({ timeout: 15000 });
            
            const rows = modal.locator('tbody tr');
            await expect(rows.nth(0).locator('td').nth(1)).toContainText(`${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`);
            await expect(rows.nth(1).locator('td').nth(1)).toContainText(formData.personalInfo.email);
            await expect(rows.nth(2).locator('td').nth(1)).toContainText(formData.personalInfo.gender);
            await expect(rows.nth(3).locator('td').nth(1)).toContainText(formData.personalInfo.mobile);
        });
    });

    test.describe('Alerts and Windows', () => {
        let homePage;
        let alertsFramesWindowsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            alertsFramesWindowsPage = new AlertsFramesWindowsPage(page);
            await homePage.clickOnAlertsCard();
            await page.waitForLoadState('networkidle');
        });

        test('should handle new tab', async ({ page, context }) => {
            await alertsFramesWindowsPage.navigateToBrowserWindows();
            await alertsFramesWindowsPage.waitForPageLoad();
            
            const newPage = await alertsFramesWindowsPage.switchToTab(async () => {
                await alertsFramesWindowsPage.clickElement('#tabButton');
            });
            
            await expect(newPage).toHaveURL(/.*\/sample/);
            await expect(newPage.locator('#sampleHeading')).toHaveText('This is a sample page');
            await newPage.close();
        });

        test('should handle simple alert', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            await alertsFramesWindowsPage.waitForPageLoad();
            
            await page.evaluate(() => {
                document.querySelector('#alertButton').click();
            });
            await page.waitForEvent('dialog').then(dialog => dialog.accept());
        });

        test('should handle confirm alert - Accept', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            await alertsFramesWindowsPage.waitForPageLoad();
            
            await page.evaluate(() => {
                document.querySelector('#confirmButton').click();
            });
            await page.waitForEvent('dialog').then(dialog => dialog.accept());
            await expect(page.locator('#confirmResult')).toHaveText('You selected Ok');
        });

        test('should handle prompt alert', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            await alertsFramesWindowsPage.waitForPageLoad();
            
            const promptText = 'Test Automation';
            await page.evaluate(() => {
                document.querySelector('#promtButton').click();
            });
            await page.waitForEvent('dialog').then(dialog => dialog.accept(promptText));
            await expect(page.locator('#promptResult')).toHaveText(`You entered ${promptText}`);
        });
    });

    test.describe('Widgets', () => {
        let homePage;
        let widgetsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            widgetsPage = new WidgetsPage(page);
            await homePage.clickOnWidgetsCard();
            await page.waitForLoadState('networkidle');
        });

        test('should toggle and verify content of all sections', async ({ page }) => {
            await widgetsPage.navigateToAccordian();
            await widgetsPage.waitForPageLoad();
            
            await widgetsPage.toggleSection(1);
            const content1 = await widgetsPage.getSectionContent(1);
            await expect(content1).toContain('Lorem Ipsum');
        });

        test('should handle multiple color selection', async ({ page }) => {
            await widgetsPage.navigateToAutoComplete();
            await widgetsPage.waitForPageLoad();
            
            const colors = TestData.getColors().slice(0, 3);
            await widgetsPage.typeMultipleColors(colors);
            await page.waitForTimeout(1000);

            for (const color of colors) {
                await expect(page.locator('.auto-complete__multi-value')).toContainText(new RegExp(color));
            }
        });

        test('should select date', async ({ page }) => {
            await widgetsPage.navigateToDatePicker();
            await widgetsPage.waitForPageLoad();
            
            const futureDate = '05/08/2025';
            await widgetsPage.setDate(futureDate);
            const dateValue = await page.inputValue('#datePickerMonthYearInput');
            await expect(dateValue).toBe(futureDate);
        });
    });

    test.describe('Interactions', () => {
        let homePage;
        let interactionsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            interactionsPage = new InteractionsPage(page);
            await homePage.clickOnInteractionsCard();
            await page.waitForLoadState('networkidle');
        });

        test('should sort list items', async ({ page }) => {
            await interactionsPage.navigateToSortable();
            await interactionsPage.waitForPageLoad();
            await interactionsPage.switchToListView();

            const items = page.locator('.list-group-item');
            const initialTexts = await items.allTextContents();
            await interactionsPage.dragAndDropItem(0, 2);
            await page.waitForTimeout(1000);
            const newTexts = await items.allTextContents();
            expect(newTexts[2]).toBe(initialTexts[0]);
        });

        test('should select multiple list items', async ({ page }) => {
            await interactionsPage.navigateToSelectable();
            await interactionsPage.waitForPageLoad();
            
            const indexes = [0, 2];
            await interactionsPage.selectListItems(indexes);

            for (const index of indexes) {
                await expect(page.locator(interactionsPage.listItems).nth(index))
                    .toHaveClass(/active/);
            }
        });

        test('should handle simple drag and drop', async ({ page }) => {
            await interactionsPage.navigateToDroppable();
            await interactionsPage.waitForPageLoad();
            
            await interactionsPage.dragToDroppable();
            await page.waitForTimeout(1000);

            await expect(page.locator(interactionsPage.droppable))
                .toHaveClass(/ui-state-highlight/);
            await expect(page.locator(interactionsPage.droppable))
                .toContainText('Dropped!');
        });
    });
});
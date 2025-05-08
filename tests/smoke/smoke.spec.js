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
    test.describe('Elements', () => {
        let homePage;
        let elementsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            elementsPage = new ElementsPage(page);
            await page.goto('/');
            await homePage.clickOnElementsCard();
        });

        test('should submit text box form with valid data', async ({ page }) => {
            await elementsPage.navigateToTextBox();
            const textBoxData = TestData.getTextBoxData();
            await elementsPage.fillTextBoxForm(textBoxData);

            const output = elementsPage.page.locator('#output');
            await expect(output.locator('#name')).toContainText(textBoxData.fullName);
            await expect(output.locator('#email')).toContainText(textBoxData.email);
            await expect(output.locator('#currentAddress')).toContainText(textBoxData.currentAddress);
            await expect(output.locator('#permanentAddress')).toContainText(textBoxData.permanentAddress);
        });

        test('should handle radio button selection', async ({ page }) => {
            await elementsPage.navigateToRadioButton();
            
            await elementsPage.page.click('text=Yes');
            await expect(elementsPage.page.locator('.text-success')).toHaveText('Yes');
            
            await elementsPage.page.click('text=Impressive');
            await expect(elementsPage.page.locator('.text-success')).toHaveText('Impressive');
        });

        test('should handle different button clicks', async ({ page }) => {
            await elementsPage.navigateToButtons();
            
            await elementsPage.page.dblclick('#doubleClickBtn');
            await expect(elementsPage.page.locator('#doubleClickMessage')).toBeVisible();
            
            await elementsPage.page.click('#rightClickBtn', { button: 'right' });
            await expect(elementsPage.page.locator('#rightClickMessage')).toBeVisible();
            
            await elementsPage.page.click("//button[text()='Click Me']");
            await expect(elementsPage.page.locator('#dynamicClickMessage')).toBeVisible();
        });
    });

    test.describe('Forms', () => {
        let homePage;
        let formsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            formsPage = new FormsPage(page);
            await page.goto('/');
            await homePage.clickOnFormsCard();
        });

        test('Complete Student Registration Form', async ({ page }) => {
            await formsPage.navigateToPracticeForm();
            
            const formData = {
                personalInfo: TestData.getPersonalInfo(),
                dateOfBirth: TestData.getDateOfBirth(),
                subjects: TestData.getSubjects(),
                hobbies: TestData.getHobbies(),
                picturePath: path.join(__dirname, '../../testdata/sample.jpg'),
                address: TestData.getAddress()
            };

            await formsPage.fillStudentRegistrationForm(formData);

            const modal = page.locator('.modal-content');
            await expect(modal).toBeVisible();
            await expect(modal.locator('td')).toContainText([
                `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
                formData.personalInfo.email,
                formData.personalInfo.gender,
                formData.personalInfo.mobile
            ]);
        });
    });

    test.describe('Alerts and Windows', () => {
        let homePage;
        let alertsFramesWindowsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            alertsFramesWindowsPage = new AlertsFramesWindowsPage(page);
            await page.goto('/');
            await homePage.clickOnAlertsCard();
        });

        test('should handle new tab', async ({ page, context }) => {
            await alertsFramesWindowsPage.navigateToBrowserWindows();
            const newPage = await alertsFramesWindowsPage.switchToNewWindow(async () => {
                await alertsFramesWindowsPage.clickElement('#tabButton');
            });
            
            await expect(newPage).toHaveURL(/.*\/sample/);
            await expect(newPage.locator('#sampleHeading')).toHaveText('This is a sample page');
            await newPage.close();
        });

        test('should handle simple alert', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            await alertsFramesWindowsPage.handleAlert(true);
        });

        test('should handle confirm alert - Accept', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            await alertsFramesWindowsPage.handleConfirmAlert(true);
            await expect(page.locator('#confirmResult')).toHaveText('You selected Ok');
        });

        test('should handle prompt alert', async ({ page }) => {
            await alertsFramesWindowsPage.navigateToAlerts();
            const promptText = 'Test Automation';
            await alertsFramesWindowsPage.handlePromptAlert(promptText);
            await expect(page.locator('#promptResult')).toHaveText(`You entered ${promptText}`);
        });
    });

    test.describe('Widgets', () => {
        let homePage;
        let widgetsPage;

        test.beforeEach(async ({ page }) => {
            homePage = new HomePage(page);
            widgetsPage = new WidgetsPage(page);
            await page.goto('/');
            await homePage.clickOnWidgetsCard();
        });

        test('should toggle and verify content of all sections', async ({ page }) => {
            await widgetsPage.navigateToAccordian();
            await widgetsPage.toggleSection(1);
            const content1 = await widgetsPage.getSectionContent(1);
            await expect(content1).toContain('Lorem Ipsum');
        });

        test('should handle multiple color selection', async ({ page }) => {
            await widgetsPage.navigateToAutoComplete();
            const colors = TestData.getColors().slice(0, 3);
            await widgetsPage.typeMultipleColors(colors);

            for (const color of colors) {
                await expect(page.locator('.auto-complete__multi-value'))
                    .toContainText(color);
            }
        });

        test('should select date', async ({ page }) => {
            await widgetsPage.navigateToDatePicker();
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
            await page.goto('/');
            await homePage.clickOnInteractionsCard();
        });

        test('should sort list items', async ({ page }) => {
            await interactionsPage.navigateToSortable();
            await interactionsPage.switchToListView();

            const items = page.locator('.list-group-item');
            const initialTexts = await items.allTextContents();
            await interactionsPage.dragAndDropItem(0, 2);
            const newTexts = await items.allTextContents();
            expect(newTexts[2]).toBe(initialTexts[0]);
        });

        test('should select multiple list items', async ({ page }) => {
            await interactionsPage.navigateToSelectable();
            const indexes = [0, 2];
            await interactionsPage.selectListItems(indexes);

            for (const index of indexes) {
                await expect(page.locator(interactionsPage.listItems).nth(index))
                    .toHaveClass(/active/);
            }
        });

        test('should handle simple drag and drop', async ({ page }) => {
            await interactionsPage.navigateToDroppable();
            await interactionsPage.dragToDroppable();

            await expect(page.locator(interactionsPage.droppable))
                .toHaveClass(/ui-state-highlight/);
            await expect(page.locator(interactionsPage.droppable))
                .toContainText('Dropped!');
        });
    });
});
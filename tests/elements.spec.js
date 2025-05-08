import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ElementsPage } from '../pages/ElementsPage';
import { TestData } from '../testdata/TestData';

test.describe('Elements Page Features', () => {
    let homePage;
    let elementsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        elementsPage = new ElementsPage(page);
        await page.goto('/');
        await homePage.clickOnElementsCard();
    });

    test.describe('Text Box', () => {
        test('should submit text box form with valid data @smoke', async () => {
            await elementsPage.navigateToTextBox();
            const textBoxData = TestData.getTextBoxData();
            await elementsPage.fillTextBoxForm(textBoxData);

            // Verify submitted data
            const output = elementsPage.page.locator('#output');
            await expect(output.locator('#name')).toContainText(textBoxData.fullName);
            await expect(output.locator('#email')).toContainText(textBoxData.email);
            await expect(output.locator('#currentAddress')).toContainText(textBoxData.currentAddress);
            await expect(output.locator('#permanentAddress')).toContainText(textBoxData.permanentAddress);
        });
    });

    test.describe('Check Box', () => {
        test('should handle check box tree structure @regression', async () => {
            await elementsPage.navigateToCheckBox();
            
            // Expand all using improved BasePage method
            await elementsPage.clickElement('button[title="Expand all"]');
            
            // Check Downloads using improved method
            await elementsPage.clickElement('text=Downloads');
            
            // Verify selections using enhanced verification
            const result = elementsPage.page.locator('#result');
            await expect(result).toContainText(['downloads', 'wordFile', 'excelFile']);
        });
    });

    test.describe('Radio Button', () => {
        test('should handle radio button selection @smoke', async () => {
            await elementsPage.navigateToRadioButton();
            
            // Test Yes option
            await elementsPage.page.click('text=Yes');
            await expect(elementsPage.page.locator('.text-success')).toHaveText('Yes');
            
            // Test Impressive option
            await elementsPage.page.click('text=Impressive');
            await expect(elementsPage.page.locator('.text-success')).toHaveText('Impressive');
            
            // Verify No option is disabled
            await expect(elementsPage.page.locator('#noRadio')).toBeDisabled();
        });
    });

    test.describe('Web Tables', () => {
        test('should perform CRUD operations on web table @regression', async () => {
            await elementsPage.navigateToWebTables();
            const tableData = TestData.getTableRecord();
            
            // Add new record
            await elementsPage.addNewTableRecord(tableData);
            
            // Search and verify
            await elementsPage.searchTable(tableData.firstName);
            await expect(elementsPage.page.locator('.rt-tbody')).toContainText(tableData.firstName);
            await expect(elementsPage.page.locator('.rt-tbody')).toContainText(tableData.lastName);
            
            // Edit record
            await elementsPage.editTableRecord(0);
            await elementsPage.fillInput('#firstName', 'Updated' + tableData.firstName);
            await elementsPage.clickElement('#submit');
            
            // Verify edit
            await elementsPage.searchTable('Updated');
            await expect(elementsPage.page.locator('.rt-tbody')).toContainText('Updated' + tableData.firstName);
            
            // Delete record
            await elementsPage.deleteTableRecord(0);
            await elementsPage.searchTable('Updated' + tableData.firstName);
            await expect(elementsPage.page.locator('.rt-tbody')).not.toContainText('Updated' + tableData.firstName);
        });
    });

    test.describe('Buttons', () => {
        test('should handle different button clicks @smoke', async () => {
            await elementsPage.navigateToButtons();
            
            // Double click using enhanced BasePage method
            await elementsPage.page.dblclick('#doubleClickBtn');
            await expect(elementsPage.page.locator('#doubleClickMessage')).toBeVisible();
            
            // Right click
            await elementsPage.page.click('#rightClickBtn', { button: 'right' });
            await expect(elementsPage.page.locator('#rightClickMessage')).toBeVisible();
            
            // Dynamic click
            await elementsPage.page.click("//button[text()='Click Me']");
            await expect(elementsPage.page.locator('#dynamicClickMessage')).toBeVisible();
        });
    });

    test.describe('Links', () => {
        test('should handle different types of links @regression', async () => {
            await elementsPage.navigateToLinks();
            
            // Test simple link with new window handling
            const newPage = await elementsPage.page.context().waitForEvent('page', async () => {
                await elementsPage.clickElement('#simpleLink');
            });
            await expect(newPage).toHaveURL('https://demoqa.com/');
            await newPage.close();
            
            // Test API calls
            await elementsPage.clickElement('#created');
            await expect(elementsPage.page.locator('#linkResponse')).toContainText('201');
            
            await elementsPage.clickElement('#no-content');
            await expect(elementsPage.page.locator('#linkResponse')).toContainText('204');
            
            await elementsPage.clickElement('#moved');
            await expect(elementsPage.page.locator('#linkResponse')).toContainText('301');
            
            await elementsPage.clickElement('#bad-request');
            await expect(elementsPage.page.locator('#linkResponse')).toContainText('400');
            
            await elementsPage.clickElement('#unauthorized');
            await expect(elementsPage.page.locator('#linkResponse')).toContainText('401');
            
            await elementsPage.clickElement('#forbidden');
            await expect(elementsPage.page.locator('#linkResponse')).toContainText('403');
            
            await elementsPage.clickElement('#invalid-url');
            await expect(elementsPage.page.locator('#linkResponse')).toContainText('404');
        });
    });
});
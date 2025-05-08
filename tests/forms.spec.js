import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { FormsPage } from '../pages/FormsPage';
import { TestData } from '../testdata/TestData';
import path from 'path';

test.describe('Forms Page Features', () => {
    let homePage;
    let formsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        formsPage = new FormsPage(page);
        await page.goto('/');
        await homePage.clickOnFormsCard();
        await formsPage.navigateToPracticeForm();
    });

    test('Complete Student Registration Form @smoke', async ({ page }) => {
        const formData = {
            personalInfo: TestData.getPersonalInfo(),
            dateOfBirth: TestData.getDateOfBirth(),
            subjects: TestData.getSubjects(),
            hobbies: TestData.getHobbies(),
            picturePath: path.join(__dirname, '../testdata/sample.jpg'),
            address: TestData.getAddress()
        };

        await formsPage.fillStudentRegistrationForm(formData);

        // Verify form submission
        const modal = page.locator('.modal-content');
        await expect(modal).toBeVisible();

        // Verify personal info
        await expect(modal.locator('td')).toContainText([
            `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
            formData.personalInfo.email,
            formData.personalInfo.gender,
            formData.personalInfo.mobile
        ]);

        // Verify date of birth
        await expect(modal).toContainText(`${formData.dateOfBirth.day} ${
            new Date(2000, formData.dateOfBirth.month).toLocaleString('default', { month: 'long' })
        },${formData.dateOfBirth.year}`);

        // Verify other fields
        await expect(modal.locator('td')).toContainText([
            formData.subjects.join(', '),
            formData.hobbies.join(', '),
            'sample.jpg',
            formData.address.current,
            `${formData.address.state} ${formData.address.city}`
        ]);
    });

    test('Form Validation - Required Fields @regression', async ({ page }) => {
        // Try to submit empty form
        await formsPage.submitForm();

        // Verify validation state of required fields
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

    test('Mobile Number Validation @regression', async ({ page }) => {
        const personalInfo = TestData.getPersonalInfo();
        
        // Test invalid mobile number
        await formsPage.fillPersonalInfo({
            ...personalInfo,
            mobile: '123'  // Invalid length
        });
        
        await formsPage.submitForm();
        await expect(page.locator('#userNumber')).toHaveClass(/field-error/);

        // Test valid mobile number
        await formsPage.fillPersonalInfo(personalInfo);
        await formsPage.submitForm();
        await expect(page.locator('#userNumber')).not.toHaveClass(/field-error/);
    });

    test('Email Format Validation @regression', async ({ page }) => {
        const personalInfo = TestData.getPersonalInfo();
        
        // Test invalid email format
        await formsPage.fillPersonalInfo({
            ...personalInfo,
            email: 'invalid-email'
        });
        
        await formsPage.submitForm();
        await expect(page.locator('#userEmail')).toHaveClass(/field-error/);

        // Test valid email format
        await formsPage.fillPersonalInfo(personalInfo);
        await formsPage.submitForm();
        await expect(page.locator('#userEmail')).not.toHaveClass(/field-error/);
    });

    test('Subject Auto-Complete Functionality @smoke', async ({ page }) => {
        const subjects = TestData.getSubjects();
        
        // Type and select subjects
        await formsPage.selectSubjects(subjects);
        
        // Verify selected subjects
        for (const subject of subjects) {
            await expect(page.locator('.subjects-auto-complete__multi-value'))
                .toContainText(subject);
        }

        // Remove a subject and verify
        await page.click('.subjects-auto-complete__multi-value__remove:first-child');
        await expect(page.locator('.subjects-auto-complete__multi-value'))
            .not.toContainText(subjects[0]);
    });

    test('Date Picker Functionality @regression', async ({ page }) => {
        const date = TestData.getDateOfBirth();
        await formsPage.setDateOfBirth(date);
        
        // Get selected date
        const selectedDate = await page.inputValue('#dateOfBirthInput');
        
        // Verify date format: DD Mon YYYY
        const expectedDate = new Date(date.year, date.month - 1, date.day)
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        
        expect(selectedDate).toBe(expectedDate);
    });

    test('File Upload Functionality @regression', async ({ page }) => {
        const filePath = TestData.getUploadFilePath();
        await formsPage.uploadPicture(filePath);
        
        // Verify file name is displayed
        const fileName = path.basename(filePath);
        await expect(page.locator('#uploadPicture')).toHaveValue(fileName);
    });

    test('State and City Dependent Dropdowns @smoke', async ({ page }) => {
        const address = TestData.getAddress();
        
        // Select state
        await formsPage.fillAddress(address);
        
        // Verify state selection
        await expect(page.locator('#state')).toContainText(address.state);
        
        // Verify city selection
        await expect(page.locator('#city')).toContainText(address.city);
        
        // Clear state and verify city is cleared
        await page.click('#state .css-19bqh2r');
        await expect(page.locator('#city')).toBeDisabled();
    });
});
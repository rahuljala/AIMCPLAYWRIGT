import { BasePage } from './BasePage';

export class FormsPage extends BasePage {
    constructor(page) {
        super(page);
        // Form locators
        this.practiceFormMenu = '.element-group:has-text("Forms") >> text=Practice Form';
        
        // Personal Information
        this.firstNameInput = '#firstName';
        this.lastNameInput = '#lastName';
        this.emailInput = '#userEmail';
        this.genderMaleRadio = '#gender-radio-1';
        this.genderFemaleRadio = '#gender-radio-2';
        this.mobileInput = '#userNumber';
        
        // Date of Birth
        this.dateOfBirthInput = '#dateOfBirthInput';
        this.monthSelect = '.react-datepicker__month-select';
        this.yearSelect = '.react-datepicker__year-select';
        
        // Subjects and Hobbies
        this.subjectsInput = '#subjectsInput';
        this.hobbySportsCheckbox = '#hobbies-checkbox-1';
        this.hobbyReadingCheckbox = '#hobbies-checkbox-2';
        this.hobbyMusicCheckbox = '#hobbies-checkbox-3';
        
        // Picture Upload
        this.uploadPictureInput = '#uploadPicture';
        
        // Address
        this.currentAddressInput = '#currentAddress';
        this.stateInput = '#state';
        this.cityInput = '#city';
        
        // Submit
        this.submitButton = '#submit';
    }

    async navigateToPracticeForm() {
        await this.clickElement(this.practiceFormMenu);
    }

    async fillPersonalInfo(personalInfo) {
        await this.fillInput(this.firstNameInput, personalInfo.firstName);
        await this.fillInput(this.lastNameInput, personalInfo.lastName);
        await this.fillInput(this.emailInput, personalInfo.email);
        await this.page.check(personalInfo.gender === 'Male' ? this.genderMaleRadio : this.genderFemaleRadio);
        await this.fillInput(this.mobileInput, personalInfo.mobile);
    }

    async setDateOfBirth(date) {
        await this.clickElement(this.dateOfBirthInput);
        await this.page.selectOption(this.monthSelect, date.month);
        await this.page.selectOption(this.yearSelect, date.year);
        await this.page.click(`.react-datepicker__day--0${date.day}`);
    }

    async selectSubjects(subjects) {
        for (const subject of subjects) {
            await this.fillInput(this.subjectsInput, subject);
            await this.page.keyboard.press('Enter');
        }
    }

    async selectHobbies(hobbies) {
        if (hobbies.includes('Sports')) await this.page.check(this.hobbySportsCheckbox);
        if (hobbies.includes('Reading')) await this.page.check(this.hobbyReadingCheckbox);
        if (hobbies.includes('Music')) await this.page.check(this.hobbyMusicCheckbox);
    }

    async uploadPicture(filePath) {
        await this.page.setInputFiles(this.uploadPictureInput, filePath);
    }

    async fillAddress(address) {
        await this.fillInput(this.currentAddressInput, address.current);
        await this.clickElement(this.stateInput);
        await this.page.keyboard.type(address.state);
        await this.page.keyboard.press('Enter');
        await this.clickElement(this.cityInput);
        await this.page.keyboard.type(address.city);
        await this.page.keyboard.press('Enter');
    }

    async submitForm() {
        await this.clickElement(this.submitButton);
    }

    async fillStudentRegistrationForm(formData) {
        await this.fillPersonalInfo(formData.personalInfo);
        await this.setDateOfBirth(formData.dateOfBirth);
        await this.selectSubjects(formData.subjects);
        await this.selectHobbies(formData.hobbies);
        if (formData.picturePath) await this.uploadPicture(formData.picturePath);
        await this.fillAddress(formData.address);
        await this.submitForm();
    }
}
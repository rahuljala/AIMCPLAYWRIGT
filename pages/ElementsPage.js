import { BasePage } from './BasePage';

export class ElementsPage extends BasePage {
    constructor(page) {
        super(page);
        // Element locators
        this.textBoxMenu = '.element-group:has-text("Elements") >> text=Text Box';
        this.checkBoxMenu = '.element-group:has-text("Elements") >> text=Check Box';
        this.radioButtonMenu = '.element-group:has-text("Elements") >> text=Radio Button';
        this.webTablesMenu = '.element-group:has-text("Elements") >> text=Web Tables';
        this.buttonsMenu = '.element-group:has-text("Elements") >> text=Buttons';
        this.linksMenu = '.element-group:has-text("Elements") >> text=Links';
        
        // Form fields
        this.fullNameInput = '#userName';
        this.emailInput = '#userEmail';
        this.currentAddressInput = '#currentAddress';
        this.permanentAddressInput = '#permanentAddress';
        this.submitButton = '#submit';

        // Table elements
        this.addNewRecordButton = '#addNewRecordButton';
        this.searchBox = '#searchBox';
        this.editRecordButton = '[title="Edit"]';
        this.deleteRecordButton = '[title="Delete"]';

        // Additional table form fields
        this.firstNameInput = '#firstName';
        this.lastNameInput = '#lastName';
        this.userEmailInput = '#userEmail';
        this.ageInput = '#age';
        this.salaryInput = '#salary';
        this.departmentInput = '#department';
        
        // Upload and download elements
        this.uploadFileInput = '#uploadFile';
        this.downloadButton = '#downloadButton';
        
        // Dynamic properties
        this.enableButton = '#enableAfter';
        this.colorChangeButton = '#colorChange';
        this.visibleAfterButton = '#visibleAfter';
    }

    async navigateToTextBox() {
        await this.clickElement(this.textBoxMenu);
    }

    async navigateToCheckBox() {
        await this.clickElement(this.checkBoxMenu);
    }

    async navigateToRadioButton() {
        await this.clickElement(this.radioButtonMenu);
    }

    async navigateToWebTables() {
        await this.clickElement(this.webTablesMenu);
    }

    async navigateToButtons() {
        await this.clickElement(this.buttonsMenu);
    }

    async navigateToLinks() {
        await this.clickElement(this.linksMenu);
    }

    async fillTextBoxForm(userData) {
        await this.fillInput(this.fullNameInput, userData.fullName);
        await this.fillInput(this.emailInput, userData.email);
        await this.fillInput(this.currentAddressInput, userData.currentAddress);
        await this.fillInput(this.permanentAddressInput, userData.permanentAddress);
        await this.clickElement(this.submitButton);
    }

    async addNewTableRecord(userData) {
        await this.clickElement(this.addNewRecordButton);
        await this.fillInput(this.firstNameInput, userData.firstName);
        await this.fillInput(this.lastNameInput, userData.lastName);
        await this.fillInput(this.userEmailInput, userData.email);
        await this.fillInput(this.ageInput, userData.age.toString());
        await this.fillInput(this.salaryInput, userData.salary.toString());
        await this.fillInput(this.departmentInput, userData.department);
        await this.clickElement(this.submitButton);
    }

    async searchTable(searchText) {
        await this.fillInput(this.searchBox, searchText);
    }

    async editTableRecord(rowIndex) {
        await this.page.locator(this.editRecordButton).nth(rowIndex).click();
    }

    async deleteTableRecord(rowIndex) {
        await this.page.locator(this.deleteRecordButton).nth(rowIndex).click();
    }

    async uploadFile(filePath) {
        await this.page.setInputFiles(this.uploadFileInput, filePath);
    }

    async downloadFile() {
        const downloadPromise = this.page.waitForEvent('download');
        await this.clickElement(this.downloadButton);
        const download = await downloadPromise;
        return download;
    }

    async waitForButtonToBeEnabled() {
        await this.page.waitForSelector(this.enableButton, { state: 'enabled', timeout: 10000 });
    }

    async waitForColorChange() {
        await this.page.waitForSelector(this.colorChangeButton + '.text-danger', { timeout: 10000 });
    }

    async waitForButtonToBeVisible() {
        await this.page.waitForSelector(this.visibleAfterButton, { state: 'visible', timeout: 10000 });
    }

    async getTableData() {
        const rows = await this.page.$$('.rt-tr-group:not(.rt-tr.-padRow)');
        const tableData = [];
        
        for (const row of rows) {
            const cells = await row.$$('.rt-td');
            const rowData = {};
            const headers = ['firstName', 'lastName', 'age', 'email', 'salary', 'department'];
            
            for (let i = 0; i < cells.length; i++) {
                const text = await cells[i].textContent();
                if (text.trim()) {
                    rowData[headers[i]] = text.trim();
                }
            }
            
            if (Object.keys(rowData).length > 0) {
                tableData.push(rowData);
            }
        }
        
        return tableData;
    }

    async verifyRecordExists(userData) {
        const tableData = await this.getTableData();
        return tableData.some(record => 
            record.firstName === userData.firstName &&
            record.lastName === userData.lastName &&
            record.email === userData.email &&
            record.age === userData.age.toString() &&
            record.salary === userData.salary.toString() &&
            record.department === userData.department
        );
    }
}
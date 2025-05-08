export class BasePage {
    constructor(page) {
        this.page = page;
        this.timeout = 10000;
    }

    // Navigation
    async navigateTo(url) {
        await this.page.goto(url);
    }

    // Wait methods
    async waitForElement(selector, options = {}) {
        const defaultOptions = { state: 'visible', timeout: this.timeout };
        await this.page.waitForSelector(selector, { ...defaultOptions, ...options });
    }

    async waitForElementToBeHidden(selector) {
        await this.page.waitForSelector(selector, { state: 'hidden', timeout: this.timeout });
    }

    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle', { timeout: this.timeout });
    }

    // Action methods
    async clickElement(selector) {
        await this.waitForElement(selector);
        await this.page.click(selector);
    }

    async fillInput(selector, value) {
        await this.waitForElement(selector);
        await this.page.fill(selector, value);
    }

    async selectDropdownOption(selector, value) {
        await this.waitForElement(selector);
        await this.page.selectOption(selector, value);
    }

    async uploadFile(selector, filePath) {
        await this.waitForElement(selector);
        await this.page.setInputFiles(selector, filePath);
    }

    // Verification methods
    async getText(selector) {
        await this.waitForElement(selector);
        return await this.page.textContent(selector);
    }

    async getInputValue(selector) {
        await this.waitForElement(selector);
        return await this.page.inputValue(selector);
    }

    async isElementVisible(selector) {
        try {
            await this.waitForElement(selector, { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async isElementEnabled(selector) {
        await this.waitForElement(selector);
        return await this.page.isEnabled(selector);
    }

    // Frame handling
    async switchToFrame(frameSelector) {
        const frame = await this.page.frameLocator(frameSelector);
        return frame;
    }

    // Alert handling
    async handleAlert(accept = true, text = '') {
        const alertPromise = this.page.waitForEvent('dialog');
        const alert = await alertPromise;
        if (text) await alert.accept(text);
        else if (accept) await alert.accept();
        else await alert.dismiss();
    }

    // Window handling
    async switchToNewWindow(action) {
        const newWindowPromise = this.page.context().waitForEvent('page');
        await action();
        const newWindow = await newWindowPromise;
        await newWindow.waitForLoadState();
        return newWindow;
    }

    // Keyboard actions
    async pressKey(key) {
        await this.page.keyboard.press(key);
    }

    async typeText(text) {
        await this.page.keyboard.type(text);
    }

    // Mouse actions
    async hover(selector) {
        await this.waitForElement(selector);
        await this.page.hover(selector);
    }

    async dragAndDrop(sourceSelector, targetSelector) {
        await this.waitForElement(sourceSelector);
        await this.waitForElement(targetSelector);
        const source = await this.page.$(sourceSelector);
        const target = await this.page.$(targetSelector);
        if (source && target) {
            await source.dragTo(target);
        }
    }

    // Screenshot
    async takeScreenshot(path) {
        await this.page.screenshot({ path });
    }

    // Error handling
    async getErrorMessage(selector) {
        await this.waitForElement(selector);
        return await this.getText(selector);
    }

    // Table handling
    async getTableData(tableSelector, rowSelector, cellSelector) {
        await this.waitForElement(tableSelector);
        const rows = await this.page.$$(rowSelector);
        const tableData = [];
        
        for (const row of rows) {
            const cells = await row.$$(cellSelector);
            const rowData = [];
            for (const cell of cells) {
                const text = await cell.textContent();
                rowData.push(text.trim());
            }
            if (rowData.length > 0) {
                tableData.push(rowData);
            }
        }
        return tableData;
    }

    // Form handling
    async submitForm(formSelector) {
        await this.waitForElement(formSelector);
        await this.page.evaluate((selector) => {
            document.querySelector(selector).submit();
        }, formSelector);
    }
}
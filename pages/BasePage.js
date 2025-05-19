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
        await this.waitForElement(selector, { state: 'visible' });
        try {
            await this.page.click(selector);
        } catch (e) {
            // If direct click fails, try JavaScript click
            await this.page.evaluate((sel) => {
                document.querySelector(sel).click();
            }, selector);
        }
    }

    async fillInput(selector, value) {
        await this.waitForElement(selector, { state: 'visible' });
        await this.page.fill(selector, value);
    }

    async selectDropdownOption(selector, value) {
        await this.waitForElement(selector);
        await this.page.selectOption(selector, value);
    }

    async uploadFile(selector, filePath) {
        await this.waitForElement(selector, { state: 'visible' });
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
        const source = await this.page.$(sourceSelector);
        const target = await this.page.$(targetSelector);

        const sourceBound = await source.boundingBox();
        const targetBound = await target.boundingBox();

        await this.page.mouse.move(
            sourceBound.x + sourceBound.width / 2,
            sourceBound.y + sourceBound.height / 2
        );
        await this.page.mouse.down();
        await this.page.waitForTimeout(500); // Wait for drag to start
        await this.page.mouse.move(
            targetBound.x + targetBound.width / 2,
            targetBound.y + targetBound.height / 2,
            { steps: 10 } // Move in small steps
        );
        await this.page.waitForTimeout(500); // Wait before drop
        await this.page.mouse.up();
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

    async removeAds() {
        await this.page.evaluate(() => {
            const adFrames = document.querySelectorAll('#fixedban, [id^="google_ads"]');
            adFrames.forEach(frame => frame.remove());
        });
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.removeAds();
    }

    async selectFromDropdown(selector, value) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.selectOption(selector, value);
    }

    async waitForText(selector, text) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        await expect(this.page.locator(selector)).toContainText(text, { timeout: 10000 });
    }

    async handleDialog(accept = true, promptText = '') {
        const dialogPromise = this.page.waitForEvent('dialog');
        await this.page.evaluate(() => {
            // Remove any blocking elements first
            const blockers = document.querySelectorAll('#fixedban, [id^="google_ads"]');
            blockers.forEach(blocker => blocker.remove());
        });
        const dialog = await dialogPromise;
        if (promptText) {
            await dialog.accept(promptText);
        } else if (accept) {
            await dialog.accept();
        } else {
            await dialog.dismiss();
        }
    }

    async switchToTab(action) {
        const pagePromise = this.page.context().waitForEvent('page');
        await action();
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async retryClick(selector, maxAttempts = 3) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
                await this.page.click(selector);
                return;
            } catch (e) {
                if (i === maxAttempts - 1) throw e;
                await this.page.waitForTimeout(1000);
            }
        }
    }
}
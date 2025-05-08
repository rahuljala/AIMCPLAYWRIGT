import { BasePage } from './BasePage';

export class AlertsFramesWindowsPage extends BasePage {
    constructor(page) {
        super(page);
        // Menu items
        this.browserWindowsMenu = '.element-group:has-text("Alerts") >> text=Browser Windows';
        this.alertsMenu = '.element-group:has-text("Alerts") >> text=Alerts';
        this.framesMenu = '.element-group:has-text("Alerts") >> text=Frames';
        this.nestedFramesMenu = '.element-group:has-text("Alerts") >> text=Nested Frames';
        this.modalDialogsMenu = '.element-group:has-text("Alerts") >> text=Modal Dialogs';

        // Browser Windows elements
        this.newTabButton = '#tabButton';
        this.newWindowButton = '#windowButton';
        this.newWindowMessageButton = '#messageWindowButton';

        // Alerts elements
        this.alertButton = '#alertButton';
        this.timerAlertButton = '#timerAlertButton';
        this.confirmButton = '#confirmButton';
        this.promtButton = '#promtButton';

        // Modal elements
        this.showSmallModal = '#showSmallModal';
        this.showLargeModal = '#showLargeModal';
        this.closeSmallModal = '#closeSmallModal';
        this.closeLargeModal = '#closeLargeModal';
    }

    // Navigation methods
    async navigateToBrowserWindows() {
        await this.clickElement(this.browserWindowsMenu);
    }

    async navigateToAlerts() {
        await this.clickElement(this.alertsMenu);
    }

    async navigateToFrames() {
        await this.clickElement(this.framesMenu);
    }

    async navigateToNestedFrames() {
        await this.clickElement(this.nestedFramesMenu);
    }

    async navigateToModalDialogs() {
        await this.clickElement(this.modalDialogsMenu);
    }

    // Browser Windows methods
    async openNewTab() {
        const newPage = await this.clickAndWaitForNewPage(this.newTabButton);
        return newPage;
    }

    async openNewWindow() {
        const newPage = await this.clickAndWaitForNewPage(this.newWindowButton);
        return newPage;
    }

    // Alerts methods
    async handleSimpleAlert() {
        const alertPromise = this.page.waitForEvent('dialog');
        await this.clickElement(this.alertButton);
        const alert = await alertPromise;
        await alert.accept();
    }

    async handleTimerAlert() {
        const alertPromise = this.page.waitForEvent('dialog');
        await this.clickElement(this.timerAlertButton);
        const alert = await alertPromise;
        await alert.accept();
    }

    async handleConfirmAlert(accept = true) {
        const alertPromise = this.page.waitForEvent('dialog');
        await this.clickElement(this.confirmButton);
        const alert = await alertPromise;
        if (accept) {
            await alert.accept();
        } else {
            await alert.dismiss();
        }
    }

    async handlePromptAlert(text) {
        const alertPromise = this.page.waitForEvent('dialog');
        await this.clickElement(this.promtButton);
        const alert = await alertPromise;
        await alert.accept(text);
    }

    // Frames methods
    async switchToFrame(frameNumber) {
        const frame = await this.page.frameLocator(`#frame${frameNumber}`);
        return frame;
    }

    async getFrameText(frameNumber) {
        const frame = await this.switchToFrame(frameNumber);
        return await frame.locator('#sampleHeading').textContent();
    }

    // Modal methods
    async openSmallModal() {
        await this.clickElement(this.showSmallModal);
    }

    async openLargeModal() {
        await this.clickElement(this.showLargeModal);
    }

    async closeSmallModal() {
        await this.clickElement(this.closeSmallModal);
    }

    async closeLargeModal() {
        await this.clickElement(this.closeLargeModal);
    }

    // Helper method for handling new windows/tabs
    async clickAndWaitForNewPage(selector) {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.clickElement(selector);
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }
}
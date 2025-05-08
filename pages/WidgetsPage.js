import { BasePage } from './BasePage';

export class WidgetsPage extends BasePage {
    constructor(page) {
        super(page);
        // Menu items
        this.accordianMenu = '.element-group:has-text("Widgets") >> text=Accordian';
        this.autoCompleteMenu = '.element-group:has-text("Widgets") >> text=Auto Complete';
        this.datePickerMenu = '.element-group:has-text("Widgets") >> text=Date Picker';
        this.sliderMenu = '.element-group:has-text("Widgets") >> text=Slider';
        this.progressBarMenu = '.element-group:has-text("Widgets") >> text=Progress Bar';
        this.tabsMenu = '.element-group:has-text("Widgets") >> text=Tabs';
        this.toolTipsMenu = '.element-group:has-text("Widgets") >> text=Tool Tips';
        this.menuMenu = '.element-group:has-text("Widgets") >> text=Menu';
        this.selectMenuMenu = '.element-group:has-text("Widgets") >> text=Select Menu';

        // Accordian elements
        this.section1Heading = '#section1Heading';
        this.section2Heading = '#section2Heading';
        this.section3Heading = '#section3Heading';

        // Auto Complete elements
        this.multipleColorInput = '#autoCompleteMultipleInput';
        this.singleColorInput = '#autoCompleteSingleInput';

        // Date Picker elements
        this.datePickerInput = '#datePickerMonthYearInput';
        this.dateAndTimePickerInput = '#dateAndTimePickerInput';

        // Slider element
        this.sliderInput = '.range-slider';

        // Progress Bar elements
        this.startStopButton = '#startStopButton';
        this.progressBar = '.progress-bar';
        this.resetButton = '#resetButton';

        // Tabs elements
        this.whatTab = '#demo-tab-what';
        this.originTab = '#demo-tab-origin';
        this.useTab = '#demo-tab-use';

        // Tooltips elements
        this.toolTipButton = '#toolTipButton';
        this.toolTipTextField = '#toolTipTextField';

        // Select Menu elements
        this.oldSelectMenu = '#oldSelectMenu';
        this.multiSelectDropDown = '#cars';
    }

    // Navigation methods
    async navigateToAccordian() {
        await this.clickElement(this.accordianMenu);
    }

    async navigateToAutoComplete() {
        await this.clickElement(this.autoCompleteMenu);
    }

    async navigateToDatePicker() {
        await this.clickElement(this.datePickerMenu);
    }

    async navigateToSlider() {
        await this.clickElement(this.sliderMenu);
    }

    async navigateToProgressBar() {
        await this.clickElement(this.progressBarMenu);
    }

    // Accordian methods
    async toggleSection(sectionNumber) {
        const sectionSelector = `#section${sectionNumber}Heading`;
        await this.clickElement(sectionSelector);
    }

    async getSectionContent(sectionNumber) {
        const contentSelector = `#section${sectionNumber}Content`;
        return await this.getText(contentSelector);
    }

    // Auto Complete methods
    async typeMultipleColors(colors) {
        for (const color of colors) {
            await this.fillInput(this.multipleColorInput, color);
            await this.page.keyboard.press('Enter');
        }
    }

    async typeSingleColor(color) {
        await this.fillInput(this.singleColorInput, color);
        await this.page.keyboard.press('Enter');
    }

    // Date Picker methods
    async setDate(date) {
        await this.clickElement(this.datePickerInput);
        await this.page.fill(this.datePickerInput, date);
        await this.page.keyboard.press('Enter');
    }

    async setDateAndTime(dateTime) {
        await this.clickElement(this.dateAndTimePickerInput);
        await this.page.fill(this.dateAndTimePickerInput, dateTime);
        await this.page.keyboard.press('Enter');
    }

    // Slider methods
    async moveSlider(value) {
        const slider = this.page.locator(this.sliderInput);
        await slider.click();
        
        // Calculate steps needed to reach target value
        const currentValue = await slider.inputValue();
        const steps = value - parseInt(currentValue);
        
        // Press arrow keys to move slider
        const key = steps > 0 ? 'ArrowRight' : 'ArrowLeft';
        for (let i = 0; i < Math.abs(steps); i++) {
            await this.page.keyboard.press(key);
        }
    }

    // Progress Bar methods
    async startProgress() {
        await this.clickElement(this.startStopButton);
    }

    async stopProgress() {
        await this.clickElement(this.startStopButton);
    }

    async resetProgress() {
        await this.clickElement(this.resetButton);
    }

    async waitForProgress(targetProgress) {
        await this.page.waitForFunction(
            (target) => {
                const progressBar = document.querySelector('.progress-bar');
                return progressBar && parseInt(progressBar.style.width) >= target;
            },
            targetProgress
        );
    }

    // Tabs methods
    async switchToTab(tabName) {
        const tabMap = {
            'what': this.whatTab,
            'origin': this.originTab,
            'use': this.useTab
        };
        await this.clickElement(tabMap[tabName.toLowerCase()]);
    }

    // Tooltips methods
    async hoverOverButton() {
        await this.page.hover(this.toolTipButton);
    }

    async getTooltipText() {
        await this.hoverOverButton();
        return await this.page.textContent('.tooltip-inner');
    }

    // Select Menu methods
    async selectOldStyle(value) {
        await this.page.selectOption(this.oldSelectMenu, value);
    }

    async selectMultiple(values) {
        await this.page.selectOption(this.multiSelectDropDown, values);
    }
}
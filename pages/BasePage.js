export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url);
  }

  async waitForElement(selector) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
  }

  async clickElement(selector) {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }

  async fillInput(selector, value) {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
  }

  async getText(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }
}
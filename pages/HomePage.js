import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.elementsCard = 'div.card:has-text("Elements")';
    this.formsCard = 'div.card:has-text("Forms")';
    this.alertsCard = 'div.card:has-text("Alerts, Frame & Windows")';
    this.widgetsCard = 'div.card:has-text("Widgets")';
    this.interactionsCard = 'div.card:has-text("Interactions")';
    this.bookStoreCard = 'div.card:has-text("Book Store Application")';
  }

  async clickOnElementsCard() {
    await this.clickElement(this.elementsCard);
  }

  async clickOnFormsCard() {
    await this.clickElement(this.formsCard);
  }

  async clickOnAlertsCard() {
    await this.clickElement(this.alertsCard);
  }

  async clickOnWidgetsCard() {
    await this.clickElement(this.widgetsCard);
  }

  async clickOnInteractionsCard() {
    await this.clickElement(this.interactionsCard);
  }

  async clickOnBookStoreCard() {
    await this.clickElement(this.bookStoreCard);
  }
}
import { BrowserContext, Page, expect } from "@playwright/test";

class DashboardPage {
  context: BrowserContext;
  page: Page;
  tileHeaders = [
    "Segment Analysis Over Time",
    "Shipping Countries",
    "Competitors New URLs",
    "Products Keywords Analysis",
  ];

  constructor(page, context) {
    this.context = context;
    this.page = page;
  }

  async isHaveAllTiles () {
    this.tileHeaders.forEach(async(header) => {
        await expect(this.page).toHaveTitle(header);
    });
  }
}

export default DashboardPage;
import { BrowserContext, Page, expect } from "@playwright/test";
import { allure } from "allure-playwright";

class DashboardPage {
  context: BrowserContext;
  page: Page;
  tileHeaders = [
    "Segment Analysis Over Time",
    "Shipping Countries",
    "Competitors New URLs",
    "Products Keywords Analysis",
  ];
  segmentsTileSelector = '[data-testid="segments-tile"]';

  constructor(page, context) {
    this.context = context;
    this.page = page;
  }

  async isHaveAllTiles () {
    this.tileHeaders.forEach(async(header) => {
        await expect(this.page).toHaveTitle(header);
    });
  }

  async checkSegmentsAnalysisComponents () {
    const segmentsTile = this.page.locator(this.segmentsTileSelector);
    allure.step('Check title',async() => {
      await expect(segmentsTile).toHaveText("Segment Analysis Over Time");
    });
    allure.step('Check Segments dropdown',async() => {
      await expect(segmentsTile.locator('#checkboxes-tags-demo')).toBeTruthy();
    });
  }


}

export default DashboardPage;
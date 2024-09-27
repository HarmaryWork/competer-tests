import { test } from "@playwright/test";
import LoginPage from "../../pageObjects/LoginPage";
import navigationURLs from "../../config/navigation";
import dotenv from "dotenv";
import DashboardPage from "../../pageObjects/DashboardPage";

dotenv.config();

test.beforeEach("Create login context", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page, context);
  await loginPage.navigate();
  const response = await loginPage.apiLogin(
    process.env.EMAIL,
    process.env.PASSWORD
  );
  if (response) {
    await page.goto(navigationURLs.dashboard);
  } else {
    console.log("login failed");
  }
});

test.describe("Dashboard page", () => {
  test("should have segments analisis", async ({ page, browser }) => {
    const [context] = await browser.contexts();
    const dashboardPage = new DashboardPage(page, context);
    await dashboardPage.checkSegmentsAnalysisComponents();
  });

  test("should have words cloud", async ({ page }) => {});
  test("should have new urls report", async ({ page }) => {});
  test("should have shipping countries report", async ({ page }) => {});
  test("should open welcome popup, if monitored domains empty", async({page}) => {
    
  });
  test("should open welcome popup, if company domains empty", async({page}) => {

  });
  test("should open error page, if monitored domains return error", async({page}) => {

  });
  test("should open error page, if company domains return error", async({page}) => {

  });
});

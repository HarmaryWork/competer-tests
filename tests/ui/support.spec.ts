import test, { expect } from "@playwright/test";
import LoginPage from "../../pageObjects/LoginPage";
import navigationURLs from "../../config/navigation";
import { allure } from "allure-playwright";
import { SupportPage } from "../../pageObjects/SupportPage";

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
    await page.goto(navigationURLs.support);
  } else {
    console.log("login failed");
  }
});

test.describe("Support page", () => {
  test("should send the correct form", async ({ page, context }) => {
    const supportPage = new SupportPage(page, context);

    await allure.step("Fill category", async () => {
      supportPage.fillCategory("Customer support");
    });
    await allure.step("Fill title", async () => {
      supportPage.fillTitle("Help with login");
    });
    await allure.step("Fill text", async () => {
      supportPage.fillText("Help with login");
    });
    await allure.step("Send form", async () => {
     const [response] = await Promise.all([
       page.waitForResponse((request) =>
         request.url().includes("/SubmitCustomerTicket")
       ),
       supportPage.clickSend(),
     ]);

      expect(response.status()).toBe(200);
    });
    
  });
});

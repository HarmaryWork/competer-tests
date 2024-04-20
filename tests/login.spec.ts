import test, { expect } from "@playwright/test";
import LoginPage from "../pageObjects/LoginPage";
import { allure } from "allure-playwright";
import dotenv from 'dotenv';

dotenv.config();

test.beforeEach(async ({ page, context }) => {
    const loginPage = new LoginPage(page, context);
    await loginPage.navigate();
})

test.describe('Login form', () => {
    test('should login with right creds', async ({ page, context }) => {
        const loginPage = new LoginPage(page, context);
        await allure.step('Fill email', async () => {
            await loginPage.fillEmail(process.env.EMAIL);
        })
        await allure.step('Fill password', async () => {
            await loginPage.fillPassword(process.env.PASSWORD);
        })
        await allure.attachment("search-results.png", await page.screenshot(), {
            contentType: "image/png",
        });
        await allure.step('Click login button', async () => {
            const [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/User/Login') && response.status() === 200, { timeout: 100000 }),
                page.getByRole('button', { name: 'Login' }).click()
            ]);
        })
        
        await allure.step('Check first page', async () => {
            await loginPage.isDashboardVisible();
        })


    });

    test('should show error alert, if creds wrong', async ({ page, context }) => {
        const loginPage = new LoginPage(page, context);
        await loginPage.fillEmail(process.env.EMAIL);
        await loginPage.fillPassword('zzzzzzzzz');
        const [response] = await Promise.all([
            page.waitForResponse(response => response.url().includes('/User/Login'), { timeout: 100000 }),
            page.getByRole('button', { name: 'Login' }).click()
        ]);

        await loginPage.isErrorAlertVisible();
    });

    test('should show errors, if fields empty', async ({ page, context }) => {
        const loginPage = new LoginPage(page, context);
        await allure.step('Click on email field', async () => {
            await loginPage.clickEmailField();
        });
        await allure.step('Click on password field', async () => {
            await loginPage.clickPasswordField();
        });
        await allure.step('Check if email field error is visible', async () => {
            await loginPage.isRequiredFieldErrorVisible();
        });
        await allure.step('Check if password field error is visible', async () => {
            await loginPage.isRequiredFieldPasswordVisible();
        });
    });

    test("should show error, if email field filled, but it is not an email", async ({
      page,
      context,
    }) => {
      const loginPage = new LoginPage(page, context);
      await allure.step("Fill email with incorrect format", async () => {
        await loginPage.fillEmail("test");
      });

      await allure.step("Check if email format error is visible", async () => {
        await loginPage.isEmailFormatErrorVisible();
      });
    });

    test("should do password visible on eye button click", async ({
      page,
      context,
    }) => {
      const loginPage = new LoginPage(page, context);
      await allure.step("Click show password button", async () => {
        await loginPage.clickShowPasswordButton();
      });

      await allure.step("Check if password input type is text", async () => {
        const inputType = await loginPage.getPasswordInputType();
        await expect(inputType).toBe("text");
      });
    });

});
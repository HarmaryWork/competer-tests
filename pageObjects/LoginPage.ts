import { BrowserContext, Page } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

class LoginPage {
  page: Page;
  context: BrowserContext;
  emailInputSelector = "#email-input";
  passwordInputSelector = "#password-input";
  loginButtonSelector = "text=Login";
  resetPasswordButtonSelector = "[type='submit']";
  showPasswordButtonSelector = '[aria-label="toggle password visibility"]';
  resetPasswordLink = "text=Forgot password?";
  dashboardHeadingSelector = "text=Dashboard";
  errorAlertSelector = "text=Error!Auth error: Bad Request";
  requiredFieldErrorSelector = "text=This field is required";
  emailFormatErrorSelector = "text=It doesn't look like email";

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async navigate() {
    await this.page.goto("https://stg.trendos.io/login");
  }

  async apiLogin(email: string, password: string) {
    const response = await this.page.request.post("/User/Login", {
      data: {
        password: password,
        email: email,
        token: process.env.RECAPTCHA_TEST_KEY,
      },
    });
    console.log(response);
    if (response.ok()) {
      const responseBody: { token: string } = await response.json();
      await this.context.addCookies([
        {
          name: "token",
          value: responseBody.token,
          domain: "dev.trendos.io",
          expires: 60 * 60 * 24,
          httpOnly: true,
          secure: true,
        },
      ]);
      return responseBody;
    }
    return false;
  }

  async fillEmail(email: string) {
    await this.page.fill(this.emailInputSelector, email);
  }

  async fillPassword(password: string) {
    await this.page.fill(this.passwordInputSelector, password);
  }

  async isRequiredFieldPasswordVisible() {
    return this.page.inputValue(this.passwordInputSelector);
  }

  async clickLogin() {
    await this.page.click(this.loginButtonSelector);
  }

  async clickEmailField() {
    await this.page.click(this.emailInputSelector);
  }

  async clickPasswordField() {
    await this.page.click(this.passwordInputSelector);
  }

  async clickShowPasswordButton() {
    await this.page.click(this.showPasswordButtonSelector);
  }

  async clickResetPasswordButton() {
    await this.page.click(this.resetPasswordButtonSelector);
  }

  async clickOnResetPasswordLink() {
    await this.page.click(this.resetPasswordLink);
  }

  async waitForLoginResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("/User/Login") && response.status() === 200,
      { timeout: 15000 }
    );
  }

  async loginWithCredentials(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    return this.clickLogin();
  }

  async getPasswordInputType() {
    return this.page.getAttribute(this.passwordInputSelector, "type");
  }

  async isErrorAlertVisible() {
    return this.page.isVisible(this.errorAlertSelector);
  }

  async isDashboardVisible() {
    return this.page.isVisible(this.dashboardHeadingSelector);
  }

  async isRequiredFieldErrorVisible() {
    return await this.page.isVisible(this.requiredFieldErrorSelector);
  }

  async isEmailFormatErrorVisible() {
    return this.page.isVisible(this.emailFormatErrorSelector);
  }
}

export default LoginPage;

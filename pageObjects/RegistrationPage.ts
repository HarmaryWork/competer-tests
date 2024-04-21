import { Page } from "@playwright/test";
import navigationURLs from "../config/navigation";
import faker from "@faker-js/faker"

class RegistrationPage {
  page: Page;
  emailInput;
  passwordInput;
  firstNameInput;
  submitButton;
  lastNameInput;
  confirmPasswordInput;
  firstNameInputSelector = 'input[name="firstname"]';
  lastNameInputSelector = 'input[name="lastname"]';
  emailInputSelector = 'input[name="email"]';
  phoneInputSelector = 'input[name="phone"]';
  passwordInputSelector = 'input[name="password"]';
  confirmPasswordInputSelector = 'input[name="password_repeat"]';
  submitButtonSelector = 'button[type="submit"]';

  constructor(page) {
    this.page = page;
    this.lastNameInput = page.locator(this.lastNameInputSelector);
    this.firstNameInput = page.locator(this.firstNameInputSelector);
    this.emailInput = page.locator(this.emailInputSelector);
    this.passwordInput = page.locator(this.passwordInputSelector);
    this.confirmPasswordInput = page.locator(this.confirmPasswordInputSelector);
    this.submitButton = page.locator(this.submitButtonSelector);
  }

  async navigate() {
    await this.page.goto(navigationURLs.registration);
  }

  async register() {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password(10, true);
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }

  async checkRegistrationSuccess() {
    await expect(this.page).toHaveURL(/confirmation/);
  }
}

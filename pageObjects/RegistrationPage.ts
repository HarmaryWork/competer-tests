import { Page, expect } from "@playwright/test";
import navigationURLs from "../config/navigation";
import { allure } from "allure-playwright";

class RegistrationPage {
  page: Page;
  emailInput;
  passwordInput;
  firstNameInput;
  submitButton;
  lastNameInput;
  phoneInput;
  agreementCheckbox;
  confirmPasswordInput;
  firstNameInputSelector = 'input[name="firstname"]';
  lastNameInputSelector = 'input[name="lastname"]';
  emailInputSelector = 'input[name="email"]';
  phoneInputSelector = 'input[placeholder="1 (702) 123-4567"]';
  passwordInputSelector = 'input[name="password"]';
  confirmPasswordInputSelector = 'input[name="password_repeat"]';
  submitButtonSelector = 'button[type="submit"]';
  agreementCheckboxSelector = 'input[name="user-agreement"]';

  constructor(page) {
    this.page = page;
    this.lastNameInput = page.locator(this.lastNameInputSelector);
    this.firstNameInput = page.locator(this.firstNameInputSelector);
    this.emailInput = page.locator(this.emailInputSelector);
    this.phoneInput = page.locator(this.phoneInputSelector);
    this.passwordInput = page.locator(this.passwordInputSelector);
    this.confirmPasswordInput = page.locator(this.confirmPasswordInputSelector);
    this.submitButton = page.locator(this.submitButtonSelector);
    this.agreementCheckbox = page.locator(this.agreementCheckboxSelector);
  }

  async navigate() {
    await this.page.goto(navigationURLs.registration);
  }

  async fillFirstName(firstName) {
    await allure.step("Filling in the first name", async () => {
      await this.firstNameInput.fill(firstName);
    });
  }

  async checkFirstNameValidation() {
    await allure.step('Click on first name input', async () => {
      await this.firstNameInput.click();
      await this.firstNameInput.blur();
    });
    await allure.step('Check validation message for empty first name', async () => {
      await expect(await this.page.locator("#firstname-input-helper-text")).toHaveText('This field is required');
    });
    await allure.step('Fill first name with numbers', async () => {
      await this.firstNameInput.fill('111');
    });
    await allure.step('Check validation message for invalid first name', async () => {
      await expect(await this.page.locator("#firstname-input-helper-text")).toHaveText('Only english letters allowed');
    });
  }
  
  async checkLastNameValidation() {
    await allure.step('Click on last name input', async () => {
      await this.lastNameInput.click();
      await this.lastNameInput.blur();
    });
    await allure.step('Check validation message for empty last name', async () => {
      await expect(await this.page.locator("#lastname-input-helper-text")).toHaveText('This field is required');
    });
    await allure.step('Fill last name with numbers', async () => {
      await this.lastNameInput.fill('111');
    });
    await allure.step('Check validation message for invalid last name', async () => {
      await expect(await this.page.locator("#lastname-input-helper-text")).toHaveText('Only letters allowed');
    });
  }

  async checkEmailValidation() {
    await allure.step('Click on email input', async () => {
      await this.emailInput.click();
      await this.emailInput.blur();
    });
    await allure.step('Check validation message for empty email', async () => {
      await expect(await this.page.locator("#email-input-helper-text")).toHaveText('This field is required');
    });

    await ['111', '111@', '111@.com', '111.com'].forEach(async(item) => {
      await allure.step(`Fill email with invalid mail: ${item}`, async () => {
        await this.emailInput.fill('111');
      });
      await allure.step(`Check validation message for ${item}`, async () => {
        await expect(await this.page.locator("#email-input-helper-text")).toHaveText("It doesn't look like email");
      });
    });
   
  }

  async checkPasswordValidation() {
    const passwordHelperTextLocator = "label[for='outlined-adornment-password'] ~ p";
    await allure.step('Click on password input', async () => {
      await this.passwordInput.click();
      await this.passwordInput.blur();
    });
    await allure.step('Check validation message for empty password', async () => {
      await expect(await this.page.locator(passwordHelperTextLocator)).toHaveText('This field is required');
    });
    await allure.step('Fill password with short value', async () => {
      await this.passwordInput.fill('111');
    });
    await allure.step('Check validation message for short password', async () => {
      await expect(await this.page.locator(passwordHelperTextLocator)).toHaveText('Password length must be at least 6 characters');
    });
    await allure.step('Fill confirm password with mismatching value', async () => {
      await this.confirmPasswordInput.fill('111111');
    });
    await allure.step('Check validation message for password mismatch', async () => {
      await expect(await this.page.locator("#password_repeat-input-helper-text")).toHaveText('The passwords do not match');
    });
  }

  async fillLastName(lastName) {
    await allure.step("Filling in the last name", async () => {
      await this.lastNameInput.fill(lastName);
    });
  }

  async fillEmail(email) {
    await allure.step('Filling in the email', async () => {
      await this.emailInput.fill(email);
    });
  }

  async fillPhoneNumber(phone) {
    await allure.step('Filling in the phone number', async () => {
      await this.phoneInput.fill(phone);
    });
  }

  async fillPassword(password) {
    await allure.step('Filling in the password', async () => {
      await this.passwordInput.fill(password);
    });
  }

  async confirmPassword(password) {
    await allure.step('Confirming the password', async () => {
      await this.confirmPasswordInput.fill(password);
    });
  }

  async checkAgreement() {
    await allure.step('Checking the agreement', async () => {
      await this.agreementCheckbox.click();
    });
  }

  async submitForm() {
    await allure.step('Submitting the form', async () => {
      await this.submitButton.click();
    });
  }

  async checkErrorAlert() {
    await allure.step('Check error', async () => {
      await expect(this.page.getByRole("alert")).toContainText('Error');
    });
  }

  async uiRegister(userData) {
    await this.fillFirstName(userData.firstName);
    await this.fillLastName(userData.lastName);
    await this.fillEmail(userData.email);
    await this.fillPhoneNumber(userData.phone);
    await this.fillPassword(userData.password);
    await this.confirmPassword(userData.password);
    await this.checkAgreement();
    await Promise.all([
      this.page.waitForResponse(response => response.url().includes('/User/Register'), { timeout: 65000 }),
      this.submitForm()
    ]);
    await expect(this.page.locator("text=Dashboard")).toBeTruthy();
  }

  async fillFormEmptyValues() {
    await this.fillFirstName("");
    await this.fillLastName("");
    await this.fillEmail("");
    await this.fillPhoneNumber("");
    await this.fillPassword("");
    await this.confirmPassword("");
    await this.checkAgreement();
  }

  async checkTermAndPrivacyLinks() {
    await allure.step('Clicking on Terms of Service', async () => {
      await this.page.getByText('Terms of Service', { exact: true }).click();
    });
    await allure.step('Verifying modal text', async () => {
      await expect(this.page.getByRole('heading', { name: 'Subscribe' })).toHaveText('Subscribe');
    });
    await allure.step('Closing the Terms modal', async () => {
      await this.page.getByLabel('close').click();
    });
    await allure.step('Clicking on Privacy Policy', async () => {
      await this.page.getByText('Privacy Policy', { exact: true }).click();
    });
    await allure.step('Verifying modal text', async () => {
      await expect(this.page.getByRole('heading', { name: 'Subscribe' })).toHaveText('Subscribe');
    });
    await allure.step('Closing the Privacy Policy modal', async () => {
      await this.page.getByLabel('close').click();
    });
  }

  async checkGoogleTermAndPrivacyLinks() {
    await allure.step('Check Google Privacy Policy link href', async () => {
      await expect(await this.page.getByText('Google Privacy Policy').getAttribute('href'))
        .toBe('https://policies.google.com/privacy');
    });

    await allure.step('Check Terms of Service link href', async () => {
      await expect(await this.page.getByText('Terms of Service apply.').getAttribute('href'))
        .toBe('https://policies.google.com/terms');
    });
  }

}

export default RegistrationPage;

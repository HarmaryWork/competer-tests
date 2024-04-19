import { Page } from '@playwright/test';

class LoginPage {
    page: Page;
    emailInputSelector = '#outlined-email-input';
    passwordInputSelector = '#outlined-password-input';
    loginButtonSelector = 'text=Login';
    showPasswordButtonSelector = '[aria-label="toggle password visibility"]';
    dashboardHeadingSelector = 'text=Dashboard';
    errorAlertSelector = 'text=Error!Auth error: Bad Request';
    requiredFieldErrorSelector = 'text=This field is required';
    emailFormatErrorSelector = 'text=It doesn\'t look like email';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://dev.trendos.io/login');
    }

    async fillEmail(email: string) {
        await this.page.fill(this.emailInputSelector, email);
    }

    async fillPassword(password: string) {
        await this.page.fill(this.passwordInputSelector, password);
    }

    async isRequiredFieldPasswordVisible() {
        return this.page.inputValue(this.passwordInputSelector)
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

    async waitForLoginResponse() {
        return this.page.waitForResponse(response => response.url().includes('/User/Login') && response.status() === 200, { timeout: 100000 });
    }

    async loginWithCredentials(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        return this.clickLogin();
    }

    async getPasswordInputType () {
        return this.page.getAttribute(this.passwordInputSelector, 'type');
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
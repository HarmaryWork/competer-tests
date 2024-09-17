import test, { expect } from "@playwright/test";
import RegistrationPage from "../../pageObjects/RegistrationPage";
import { generateUserData } from "../../testData";


test.beforeEach(async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
})

test.describe("Registration page", () => {
    
    test('should register with right data', async ({page}) => {
        const registrationPage = new RegistrationPage(page);
        const userData = generateUserData();
        await registrationPage.uiRegister(userData);
     });
    test('should have disabled submit button if form is empty', async({page}) => { 
        const registrationPage = new RegistrationPage(page);
        await registrationPage.fillFormEmptyValues();
        await expect(registrationPage.submitButton).toBeDisabled();
    });
    test('should have validation', async({page}) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.checkFirstNameValidation();
        await registrationPage.checkLastNameValidation();
        await registrationPage.checkEmailValidation();
        await registrationPage.checkPasswordValidation();
     });
    test('should show message if user already exist', async({page}) => { 
        const userData = generateUserData();
        const registrationPage = new RegistrationPage(page);
        await registrationPage.uiRegister({...userData, email: process.env.EMAIL});
        await registrationPage.checkErrorAlert();
    });
    test('should have terms and privacy links',async ({page}) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.checkTermAndPrivacyLinks();
    })
    test('should have google terms and privacy links', async({page}) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.checkGoogleTermAndPrivacyLinks();
    })
})
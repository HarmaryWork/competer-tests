import { expect, test } from "@playwright/test";
import LoginPage from "../../pageObjects/LoginPage";
import { allure } from "allure-playwright";

let monitoredDomains;
let token;

test.beforeAll("Create login context", async ({ browser, request }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page, context);
    await loginPage.navigate();
    const response = await loginPage.apiLogin(
        process.env.EMAIL,
        process.env.PASSWORD
    );
    if (response) {
        token = response.token;
    }
    monitoredDomains = await request.get('/Company/MonitoredDomainsList', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
});


allure.tag("API");
test.describe("API shipping countries endpoint", () => {
    test("should return 401 if don't have token", async ({ request }) => {
        const responseWithoutToken = await request.get('/Reports/GetShippingCountryComparison');
        allure.attachment("response", await responseWithoutToken.body(), "application/json");
        expect(responseWithoutToken.status()).toBe(401);
    })
    test("should return 404 if data isn't right", async({request}) => {
        const responseWithoutToken = await request.get('/Reports/GetShippingCountryComparison',{
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
            domainIds: Math.random()
        }}
        );
        allure.attachment("response", await responseWithoutToken.body(), "application/json");
        expect(responseWithoutToken.status()).toBe(404);
    })
    test("should return right format of data", async ({ context, request }) => {
        const { domains } = monitoredDomains;

        const responseWithToken = await request.get('/Reports/GetShippingCountryComparison', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                domainIds: domains.map((item) => item.id).slice(2),
            }
        });
        allure.attachment("response", await responseWithToken.body(), "application/json");
        expect(responseWithToken.status()).toBe(200);
        const responseBody = await responseWithToken.json();
        expect(responseBody).toHaveProperty('reportData');
        expect(responseBody.reportData[0]).toHaveProperty('countryIsoCodes');
        expect(responseBody.reportData[0]).toHaveProperty('domains');
    })
})
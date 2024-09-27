import { BrowserContext, Page } from "@playwright/test";

type Category = "Customer support" | "Billing Issue" | "Feature request";

export class SupportPage {
    page: Page;
    context: BrowserContext;
    private _formSelectors = {
        category: "[label='Category']",
        title: "[label='Title']",
        text: "[label='Text']",
        sendButton: "[name='Send']"
    };

    constructor (page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }

    async fillCategory(category: Category) {
        await this.page.click(this._formSelectors.category);
        await this.page.getByRole('option', { name: category }).click();
    }

    async fillTitle(title: string) {
        await this.page.fill(this._formSelectors.title, title);
    }

    async fillText(text: string) {
        await this.page.fill(this._formSelectors.text, text);
    }

    async clickSend() {
        await this.page.click(this._formSelectors.sendButton);
    }

}
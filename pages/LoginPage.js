import { expect } from "@playwright/test";
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Log In' });
        this.logoutButton = page.locator('text=Log Out');
        this.menu = page.locator('button[aria-label="menu"]');
    }

    async goto() {
        await this.page.goto(process.env.BASE_URL);
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.passwordInput.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
        const baseUrlWithoutLogin = process.env.BASE_URL.replace('/login', '');
        await expect(this.page).toHaveURL(`${baseUrlWithoutLogin}/admin`);
        const dialog = await this.page.waitForSelector('[role="dialog"]', { timeout: 3000 }).catch(() => null);

        if (dialog) {
            await this.page.click('[role="dialog"] [aria-label="Close"]');
            await this.page.waitForSelector('[role="dialog"]', { state: 'detached' });
        }

    }

    async logout() {
        await this.page.evaluate(() => {
            document.querySelector('button[aria-label="menu"]')?.click();
        });
        await this.logoutButton.hover();
        await this.logoutButton.click();
        await expect(this.loginButton).toBeVisible();
        console.log("Successfully logged out.");
    }





}

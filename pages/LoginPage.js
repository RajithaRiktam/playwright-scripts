import { expect } from "@playwright/test";
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.menu=page.getByRole('button', { name: 'menu' });
    }

    async goto() {
        await this.page.goto('https://app.zinterview.ai/login');
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.passwordInput.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
        const baseUrlWithoutLogin = process.env.BASE_URL.replace('/login', '');
        await expect(this.page).toHaveURL(`${baseUrlWithoutLogin}/admin`);
    }

    async logout() {
        await this.menu.click();
        await this.logoutButton.click();
        await this.page.waitForSelector('text=Login'); // Wait for login page
        console.log("Successfully logged out.");
    }
}

import fs from 'fs';
import { logout } from "../utils/authUtils.js";
import { LoginPage } from '../pages/LoginPage';
import { test, expect } from "@playwright/test";
import roles from "../testdata/roles.json";
import { assiningRolesLocators } from "../locators/assigningRolesLocators.js";

export class AssignRolePage {
    constructor(page) {
        this.page = page;
    }

    async assignRole() {

        await this.page.waitForLoadState('domcontentloaded');
        const jobData = JSON.parse(fs.readFileSync("./jobData.json", "utf-8"));


        const jobIdValue = jobData.jobIdValue1;
        const jobCard = await this.page.locator(`.card:has-text("Job ID: ${jobIdValue}")`);

        const icon = await jobCard.locator(assiningRolesLocators.moreVertIcon);
        await expect(icon).toBeVisible();
        await icon.hover();
        await this.page.waitForTimeout(300);
        await icon.click();
        await this.page.waitForTimeout(500);
        await this.page.locator(assiningRolesLocators.assignOpeningButton).click();
        await this.page.locator(assiningRolesLocators.selectUsersCombobox).click();
        await this.page.waitForTimeout(100);
        await this.page.locator(assiningRolesLocators.testUserOption).click();
        await this.page.locator(assiningRolesLocators.assignButton).click();
        await expect(this.page.locator(assiningRolesLocators.assignedSuccessMessage)).toBeVisible();
        // Click backdrop if it's visible (in case modal masked the page)
        const backdrop = this.page.locator('.MuiBackdrop-root');
        if (await backdrop.isVisible({ timeout: 1000 }).catch(() => false)) {
            await backdrop.click({ force: true });
        }

        await logout(this.page);

        const loginPage = new LoginPage(this.page);
        await loginPage.goto();
        await loginPage.login(roles.email, roles.passsword);
        await expect(this.page.getByText(`Job ID: ${jobIdValue}`)).toBeVisible();





    }
}
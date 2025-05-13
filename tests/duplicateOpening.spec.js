import { test, expect } from "@playwright/test";
import { login } from "../utils/authUtils.js";
import { DuplicateOpeningPage } from "../pages/duplicateOpeningPage.js";


test("Create Job Opening", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await test.step('Step 1: Login', async () => {
        await login(page);
    });   
    await test.step('Step 2: Duplicate Opening ', async () => {
        const duplicateOpeningPage = new DuplicateOpeningPage(page);
        await duplicateOpeningPage.duplicateOpening();
    });






});

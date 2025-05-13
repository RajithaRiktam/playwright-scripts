import { test, expect } from "@playwright/test";
import { login } from "../utils/authUtils.js";
import { DeleteOpeningPage } from "../pages/deleteOpeningPage.js";


test("Create Job Opening", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await test.step('Step 1: Login', async () => {
        await login(page);
    });   
    await test.step('Step 4: Delete Opening ', async () => {
        const deleteOpeningPage = new DeleteOpeningPage(page);
        await deleteOpeningPage.deleteOpening();
    });






});

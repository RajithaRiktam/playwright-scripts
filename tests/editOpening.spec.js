import { test, expect } from "@playwright/test";
import { login } from "../utils/authUtils.js";

import { EditOpeningPage } from "../pages/EditOpeningPage.js";


test("Edit Job Opening", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await test.step('Step 1: Login', async () => {
        await login(page);
    });
    await test.step('Step 4: Edit Opening ', async () => {
        const editOpeningPage = new EditOpeningPage(page);
        await editOpeningPage.editOpening();
    });







});

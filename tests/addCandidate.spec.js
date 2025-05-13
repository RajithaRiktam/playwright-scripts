import { test, expect } from "@playwright/test";
import { login } from "../utils/authUtils.js";
import { AddCandidatesPage } from "../pages/addCandidatesPage.js"


test("Create Job Opening", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await test.step('Step 1: Login', async () => {
        await login(page);
    });
    await test.step('Step 3: Add Candidates ', async () => {
        const addCandidatesPage = new AddCandidatesPage(page);
        await addCandidatesPage.addCandidates();
    });







});

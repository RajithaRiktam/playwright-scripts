import { test, expect } from "@playwright/test";
import { login } from "../utils/authUtils.js";
import { CreateOpeningPage } from "../pages/CreateOpeningPage.js";
import { AddCandidatesPage } from "../pages/addCandidatesPage.js"
import { DuplicateOpeningPage } from "../pages/duplicateOpeningPage.js";
import { DeleteOpeningPage } from "../pages/deleteOpeningPage.js";

test("Create Job Opening", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await test.step('Step 1: Login', async () => {
        await login(page);
    });
    await test.step('Step 2: Create Opening ', async () => {
        const createOpeningPage = new CreateOpeningPage(page);
        await createOpeningPage.createOpening();
    });
 /*   await test.step('Step 3: Add Candidates ', async () => {
        const addCandidatesPage = new AddCandidatesPage(page);
        await addCandidatesPage.addCandidates();
    });
    await test.step('Step 4: Duplicate Opening ', async () => {
        const duplicateOpeningPage = new DuplicateOpeningPage(page);
        await duplicateOpeningPage.duplicateOpening();
    });
    await test.step('Step 5: Delete Opening ', async () => {
        const deleteOpeningPage = new DeleteOpeningPage(page);
        await deleteOpeningPage.deleteOpening();
    });
    await test.step('Step 5: Delete Opening ', async () => {
        logout(page);
    });*/






});

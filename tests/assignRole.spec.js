import { test, expect } from "@playwright/test";
import { login } from "../utils/authUtils.js";
import { AssignRolePage } from "../pages/assigningRolePage.js";


test("Step - 5 Assigning Role ", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
   
    await test.step('Login', async () => {
        await login(page);
    });
    await test.step('Assign role test step', async () => {
        const assignRolePage = new AssignRolePage(page);
        await assignRolePage.assignRole();
    });






});

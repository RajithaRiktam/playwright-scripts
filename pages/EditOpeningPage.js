import { editOpeningLocators } from "../locators/editOpeningLocators";
import fs from 'fs';
import { test, expect } from "@playwright/test";
import editOpeningData from "../testdata/editOpeningData.json";

export class EditOpeningPage {
    constructor(page) {
        this.page = page;
    }

    async editOpening() {
        // test.setTimeout(90000); 

        await this.page.waitForLoadState('domcontentloaded');
        const jobData = JSON.parse(fs.readFileSync("./jobData.json", "utf-8"));


        const jobIdValue = jobData.jobIdValue1;
        const jobCard = await this.page.locator(`.card:has-text("Job ID: ${jobIdValue}")`);

        const icon = jobCard.locator(editOpeningLocators.moreVertIcon);
        await icon.waitFor({ state: 'visible' });
        await icon.click();


        await button.waitFor({ state: 'attached', timeout: 20000 });
        await expect(button).toBeVisible();
        await button.click();


        await this.page.locator(editOpeningLocators.jobOpeningTextbox).click();
        for (const data of editOpeningData) {

            // Update Job Opening Name
            const jobOpeningTextbox = this.page.locator(editOpeningLocators.jobOpeningTextbox);
            await jobOpeningTextbox.click();
            await jobOpeningTextbox.press('End');
            await jobOpeningTextbox.type(data.opening_Name_upd);

            // Add Responsibility
            await this.page.locator(editOpeningLocators.addResponsibilityButton).click();
            await this.page.locator(editOpeningLocators.responsibilityInput).fill(data.responsibilities);
            await this.page.locator(editOpeningLocators.deleteResponsibilityButton).click();

            // Add Skill
            await this.page.locator(editOpeningLocators.addSkillButton).nth(1).click();
            await this.page.locator(editOpeningLocators.deleteSkillButton).first().click();
            await this.page.locator(editOpeningLocators.skillInput).fill(data.skillInput);


            // Max Questions
            await this.page.locator(editOpeningLocators.maxQuestionsSpinButton).fill(data.max_questions);

            // Submit
            await this.page.locator(editOpeningLocators.updateOpeningButton).click();
            await this.page.waitForTimeout(1000);


            const jobTitleElement = jobCard.locator(editOpeningLocators.openingname);
            await expect(jobTitleElement).toHaveText(/./);

            const jobName = await jobTitleElement.textContent();

            console.log(`Job name resolved to: "${jobName}"`);

            const actualName = jobName;
            const expectedName = jobData.Opening_Name1 + data.opening_Name_upd;
            expect(actualName).toBe(expectedName);

            let existingData = {};
            if (fs.existsSync('jobData.json')) {
                existingData = JSON.parse(fs.readFileSync('jobData.json', 'utf-8'));
            }

            // Update the JSON with job name
            existingData.Opening_Name1 = jobName;

            // Write the updated JSON back to jobData.json
            fs.writeFileSync('jobData.json', JSON.stringify(existingData, null, 2));


        }
    }
}
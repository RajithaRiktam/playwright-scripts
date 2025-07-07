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

        // Wait for the moreVertIcon to be visible and interactable
        const icon = jobCard.locator(editOpeningLocators.moreVertIcon);
        await icon.waitFor({ state: 'visible', timeout: 5000 });
        await icon.hover();
        await icon.click();

        // Now wait for the Edit Opening button
        const button = this.page.locator(editOpeningLocators.editOpeningButton);
        console.log('Waiting for Edit Opening button...');
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await button.hover();
        await button.click();



        /*  const icon = await jobCard.locator(editOpeningLocators.moreVertIcon);
          await expect(icon).toBeVisible();
          await icon.hover();
          await this.page.waitForTimeout(300);
          await icon.click();
          await this.page.waitForTimeout(500);
  
          const button = await this.page.locator(editOpeningLocators.editOpeningButton);
          console.log('Waiting for Edit Opening button...');
          await expect(button).toBeVisible({ timeout: 20000 });
          await button.hover();
          await this.page.waitForTimeout(200);
          await button.click();
  */
        await this.page.locator(editOpeningLocators.jobOpeningTextbox).click();
        for (const data of editOpeningData) {

            // Update Job Opening Name
            const jobOpeningTextbox = this.page.locator(editOpeningLocators.jobOpeningTextbox);
            await jobOpeningTextbox.click();
            await jobOpeningTextbox.press('End');
            await jobOpeningTextbox.type(data.opening_Name_upd);



            const responsibilities = await this.page.locator('input[name^="jobRequirementsAndResponsibilities"]');
            const initialCount = await responsibilities.count();

            await this.page.locator(editOpeningLocators.addResponsibilityButton).click();
            await expect(responsibilities).toHaveCount(initialCount + 1);

            await responsibilities.nth(initialCount).fill(data.responsibilities);
            await this.page.locator(editOpeningLocators.deleteResponsibilityButton).first().click();


            // Add a new skill
            await this.page.locator(editOpeningLocators.addSkillButton).nth(1).click();

            // Delete the first skill
            await this.page.locator(editOpeningLocators.deleteSkillButton).first().click();

            // Wait for the skill input list
            const skillInputs = this.page.locator(editOpeningLocators.skillInput);
            const count = await skillInputs.count();
            // check
            if (count === 0) {
                throw new Error('No skill inputs found after add/delete actions');
            }

            // Fill the last one
            await skillInputs.nth(count - 1).fill(data.skillInput);



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
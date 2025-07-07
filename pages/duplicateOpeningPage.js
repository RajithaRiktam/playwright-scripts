import { test, expect } from "@playwright/test";
import { duplicateLocators } from "../locators/duplicateLocators.js";
import fs from 'fs';

export class DuplicateOpeningPage {
    constructor(page) {
        this.page = page;
    }
    async duplicateOpening() {

        const fs = require('fs');
        const jobData = JSON.parse(fs.readFileSync('./jobData.json', 'utf-8'));
        const jobIdValue = jobData.jobIdValue1;
        const jobCard = await this.page.locator(`.card:has-text("Job ID: ${jobIdValue}")`);
        await this.page.waitForTimeout(1000);

        await jobCard.locator(duplicateLocators.moreVertIcon).click();
        await this.page.waitForTimeout(500);

        // Use global scope for menu item
        await this.page.locator(duplicateLocators.duplicateButton).click();
        await this.page.waitForTimeout(500);
        await expect(this.page.locator(duplicateLocators.confirmationHeading)).toBeVisible({ timeout: 10000 });
        const titleLocator = await this.page.locator(duplicateLocators.confirmationHeading);
        const titleText = await titleLocator.textContent();


        const match = titleText?.match(/ID:\s*([\w-]+)/);
        const extractedId = match ? match[1] : null;
        console.log('Extracted ID:', extractedId);
        await this.page.locator(duplicateLocators.yesButton).click();
        await expect(await this.page.locator(duplicateLocators.duplicateSuccessMessage)).toBeVisible();

        const jobTitleToFind = jobData.Opening_Name1;
        let foundJobId = '';

        // get all job ID elements (they contain text: Job ID: <id>)
        await this.page.waitForSelector('span.font-bold');
        const jobIdElements = await this.page.locator('span.font-bold');
        const count = await jobIdElements.count();
        console.log('count - ', count);

        for (let i = 0; i < count; i++) {
            const jobIdElement = await jobIdElements.nth(i);

            // card container
            const card = await jobIdElement.locator('..'); // go up one level
            const jobTitleElement = await card.locator('h3'); // get the job title inside the same card


            try {
                const jobTitle = await jobTitleElement.innerText();
                console.log('jobTitle - ', jobTitle);

                if (jobTitle.trim() === jobTitleToFind) {
                    const jobIdText = await jobIdElement.innerText();
                    foundJobId = await jobIdText.replace('Job ID: ', '').trim();
                    console.log('In loop Found Job ID:', foundJobId);
                    break;
                }
            } catch (e) {
                console.error('----ERROR----', e);

                console.log('Not Found Job ID:');
                continue;
            }
        }

        console.log('Found Job ID:', foundJobId);

        let jobIdValue3 = foundJobId;
        let dup_opening = '';

        let existingData = {};
        if (fs.existsSync('jobData.json')) {
            existingData = JSON.parse(fs.readFileSync('jobData.json', 'utf-8'));
        }

        // Update the JSON with job name
        existingData.jobIdValue3 = jobIdValue3;
        // Write the updated JSON back to jobData.json
        fs.writeFileSync('jobData.json', JSON.stringify(existingData, null, 2));

        const dupjobCard = await this.page.locator(`.card:has-text("Job ID: ${jobIdValue3}")`);
        // Find job name
        const jobNameLocator = await dupjobCard.locator('h3');

        // Extract the text
        const jobName = await jobNameLocator.textContent();

        console.log('Dup Job Name-------- :', jobName);
        dup_opening = jobName;


        existingData = {};
        if (fs.existsSync('jobData.json')) {
            existingData = JSON.parse(fs.readFileSync('jobData.json', 'utf-8'));
        }

        // Update the JSON with job name
        existingData.dup_opening = dup_opening;
        fs.writeFileSync('jobData.json', JSON.stringify(existingData, null, 2));


        /*const dupjobContainer = await this.page.locator(`//h3[normalize-space()='${jobName}']/ancestor::div[contains(@class, 'card')]`);

         // Check if job is active
           const statusText = await dupjobContainer.locator(duplicateLocators.jobStatusLocator).last().innerText();
           console.log(statusText.trim());
   
           jobIdValue3 = foundJobId;
           console.log('jobIdValue3 - ' + jobIdValue3);
   
           if (statusText.trim() === "Active") {
               console.log(`Job ID ${jobIdValue3} is Active`);
   
               // Extract interview URL
               const interviewUrl = await this.page.locator(`//input[@id='${jobIdValue3}']`).getAttribute('value');
               console.log('Extracted URL:', interviewUrl);
   
               // Store the original page reference
               const originalPage = this.page;
   
               // Open a new tab
               const newTab = await this.page.context().newPage();
               await newTab.goto(interviewUrl);
               await newTab.waitForTimeout(500);
               await expect(newTab.locator(duplicateLocators.userInformationHeading)).toBeVisible();
               // Close the new tab
               await newTab.close();
               // Switch back to the original tab
               this.page = originalPage; // Restore the reference
               await this.page.bringToFront(); // Ensure it's active
   
   
   
           } else {
               console.log(`Job ID ${jobIdValue3} is NOT Active`);
           }*/








    }
}

import { test, expect } from "@playwright/test";
import { duplicateLocators } from "../locators/duplicateLocators.js";
import fs from 'fs';

export class DuplicateOpeningPage {
    constructor(page) {
        this.page = page;
    }
    async duplicateOpening() {
        // await this.page.setViewportSize({ width: 1920, height: 1080 });

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
        const titleLocator = this.page.locator(duplicateLocators.confirmationHeading);
        const titleText = await titleLocator.textContent();


        const match = titleText?.match(/ID:\s*([\w-]+)/);
        const extractedId = match ? match[1] : null;

        console.log('Extracted ID:', extractedId);



        await this.page.locator(duplicateLocators.yesButton).click();
        await expect(this.page.locator(duplicateLocators.duplicateSuccessMessage)).toBeVisible();
        let jobIdValue3 = '';
        let dup_opening = '';

        /* const now = new Date();
         const formattedDate = now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
         const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
         const dup_opening = `Duplicate Java Developer Opening - ${formattedDate} ${formattedTime}`;
         await this.page.waitForTimeout(1000);
         // Fill the input field with dynamic date & time
         await this.page.locator(duplicateLocators.jobOpeningNameInput).fill(dup_opening);
         await this.page.waitForTimeout(500);
         await expect(this.page.locator(duplicateLocators.updateOpeningHeading)).toBeVisible();
         await this.page.locator(duplicateLocators.updateOpeningButton).click();
         await expect(this.page.locator(`role=heading[name="${dup_opening}"]`)).toBeVisible();
 
         const dupjobContainer = await this.page.locator(`//h3[normalize-space()='${dup_opening}']/ancestor::div[contains(@class, 'card')]`);*/


        let existingData = {};
        if (fs.existsSync('jobData.json')) {
            existingData = JSON.parse(fs.readFileSync('jobData.json', 'utf-8'));
        }

        existingData.jobIdValue3 = extractedId;

        // Update the JSON with job 
        existingData.dup_opening = dup_opening;

        // Write the updated JSON back to jobData.json
        fs.writeFileSync('jobData.json', JSON.stringify(existingData, null, 2));


        // Find job ID
        const jobIdLocator = this.page.locator(`span:text("Job ID: ${extractedId}")`);

        // Find job name
        const jobNameLocator = jobIdLocator.locator('xpath=following-sibling::h3');

        // Extract the text
        const jobName = await jobNameLocator.textContent();

        console.log('Job Name:', jobName);

        existingData = {};
        if (fs.existsSync('jobData.json')) {
            existingData = JSON.parse(fs.readFileSync('jobData.json', 'utf-8'));
        }
        existingData.dup_opening = jobName;

        // Write the updated JSON back to jobData.json
        fs.writeFileSync('jobData.json', JSON.stringify(existingData, null, 2));

        const dupjobContainer = await this.page.locator(`//h3[normalize-space()='${jobName}']/ancestor::div[contains(@class, 'card')]`);

        // Check if job is active
        const statusText = await dupjobContainer.locator(duplicateLocators.jobStatusLocator).last().innerText();
        console.log(statusText.trim());

        jobIdValue3 = extractedId;
          console.log('jobIdValue3 - '+jobIdValue3);

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
        }








    }
}




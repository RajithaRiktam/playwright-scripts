import { test, expect } from "@playwright/test";
import fs from "fs";
import { deleteLocators } from "../locators/deleteOpeningLocators.js";

export class DeleteOpeningPage {
    constructor(page) {
        this.page = page;
    }

    async deleteOpening() {
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        // Read jobData dynamically to ensure the latest values are used
        const jobData = JSON.parse(fs.readFileSync("./jobData.json", "utf-8"));

        // Extract job IDs dynamically
        const jobIds = Object.keys(jobData)
            .filter(key => key.startsWith("jobIdValue")) // Get only job ID keys
            .map(key => jobData[key]) // Retrieve their values
            .filter(jobId => jobId); // Remove undefined or null values

        if (jobIds.length === 0) {
            console.error("No valid Job IDs found in jobData.json");
            return;
        }

        for (const jobIdValue of jobIds) {
            console.log(`Attempting to delete Job ID: ${jobIdValue}`);

            try {
                // Locate the job card containing the given Job ID
                const jobContainer = await this.page.locator(deleteLocators.jobContainer(jobIdValue));
                const jobTitleElement = jobContainer.locator(deleteLocators.openingname);
                await expect(jobTitleElement).toHaveText(/./); 

                const jobName = await jobTitleElement.textContent();

                console.log(`Job name resolved to: "${jobName}"`);
                await jobContainer.locator(deleteLocators.moreVertIcon).click();

                // Wait for the delete option to be visible after clicking the menu
                const deleteIcon = await this.page.locator(deleteLocators.deleteIcon);
                await expect(deleteIcon).toBeVisible();
                await deleteIcon.click();

                const jobIdLocator = await this.page.locator(deleteLocators.deleteDialogTitle);
                await jobIdLocator.waitFor({ state: "visible" });

                // Get the text content of the delete confirmation dialog
                const dialogText = await jobIdLocator.textContent();
                console.log("Dialog Text - ", dialogText);

                // Extract Job ID using regex
                const jobIdMatch = await dialogText.match(/id:\s([a-f0-9]{24})/);

                if (jobIdMatch) {
                    const jobID_Dialog = jobIdMatch[1]; // Extracted Job ID
                    console.log("Extracted Job ID:", jobID_Dialog);
                    const jobId1 = jobIdValue.replace("Job ID: ", "").trim();

                    if (jobId1 === jobID_Dialog) {
                        console.log("Job IDs match! Confirming deletion...");
                        await this.page.locator(deleteLocators.yesButton).click();
                    } else {
                        console.log("Job IDs do not match! Canceling deletion...");
                        await this.page.locator(deleteLocators.noButton).click();
                    }
                } else {
                    console.log("Job ID not found in the dialog text.");
                }

                const alertText = `Opening ${jobName} deleted`;
                console.log(alertText);
                await expect(this.page.getByText(alertText)).toBeVisible();

                console.log(`PASS - Successfully deleted Job ID: ${jobIdValue}`);
                await this.page.waitForTimeout(500);
            } catch (error) {
                console.error(`ERROR - Failed to delete Job ID: ${jobIdValue} - ${error.message}`);
            }
        }
    }
}

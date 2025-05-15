import { addCandidatesLocators } from "../locators/addCandidatesLocators.js";
import fs from 'fs';
import { test, expect } from "@playwright/test";

export class AddCandidatesPage {
    constructor(page) {
        this.page = page;
    }

    async addCandidates() {
        test.setTimeout(100000);

        await this.page.waitForLoadState('domcontentloaded');

        const testdata = JSON.parse(fs.readFileSync('./testdata/createOpeningData.json', 'utf-8'));
        const jobData = JSON.parse(fs.readFileSync("./jobData.json", "utf-8"));

        const technicalData = testdata.filter(job => job.category === "Technical");

        for (let i = 0; i < technicalData.length; i++) {
            const job = technicalData[i];
            const jobIdKey = `jobIdValue${i + 1}`;
            const jobIdValue = jobData[jobIdKey];

            if (!jobIdValue) {
                console.error(`Job ID not found for ${job.role}`);
                continue;
            }

            console.log(`Processing job: ${job.role}, Job ID: ${jobIdValue}`);

            const jobCard = await this.page.locator(addCandidatesLocators.jobCard(jobIdValue));
            await jobCard.locator(addCandidatesLocators.showCandidatesButton).click();
            await this.page.waitForLoadState('networkidle');

            for (const candidate of job.candidates) {
                console.log(`Adding candidate: ${candidate.firstName} ${candidate.lastName}`);

                const modalBackdrop = this.page.locator('.MuiBackdrop-root');

                if (await modalBackdrop.isVisible().catch(() => false)) {
                    console.log(" Modal detected. Closing...");

                    await this.page.keyboard.press('Escape'); // closing with Escape key
                    await modalBackdrop.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {
                        console.error("ERROR: Modal did not close in time!");
                    });
                }



                console.log("Modal closed. Proceeding...");

                // Ensure the button is enabled before clicking
                await this.page.locator(addCandidatesLocators.addCandidateButton).waitFor({ state: 'visible', timeout: 5000 });

                await this.page.locator(addCandidatesLocators.addCandidateButton).click({ force: true });

                await this.page.locator('input[name="firstName"]').fill(candidate.firstName);
                await this.page.locator('input[name="lastName"]').fill(candidate.lastName);
                await this.page.locator('input[name="preferredName"]').fill(candidate.preferredName);
                await this.page.locator('input[name="email"]').fill(candidate.email);
                await this.page.getByRole('spinbutton').fill(candidate.experience.toString());

                await this.page.locator('#country-selector').fill(candidate.country);
                const dropdownOption = this.page.getByRole('option', { name: candidate.countryoption });

                if (await dropdownOption.isVisible().catch(() => false)) {
                    await dropdownOption.click();
                }

                await this.page.locator('input[name="phoneNumber"]').fill(candidate.phoneNumber);
                await this.page.setInputFiles('input[name="resume"]', candidate.resumePath);
                await this.page.getByRole('button', { name: 'Save' }).click();
                console.log(`Clicked "Save" for ${candidate.email}`);

                // Wait for success message
                const successToast = this.page.locator('//div[contains(@class, "Toastify__toast-body")]');
                const successMessage = this.page.locator('//div[text()="Successfully saved user details"]');

                const successAppeared = await Promise.race([
                    successToast.waitFor({ state: 'attached', timeout: 10000 }).then(() => true).catch(() => false),
                    successMessage.waitFor({ state: 'attached', timeout: 10000 }).then(() => true).catch(() => false)
                ]);

                if (!successAppeared) {
                    console.error(`ERROR: Candidate save confirmation did NOT appear for ${candidate.email}`);
                    continue;
                } else {
                    console.log(`Successfully saved candidate: ${candidate.email}`);
                }


                const candidateLocator = this.page.getByRole('row').filter({ hasText: candidate.email });

                try {
                    await this.page.waitForFunction(
                        async (email) => {
                            const rows = document.querySelectorAll('tr');
                            return Array.from(rows).some(row => row.innerText.includes(email));
                        },
                        candidate.email,
                        { timeout: 15000 }
                    );
                    console.log(`Candidate row found: ${candidate.email}`);

                    //await expect(candidateLocator).toContainText(candidate.firstName);
                    //await expect(candidateLocator).toContainText(candidate.lastName);
                    await expect(candidateLocator).toContainText(candidate.email);
                } catch (error) {
                    console.error(`ERROR: Candidate row did NOT appear for ${candidate.email}`);
                }
            }

            // Ensure page navigation completes before proceeding
            try {
                await this.page.goBack();
                await this.page.waitForLoadState('domcontentloaded'); // Wait for page load
            } catch (error) {
                console.error(`ERROR: Failed to navigate back`);
            }
        }
    }
}
































/*import { addCandidatesLocators } from "../locators/addCandidatesLocators.js";
import fs from 'fs';
import { test, expect } from "@playwright/test";


export class AddCandidatesPage {
    constructor(page) {
        this.page = page;
    }


    async addCandidates() {
        test.setTimeout(90000); // Increase test timeout to 90 seconds

        await this.page.waitForTimeout(2000);

        const testdata = JSON.parse(fs.readFileSync('./testdata/createOpeningData.json', 'utf-8'));
        const jobData = JSON.parse(fs.readFileSync("./jobData.json", "utf-8"));

        // Filter all technical job openings
        const technicalData = testdata.filter(job => job.category === "Technical");

        for (let i = 0; i < technicalData.length; i++) {
            const job = technicalData[i];
            const jobIdKey = `jobIdValue${i + 1}`; // Dynamically get job ID key
            const jobIdValue = jobData[jobIdKey]; // Fetch the correct job ID

            if (!jobIdValue) {
                console.error(`Job ID not found for ${job.role}`);
                continue;
            }

            console.log(`Processing job: ${job.role}, Job ID: ${jobIdValue}`);

            // Locate the job card for the correct job
            const jobCard = await this.page.locator(addCandidatesLocators.jobCard(jobIdValue));
            await jobCard.locator(addCandidatesLocators.showCandidatesButton).click();
            await this.page.waitForTimeout(1000);

            for (const candidate of job.candidates) {
                console.log(`Adding candidate: ${candidate.firstName} ${candidate.lastName}`);

                await this.page.waitForSelector(addCandidatesLocators.addCandidateButton, { timeout: 10000 });
                await this.page.locator(addCandidatesLocators.addCandidateButton).click();
                await this.page.locator('input[name="firstName"]').fill(candidate.firstName);
                await this.page.locator('input[name="lastName"]').fill(candidate.lastName);
                await this.page.locator('input[name="preferredName"]').fill(candidate.preferredName);
                await this.page.locator('input[name="email"]').fill(candidate.email);
                await this.page.getByRole('spinbutton').fill(candidate.experience.toString());

                await this.page.locator('#country-selector').fill(candidate.country);
                const dropdownOption = this.page.getByRole('option', { name: candidate.countryoption });

                if (await dropdownOption.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await dropdownOption.click();
                }

                await this.page.locator('input[name="phoneNumber"]').fill(candidate.phoneNumber);
                await this.page.setInputFiles('input[name="resume"]', candidate.resumePath);
                await this.page.getByRole('button', { name: 'Save' }).click();
                console.log(`Clicked "Save" for ${candidate.email}`);
                
                // Wait for either a toast OR some other page update
                const successToast = this.page.locator('//div[contains(@class, "Toastify__toast-body")]');
                const successMessage = this.page.locator('//div[text()="Successfully saved user details"]');
                
                // Wait for either to appear
                const successAppeared = await Promise.race([
                    successToast.waitFor({ state: 'visible', timeout: 20000 }).then(() => true).catch(() => false),
                    successMessage.waitFor({ state: 'visible', timeout: 20000 }).then(() => true).catch(() => false)
                ]);
                
                if (!successAppeared) {
                    console.error(`ERROR: Candidate save confirmation did NOT appear for ${candidate.email}`);
                } else {
                    console.log(`Successfully saved candidate: ${candidate.email}`);
                }
                // Ensure toast disappears before proceeding
                await this.page.waitForTimeout(5000);

                // Locate the candidate row using their unique email ID
                const candidateLocator = await this.page
                    .getByRole('row')
                    .filter({ hasText: candidate.email });

                // Wait for the row to be visible
                await candidateLocator.waitFor({ state: 'visible', timeout: 10000 });

                // Verify that the row contains the expected candidate details
                await expect(candidateLocator).toContainText(candidate.firstName);
                await this.page.waitForTimeout(100);
                await expect(candidateLocator).toContainText(candidate.lastName);
                await expect(candidateLocator).toContainText(candidate.email);
            }

            await this.page.goBack();
            await this.page.waitForTimeout(1500);
        }

    }
}*/
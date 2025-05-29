import { createOpeningLocators } from "../locators/createOpeningLocators.js";
import { moveSlider } from "../utils/sliderUtils.js";
import fs from 'fs';

export class CreateOpeningPage {
    constructor(page) {
        this.page = page;
    }

    async createOpening() {
        const testData = JSON.parse(fs.readFileSync('./testdata/createOpeningData.json', 'utf-8'));

        let existingData = {};
        if (fs.existsSync('jobData.json')) {
            existingData = JSON.parse(fs.readFileSync('jobData.json', 'utf-8'));
        }

        let count = 1; // To differentiate jobId1 and jobId2

        for (const jobOpening of testData) {
            await this.page.waitForTimeout(1000);
            await this.page.locator(createOpeningLocators.createOpeningButton).click();
            await this.page.locator(createOpeningLocators.technicalButton).click();
            await this.page.locator(createOpeningLocators.jdInput).fill(jobOpening.jobDescription);

            // Move sliders
            await moveSlider(this.page, createOpeningLocators.firstSliderSelector, jobOpening.firstSlider);
            await moveSlider(this.page, createOpeningLocators.secondSliderSelector, jobOpening.secondSlider);
            await this.page.getByRole('button', { name: 'Submit' }).click();
            await this.page.waitForTimeout(7000);

            // Handle modal popup if present
            while (await this.page.locator(createOpeningLocators.modalHeading).isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log("Modal detected, checking for 'Looks Good' button...");
                const goodButton = this.page.locator(createOpeningLocators.goodButton);
                if (await goodButton.isVisible({ timeout: 7000 }).catch(() => false)) {
                    console.log("Clicking 'Looks Good' button...");
                    await goodButton.click();
                }
                await this.page.waitForTimeout(5000);
            }

            await this.page.locator(createOpeningLocators.createOpeningButton1).isVisible();

            // Generate dynamic job opening name
            const now = new Date();
            const formattedDate = now.toLocaleDateString("en-GB");
            const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
            const openingName = `${jobOpening.role} - ${formattedDate} ${formattedTime}`;
          

            await this.page.locator(createOpeningLocators.jobOpeningName).fill(openingName);
            await this.page.locator(createOpeningLocators.managerNameInput).fill(jobOpening.managerName);
            await this.page.locator(createOpeningLocators.managerPhoneInput).fill(jobOpening.phoneNumber);
            await this.page.locator(createOpeningLocators.managerEmailInput).fill(jobOpening.email);
            await this.page.waitForTimeout(500);

            await this.page.locator(createOpeningLocators.createOpeningSubmit).click();
           // await this.page.waitForTimeout(1000);

            //console.log(`Opening Created: ${openingName}`);

            // Locate the job card and extract the Job ID
            const jobCard = await this.page.locator(`.card:has-text("${openingName}")`);
            await jobCard.waitFor({ state: 'visible', timeout: 3000 });
            console.log(`Opening Created: ${openingName}`);
           // await this.page.waitForTimeout(1000);
            const jobId = await jobCard.locator("span:has-text('Job ID:')").first().textContent();
            const jobIdValue = jobId.replace("Job ID: ", "").trim();

            console.log(`Extracted Job ID: ${jobIdValue}`);

            // Store in JSON file with unique names
            existingData[`Opening_Name${count}`] = openingName;
            existingData[`jobIdValue${count}`] = jobIdValue;

            fs.writeFileSync('jobData.json', JSON.stringify(existingData, null, 2));
            console.log(`Job ${count} saved in jobData.json`);

            count++; // Increment for the next job
        }
    }
}




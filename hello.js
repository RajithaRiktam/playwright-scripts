// hello.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');

  console.log("Hello from Playwright!");

  // Uncomment below to simulate failure
  // process.exit(1);

  await browser.close();
})();

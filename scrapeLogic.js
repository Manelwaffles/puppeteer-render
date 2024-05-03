const puppeteer = require('puppeteer');

async function scrapeJobDetails(links) {
  const browser = await puppeteer.launch({ headless: false }); // Set to false to watch the browser actions
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#username', { visible: true });
  await page.waitForSelector('#password', { visible: true });

  // Enter credentials and login (replace 'your-email@example.com' and 'yourpassword' with your actual credentials)
  await page.type('#username', 'your-email@example.com');
  await page.type('#password', 'yourpassword');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Navigate and scrape each job link
  for (const link of links) {
    try {
      await page.goto(link, { waitUntil: 'networkidle2' });

      // Check for the presence of the search box input to handle the specific error
      const searchInputExists = await page.$('.search-box__input');
      if (!searchInputExists) {
        console.error('Search box input not found, taking a screenshot for debugging...');
        await page.screenshot({ path: `debug-${Date.now()}.png` });
        continue; // Skip this link and go to the next one
      }

      // Wait for the specific element to be sure it's loaded
      await page.waitForSelector('.jobs-description__content .jobs-box__html-content .mt4', { visible: true });

      // Extract job details
      const jobDetails = await page.evaluate(() => {
        const element = document.querySelector('.jobs-description__content .jobs-box__html-content .mt4');
        return element ? element.innerHTML.trim() : 'No job details found';
      });

      console.log(`Job Details for ${link}: ${jobDetails}`);
    } catch (error) {
      console.error(`Error processing ${link}: ${error}`);
    }
  }

  // Close the browser when all links have been processed
  await browser.close();
}

const jobLinks = [
  "https://www.linkedin.com/comm/jobs/view/3915313940",
  "https://www.linkedin.com/comm/jobs/view/3907648468",
  // Add more links as needed
];

scrapeJobDetails(jobLinks); // Call the function with the job links

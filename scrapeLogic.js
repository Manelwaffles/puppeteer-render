edit
const puppeteer = require('puppeteer');

async function scrapeJobDetails(links) {
  const browser = await puppeteer.launch({ headless: false }); // Launch a new browser session with headless mode off for debugging
  const page = await browser.newPage();

  // Navigate to the LinkedIn login page
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });

  // Wait for the username and password fields to be visible
  await page.waitForSelector('#username', { visible: true });
  await page.waitForSelector('#password', { visible: true });

  // Type in credentials and submit the form
  await page.type('#username', 'info@manelwaffles.com'); // Replace with your actual username
  await page.type('#password', 'JlasdhnGWuhfnas$%$'); // Ensure this is your correct password
  await page.click('button[type="submit"]');

  // Wait for navigation after login
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
  } catch (error) {
    console.error('Login failed or navigation timeout:', error);
    return; // Stop execution if login fails
  }

  // Process each job link
  for (const link of links) {
    try {
      await page.goto(link, { waitUntil: 'networkidle2' });

      // Take a screenshot for debugging purposes
      await page.screenshot({ path: `debug-${link.slice(-10)}.png` });

      // Extract job details
      const jobDetails = await page.evaluate(() => {
        const element = document.querySelector('.jobs-description__content .jobs-box__html-content .mt4');
        return element ? element.innerHTML.trim() : 'No job details found';
      });

      console.log(`Job Details for ${link}: ${jobDetails}`);
    } catch (error) {
      console.error(`Error processing ${link}:`, error);
    }
  }

  // Close the browser session
  await browser.close();
}

const jobLinks = [
  "https://www.linkedin.com/comm/jobs/view/3915313940",
  "https://www.linkedin.com/comm/jobs/view/3907648468",
  // Add more links as needed
];

scrapeJobDetails(jobLinks); // Execute the function with the job links

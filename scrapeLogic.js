const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000; // Port number for the Express server

// Asynchronously fetch job links from LinkedIn
async function scrapeLinks() {
  const browser = await puppeteer.launch({ headless: true }); // Ensure Puppeteer runs in headless mode
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/jobs/search/?keywords=job_title', { waitUntil: 'networkidle0' });

  // Check if the selector exists on the page
  const isElementVisible = await page.evaluate(selector => {
    const e = document.querySelector(selector);
    return !!e; // Directly return the boolean check
  }, 'a.job-card-container__link.job-card-list__title.job-card-list__title--link');

  if (!isElementVisible) {
    console.error('Selector not found');
    await browser.close();
    return []; // Return an empty array if the selector is not found
  }

  // Wait for the job links to become visible or available
  try {
    await page.waitForSelector('a.job-card-container__link.job-card-list__title.job-card-list__title--link', { timeout: 60000 });
  } catch (error) {
    console.error('Error waiting for element:', error);
    await browser.close();
    return []; // Return an empty array in case of an error
  }

  // Retrieve job URLs from the page
  const jobUrls = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a.job-card-container__link.job-card-list__title.job-card-list__title--link'));
    return links.map(link => link.href); // Map each link element to its href attribute
  });

  await browser.close();
  return jobUrls;
}

// Route to trigger the scraping
app.get('/scrape', async (req, res) => {
  try {
    const urls = await scrapeLinks(); // Call the scrapeLinks function and wait for its result
    res.json({ success: true, urls }); // Send the fetched URLs as a JSON response
  } catch (error) {
    res.status(500).json({ success: false, message: error.toString() }); // Handle errors appropriately
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


const puppeteer = require('puppeteer');

async function scrapeLinks() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Ensures the page is fully loaded by waiting for network to be idle
  await page.goto('https://www.linkedin.com/jobs/search/?keywords=job_title', { waitUntil: 'networkidle0' });

  // Check if the selector exists
  const isElementVisible = await page.evaluate(selector => {
    const e = document.querySelector(selector);
    return e ? true : false;
  }, 'a.job-card-container__link.job-card-list__title.job-card-list__title--link');

  if (!isElementVisible) {
    console.error('Selector not found');
    await browser.close();
    return []; // Return an empty array if the selector does not exist
  }

  // Wait for the necessary elements to be loaded with increased timeout
  try {
    await page.waitForSelector('a.job-card-container__link.job-card-list__title.job-card-list__title--link', { timeout: 60000 });
  } catch (error) {
    console.error('Error waiting for element:', error);
    await browser.close();
    return []; // Return an empty array in case of timeout
  }

  // Execute code in the page context to retrieve URLs
  const jobUrls = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a.job-card-container__link.job-card-list__title.job-card-list__title--link'));
    return links.map(link => link.href);
  });

  await browser.close();
  return jobUrls;
}

// Assuming you would adapt this into an n8n function that can handle async code
return scrapeLinks();

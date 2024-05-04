const puppeteer = require('puppeteer');

async function scrapeLinks() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/jobs/search/?keywords=job_title');

  // Wait for the necessary elements to be loaded
  await page.waitForSelector('a.job-card-container__link.job-card-list__title.job-card-list__title--link');

  // Execute code in the page context
  const jobUrls = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a.job-card-container__link.job-card-list__title.job-card-list__title--link'));
    return links.map(link => link.href);
  });

  await browser.close();
  return jobUrls;
}

// Assuming you would adapt this into an n8n function that can handle async code
return scrapeLinks();

const puppeteer = require('puppeteer');

async function scrapeJobDetails(links) {
  const browser = await puppeteer.launch({ headless: false }); // Keep headless false for debugging
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#username', { visible: true });
  await page.waitForSelector('#password', { visible: true });

  // Enter credentials and login
  await page.type('#username', 'info@manelwaffles.com');
  await page.type('#password', 'JlasdhnGWuhfnas$%$);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Debug: Take a screenshot after login
  await page.screenshot({ path: 'after-login.png' });

  // Debug: Print HTML to console
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log(bodyHTML);

  for (const link of links) {
    try {
      await page.goto(link, { waitUntil: 'networkidle2' });

      // Debug: Take a screenshot on each job page
      await page.screenshot({ path: `debug-${link.slice(-10)}.png` });

      const searchInput = await page.$('.search-box__input');
      if (!searchInput) {
        console.error('Search box input not found, skipping...');
        continue;
      }

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

  await browser.close();
}

const jobLinks = [
  "https://www.linkedin.com/comm/jobs/view/3915313940",
  "https://www.linkedin.com/comm/jobs/view/3907648468",
];

scrapeJobDetails(jobLinks);

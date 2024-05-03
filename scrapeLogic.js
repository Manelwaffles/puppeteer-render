const puppeteer = require('puppeteer');

async function scrapeJobDetails(links) {
  const browser = await puppeteer.launch({ headless: false }); // Launch a new browser session
  const page = await browser.newPage(); // Open a new page

  // Navigate to LinkedIn login page
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });

  // Enter credentials and login
  await page.waitForSelector('#username', { visible: true });
  await page.waitForSelector('#password', { visible: true });
  await page.type('#username', 'your-email@example.com'); // Replace with your actual username
  await page.type('#password', 'yourpassword'); // Replace with your actual password
  await page.click('button[type="submit"]'); // Click the login button
  await page.waitForNavigation({ waitUntil: 'networkidle0' }); // Wait for page load after login

  // Scrape job details
  for (const link of links) {
    await page.goto(link, { waitUntil: 'networkidle2' }); // Navigate to the job link
    
    // Extract job details from the specific div
    const jobDetails = await page.evaluate(() => {
      const element = document.querySelector('.jobs-description__content .jobs-box__html-content .mt4');
      return element ? element.innerHTML.trim() : 'No job details found'; // Get the inner HTML of the element
    });
    
    console.log(`Job Details for ${link}: ${jobDetails}`); // Output the job details
  }

  // Close the browser session
  await browser.close();
}

const jobLinks = [
  "https://www.linkedin.com/comm/jobs/view/3915313940",
  "https://www.linkedin.com/comm/jobs/view/3907648468",
  // add more links as needed
];

scrapeJobDetails(jobLinks); // Call the function with the job links

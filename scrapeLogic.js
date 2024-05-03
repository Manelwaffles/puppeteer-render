const puppeteer = require('puppeteer');

// Sample job links array
const jobLinks = [
  "https://www.linkedin.com/comm/jobs/view/3915313940",
  "https://www.linkedin.com/comm/jobs/view/3907648468",
  "https://www.linkedin.com/comm/jobs/view/3912193180",
  "https://www.linkedin.com/comm/jobs/view/3912581553",
  "https://www.linkedin.com/comm/jobs/view/3909463228",
  "https://www.linkedin.com/comm/jobs/view/3911756252"
];

async function scrapeJobDetails(links) {
  const browser = await puppeteer.launch(); // Launch a new browser session
  const page = await browser.newPage(); // Open a new page

  for (const link of links) {
    await page.goto(link, { waitUntil: 'networkidle2' }); // Navigate to the job link
    
    // Extract job details
    const jobDetails = await page.evaluate(() => {
      const element = document.querySelector('.jobs-box__html-content.jobs-description-content__text.t-14.t-normal.jobs-description-content__text--stretch');
      return element ? element.innerText.trim() : 'No job details found'; // Get the text content of the element
    });
    
    console.log(`Job Details for ${link}: ${jobDetails}`); // Output the job details
  }

  await browser.close(); // Close the browser session
}

scrapeJobDetails(jobLinks); // Call the function with the job links

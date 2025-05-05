import { Router } from 'express';
import puppeteer from 'puppeteer';
import ai from '../util/ai.js';
import 'dotenv/config';



const router = new Router();

router.post('/api/scrape', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { url } = req.body;

  await page.goto(url);

  const cookieBtnSelector = 'button'; // Update with the proper selector, e.g. a button with specific text or class
  try {
    await page.waitForSelector(cookieBtnSelector, { timeout: 5000 });
    // Optionally, check the innerText of the button to confirm it's the cookie consent button
    const btnText = await page.$eval(cookieBtnSelector, el => el.innerText);
    if (btnText.includes('Afvis') || btnText.includes('Decline')) {
      await page.click(cookieBtnSelector);
    }
  } catch (err) {
    console.log("Cookie consent not found; continuing...");
  }

  // Close 'create an account' popup if it appears
  try {
    await page.waitForSelector('svg[aria-label="Close"]', { timeout: 5000 });
  } catch (err) {
    console.log("Create an account popup not found; continuing...");
  }

  // take screenshot
  // for debugging
  // await page.screenshot({ path: 'screenshot.png' });

  // find h1 elements
  const h1Elements = await page.$$('h1');
  const h1Texts = await Promise.all(
    h1Elements.map(async (element) => {
      const text = await element.evaluate((el) => el.innerText);
      return text;
    })
  );
  const aiResponse = await ai.generateRecipe(h1Texts.join('\n'));
  console.log("ai output: ", aiResponse.output_text);
  return res.status(200).json(aiResponse.output_text);  
});



export default router;
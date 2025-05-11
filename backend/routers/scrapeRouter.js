import { Router } from 'express';
import puppeteer from 'puppeteer';
import ai from '../service/aiService.js';
import macroService from '../service/macroService.js';
import 'dotenv/config';
import b2 from '../service/b2FileUploadService.js';


const router = new Router();

router.post('/api/scrape', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { url } = req.body;

  await page.goto(url);

  // // Close 'create an account' popup if it appears
  try {
    await page.waitForSelector('svg[aria-label="Close"]', { timeout: 1000 });
    console.log("Create an account popup found, closing...");
    await page.click('svg[aria-label="Close"]');
  } catch (err) {
    console.log("Create an account popup not found; continuing...");
  }

  // take screenshot for debugging
  // await page.screenshot({ path: 'screenshot.png' });

  // find h1 elements
  const h1Elements = await page.$$('h1');
  const h1Texts = await Promise.all(
    h1Elements.map(async (element) => {
      const text = await element.evaluate((el) => el.innerText);
      return text;
    })
  );

  await browser.close();

  console.log("input: ", h1Texts);
  const aiResponse = await ai.generateRecipe(h1Texts.join('\n'));
  
  try {
    const data = JSON.parse(aiResponse);
    console.log(data);

    // get temp image url from AI
    const imageUrl = await ai.generateRecipeImage(data.name);

    // handle upload to B2
    let b2ImagePath = await b2.handleB2Upload(imageUrl);

    // get macros for ingredients
    let ingredientsWithMacros = await macroService.getMacros(data.ingredientsInGrams);

    data.ingredientsWithMacros = ingredientsWithMacros;
    data.image = b2ImagePath;
    return res.status(200).json({ data });
  } catch(err) {
    console.error("Error parsing AI response JSON", err);
    return res.status(500).json({ message: "Invalid JSON format from AI output" });
  }
});



export default router;
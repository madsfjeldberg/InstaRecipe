import { Router } from 'express';
import puppeteer from 'puppeteer';
import ai from '../util/ai.js';
import macroAPI from '../util/macroAPI.js';
import 'dotenv/config';



const router = new Router();

router.post('/api/scrape', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { url } = req.body;

  await page.goto(url);

  // find button that says 'Afvis' or 'Decline'
  // const cookieBtnSelector = 'button';
  // try {
  //   await page.waitForSelector(cookieBtnSelector, { timeout: 3000 });
  //   // Optionally, check the innerText of the button to confirm it's the cookie consent button
  //   const btnText = await page.$eval(cookieBtnSelector, el => el.innerText);
  //   console.log("Cookie consent button text: ", btnText);
  //   if (btnText.includes('Afvis') || btnText.includes('Decline')) {
  //     console.log("Cookie consent button found and clicked");
  //     await page.click(cookieBtnSelector);
  //   }
  // } catch (err) {
  //   console.log("Cookie consent not found; continuing...");
  // }

  // // Close 'create an account' popup if it appears
  try {
    await page.waitForSelector('svg[aria-label="Close"]', { timeout: 1000 });
    console.log("Create an account popup found, closing...");
    await page.click('svg[aria-label="Close"]');
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
  console.log("input: ", h1Texts);
  const aiResponse = await ai.generateRecipe(h1Texts.join('\n'));
  console.log("ai output: ", aiResponse.output_text);
  try {
    const jsonData = JSON.parse(aiResponse.output_text);

    console.log("ingredients: ", jsonData.ingredients);
    // get macros for ingredients
    let ingredientsWithMacros = await macroAPI.getMacros(jsonData.ingredientsInGrams);
    console.log("ingredients with macros: ", ingredientsWithMacros);
    // calculate total macros
    const totalMacros = macroAPI.calculateTotalMacros(ingredientsWithMacros);
    console.log("total macros: ", totalMacros);
    // add macros to jsonData
    jsonData.macros = totalMacros;
    jsonData.ingredientsWithMacros = ingredientsWithMacros;
    return res.status(200).json(jsonData);
  } catch(err) {
    console.error("Error parsing AI response JSON", err);
    return res.status(500).json({ message: "Invalid JSON format from AI output" });
  }
});



export default router;
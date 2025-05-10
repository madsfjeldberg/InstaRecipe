import { Router } from 'express';
import puppeteer from 'puppeteer';
import ai from '../service/aiService.js';
import macroService from '../service/macroService.js';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import path from 'path';
import 'dotenv/config';
import { cleanupTempFile, downloadImage, uploadImage } from '../service/b2FileUploadService.js';


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

  await browser.close();

  console.log("input: ", h1Texts);
  const aiResponse = await ai.generateRecipe(h1Texts.join('\n'));
  console.log("ai output: ", aiResponse.output_text);
  try {
    const jsonData = JSON.parse(aiResponse.output_text);

    const imageUrl = await ai.generateRecipeImage(jsonData.name);

    const tempDir = path.join(os.tmpdir(), 'images');
    const fileName = `${uuidv4()}.jpg`;
    const tempFilePath = path.join(tempDir, fileName);

    await downloadImage(imageUrl, tempFilePath);
    console.log("Image downloaded to: ", tempFilePath);
    // Upload the image to Backblaze B2
    const uploadResponse = await uploadImage(tempFilePath);
    console.log("Image uploaded to Backblaze B2: ", uploadResponse);

    // Clean up the temporary file
    await cleanupTempFile(tempFilePath);

    // Get the URL of the uploaded image
    const imageUrlFromB2 = uploadResponse;
    console.log("Image URL from Backblaze B2: ", imageUrlFromB2);

    console.log("ingredients: ", jsonData.ingredients);
    // get macros for ingredients
    let ingredientsWithMacros = await macroService.getMacros(jsonData.ingredientsInGrams);
    console.log("ingredients with macros: ", ingredientsWithMacros);
    // calculate total macros
    const totalMacros = macroService.calculateTotalMacros(ingredientsWithMacros);
    console.log("total macros: ", totalMacros);
    // add macros to jsonData
    jsonData.macros = totalMacros;
    jsonData.ingredientsWithMacros = ingredientsWithMacros;
    jsonData.image = imageUrlFromB2;
    console.log(jsonData.image);
    return res.status(200).json({ data: jsonData });
  } catch(err) {
    console.error("Error parsing AI response JSON", err);
    return res.status(500).json({ message: "Invalid JSON format from AI output" });
  }
});



export default router;
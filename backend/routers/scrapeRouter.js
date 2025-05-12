import { Router } from 'express';
import puppeteer from 'puppeteer';
import ai from '../service/aiService.js';
import macroService from '../service/macroService.js';
import 'dotenv/config';
import b2 from '../service/b2FileUploadService.js';

const router = new Router();

router.post('/api/scrape', async (req, res) => {
  let browser;
  try {
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ],
      timeout: 5000 // 5 second timeout
    });

    const page = await browser.newPage();
    
    // Set navigation timeout
    page.setDefaultNavigationTimeout(5000);

    const { url } = req.body;
    
    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ message: "Invalid URL provided" });
    }
    
    // Wait until network is idle to ensure page is fully loaded
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    let scrapedData;

    if (url.includes('valdemarsro')) {
      console.log("Detected valdemarsro URL");
      await page.waitForSelector('div.post-recipe', { timeout: 2000 });
      const recipeElement = await page.$('div.post-recipe');

      if (recipeElement) { 
        scrapedData = await page.evaluate(el => el.innerText, recipeElement);
        console.log("Extracted recipe text:", scrapedData);
      }

      if (!scrapedData) {
        return res.status(404).json({ message: "No recipe content found on page" });
      }

    } else if (url.includes('instagram')) {
      console.log("Detected Instagram URL");
       // Wait for h1 elements to be present with timeout
    await page.waitForSelector('h1', { timeout: 5000 }).catch(() => {
      console.log('No h1 elements found or timeout waiting for them');
    });
    
    // Find h1 elements
    const h1Elements = await page.$$('h1');
    console.log(`Found ${h1Elements.length} h1 elements`);
    
    // Extract text with better error handling
    scrapedData = [];
    for (const element of h1Elements) {
      try {
        const text = await element.evaluate(el => el.innerText);
        if (text && text.trim()) {
          scrapedData.push(text.trim());
        }
      } catch (error) {
        console.error("Error extracting text from h1:", error);
      }
    }
    scrapedData = scrapedData.join('\n');
    console.log("Extracted data:", scrapedData);
    
    if (scrapedData.length === 0) {
      return res.status(404).json({ message: "No h1 content found on page" });
      }
    }

    await browser.close();
    browser = null;
        
    const aiResponse = await ai.generateRecipe(scrapedData);

    try {
      const data = JSON.parse(aiResponse);
      console.log("Parsed AI response:", data);
      
      // Get temp image url from AI
      const imageUrl = await ai.generateRecipeImage(data.name);
      
      // Handle upload to B2
      let b2ImagePath = await b2.handleB2Upload(imageUrl);
      
      // Get macros for ingredients
      let ingredientsWithMacros = await macroService.getMacros(data.ingredientsInGrams);
      
      data.ingredientsWithMacros = ingredientsWithMacros;
      data.image = b2ImagePath;
      
      return res.status(200).json({ data });
    } catch(err) {
      console.error("Error parsing AI response JSON:", err);
      return res.status(500).json({ message: "Invalid JSON format from AI output", error: err.message });
    }
  } catch (error) {
    console.error("Error in scrape endpoint:", error);
    return res.status(500).json({ message: "Error processing request", error: error.message });
  } finally {
    // Ensure we always close the browser
    if (browser) {
      await browser.close();
    }
  }
});

export default router;
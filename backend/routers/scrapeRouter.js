import 'dotenv/config';

import { Router } from 'express';

import ai from '../service/aiService.js';
import b2 from '../service/b2FileUploadService.js';
import scrapeService from '../service/scrapeService.js';


const router = new Router();

router.post("/api/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith("http")) {
    return res.status(400).send({ errorMessage: "Invalid URL provided" });
  }
  
  try {
    // Generate recipe using the scraped data
    const scrapedData = await scrapeService.scrapeSite(url);
    const generatedRecipe = await generateRecipe(scrapedData);
    return res.send({ data: generatedRecipe });

  } catch (error) {
    console.error("Error generating recipe in scrape router:", error);
    return res.status(500).send({ errorMessage: "Server error, please try again later." });
  }
});



const generateRecipe = async (scrapedData) => {
  try {
    const generatedRecipe = await ai.generateRecipe(scrapedData);
    // Get temp image url from AI
    const imageUrl = await ai.generateRecipeImage(generatedRecipe.name);

    // Handle upload to B2
    let b2ImagePath = await b2.handleB2Upload(imageUrl);

    generatedRecipe.image = b2ImagePath;
    return generatedRecipe;

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe");
  }
}



export default router;

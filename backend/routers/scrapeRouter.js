import "dotenv/config";

import { Router } from "express";
import puppeteer from "puppeteer";

import ai from "../service/aiService.js";
import b2 from "../service/b2FileUploadService.js";



const router = new Router();

router.post("/api/scrape", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
      timeout: 5000, // 5 second timeout
    });

    const page = await browser.newPage();

    // Set navigation timeout
    page.setDefaultNavigationTimeout(5000);

    const { url } = req.body;

    if (!url || !url.startsWith("http")) {
      return res.status(400).send({ errorMessage: "Invalid URL provided" });
    }

    // Wait until network is idle to ensure page is fully loaded
    await page.goto(url, { waitUntil: "networkidle2" });

    let scrapedData;

    if (url.includes("valdemarsro")) {
      console.log("Detected valdemarsro URL");
      await page.waitForSelector("div.post-recipe", { timeout: 2000 });
      const recipeElement = await page.$("div.post-recipe");

      if (recipeElement) {
        scrapedData = await page.evaluate((el) => el.innerText, recipeElement);
        console.log("Extracted recipe text:", scrapedData);
      }

      if (!scrapedData) {
        return res.status(404).send({ errorMessage: "No recipe content found on page" });
      }

    } else if (url.includes("instagram")) {
      console.log("Detected Instagram URL");
      // Wait for the specific span to be present
      const spanSelector = "span.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.xt0psk2.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj";
      await page.waitForSelector(spanSelector, { timeout: 5000 }).catch(() => {
        console.log("No matching span elements found or timeout waiting for them");
      });

      // Find all matching span elements
      const spanElements = await page.$$(spanSelector);
      console.log(`Found ${spanElements.length} matching span elements`);

      // Extract text with better error handling
      scrapedData = [];
      for (const element of spanElements) {
        try {
          const text = await element.evaluate((el) => el.innerText);
          if (text && text.trim()) {
            scrapedData.push(text.trim());
          }
        } catch (error) {
          console.error("Error extracting text from span:", error);
        }
      }
      scrapedData = scrapedData.join("\n");
      console.log("Extracted data:", scrapedData);

      if (scrapedData.length === 0) {
        return res.status(404).send({ errorMessage: "No matching span content found on page" });
      }

    } else {
      console.log("No specific URL detected");
      return res.status(400).send({ errorMessage: "Invalid URL" });
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

      data.image = b2ImagePath;

      return res.send({ data });

    } catch (err) {
      console.error("Error parsing AI response JSON:", err);
      return res.status(500).send({errorMessage: "Server error, please try again later." });
    }

  } catch (error) {
    console.error("Error in scrape endpoint:", error);
    return res.status(500).send({ errorMessage: "Error processing request" });
    
  } finally {
    // Ensure we always close the browser
    if (browser) {
      await browser.close();
    }
  }
});

export default router;

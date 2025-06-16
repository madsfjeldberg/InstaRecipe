import puppeteer from 'puppeteer';

const scrapeSite = async (url) => {
    let browser = null;

    try {
        browser = await launchPuppeteer();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(5000); // Set navigation timeout to 5 seconds

        // Wait until network is idle to ensure page is fully loaded
        await page.goto(url, { waitUntil: "networkidle2" });

        // Scrape data based on the URL
        let scrapedData;
        if (url.includes("valdemarsro")) {
            scrapedData = await scrapeValdemarsro(page);

        } else if (url.includes("instagram")) {
            scrapedData = await scrapeInstagram(page);

        } else {
            console.log("No specific URL detected");
            throw new Error("Provided either invalid URL or unsupported URL");
        }

        await browser.close();
        browser = null;

        return scrapedData;

    } catch (error) {
        console.error("Error in scrape endpoint:", error);

        if (browser) {
            await browser.close();
        }

        throw error;
    }
}



const launchPuppeteer = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--window-size=1280,800"
            ]
        });
        return browser;

    } catch (error) {
        console.error("Error launching Puppeteer:", error);
        throw error;
    }
};




const scrapeValdemarsro = async (page) => {
    console.log("Detected valdemarsro URL");
    try {

        await page.waitForSelector("div.post-recipe", { timeout: 2000 });
        const recipeElement = await page.$("div.post-recipe");

        if (!recipeElement) {
            throw new Error("No recipe content found on page");
        }

        const scrapedRecipeData = await page.evaluate((el) => el.innerText, recipeElement);
        return scrapedRecipeData;

    } catch (error) {
        console.error("Error scraping valdemarsro:", error);
        throw error;
    }
}



const scrapeInstagram = async (page) => {
    console.log("Detected Instagram URL");
    // Wait for the specific span to be present
    // const spanSelector = "span.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.xt0psk2.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj";
    // await page.waitForSelector(spanSelector, { timeout: 5000 }).catch(() => {
    //     console.error("No matching span elements found or timeout waiting for them");
    // });

    const additionalSpanSelector = "span.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x1ji0vk5.x18bv5gf.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.xpm28yp.x8viiok.x1o7cslx";
    await page.waitForSelector(additionalSpanSelector, { timeout: 5000 }).catch(() => {
      console.error("No additional matching span elements found or timeout waiting for them");
    });

    // Find all matching span elements
    const spanElements = await page.$$(additionalSpanSelector);
    console.log(`Found ${spanElements.length} matching span elements`);

    // Extract text with better error handling
    let scrapedRecipeData = [];
    for (const element of spanElements) {
        try {
            const text = await element.evaluate((el) => el.innerText);
            if (text && text.trim()) {
                scrapedRecipeData.push(text.trim());
            }
        } catch (error) {
            console.error("Error extracting text from span:", error);
            throw error;
        }
    }
    scrapedRecipeData = scrapedRecipeData.join("\n");
    console.log("Extracted data:", scrapedRecipeData);

    if (scrapedRecipeData.length === 0) {
        throw new Error("No matching span content found on page");
    }

    return scrapedRecipeData;
}


export default {
    scrapeSite
}

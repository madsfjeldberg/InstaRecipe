import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const instructions = `
You are an expert recipe data extractor.
Given a raw block of recipe text, your job is to accurately extract and format it into a clean JSON object.
Structure:
{
  "name": "",
  "description": "",
  "ingredients": [],
  "ingredientsInGrams": "",
  "instructions": "",
  "servings": "",
  "category": "",
  "tags": []
}
Extraction rules:
Name: Use the title, normally at the beginning.

Description: Write a short 1 to 2 sentence summary describing the dish and its appeal, inferring from context,
or from the given description in the text.

Ingredients: Parse all listed ingredients into an array.
IMPORTANT: Add measurements and amounts before each ingredient.
Prefer using the most common measurement units (e.g., "1 cup", "2 g", "2.4 L", "12 ml", "84 kg", "3 large eggs").
If no measurements are given, use common sense to estimate reasonable amounts based on the ingredient type.
For example, "2 cups of flour", "1 tablespoon of sugar", "3 large eggs".
If you encounter ingredients with measuerment units like 1/2, 1/4, etc., convert them to decimal format (e.g., 0.5, 0.25).
If the ingredient is a single item without a measurement (e.g., "onion"), assume a common size (e.g., "1 medium onion").

IngredientsInGrams: This list will be used for nutritional calculations.
Convert the ingredients to grams where applicable.
Do not include items with no nutritional value, such as "salt", "pepper", "water", "1 pinch red pepper".
If the ingredient is not easily convertible (e.g., "1 cup of flour"), use a common conversion (e.g., 1 cup of flour = 120 grams).
If the ingredient is a liquid it should still be in grams.
IMPORTANT: All measurements MUST be in grams, and should be separated by commas.
example: '200g onion, 100g carrot'

Instructions:
If instructions are missing, generate plausible cooking steps based on common methods and the ingredients.
Write clear, numbered, concise steps.
DO NOT make this an array. it should just be a string.

Servings:
If servings are missing choose the appropiate servings given the amount of ingredients used.

Category: This should be one of the following: Breakfast, Lunch, Dinner, Dessert, Snack, Beverage.

Tags:
Choose appropriate tags for the recipe from the following list:
Vegan, Vegetarian, Gluten-Free, Dairy-Free, Keto, Paleo, Low-Carb, High-Protein.
Choose at most 3 tags. 

Special notes:
Ignore promotions (e.g., cookbook ads, links, social media plugs).
Always return valid and properly indented JSON.
Do not include any markdown formatting or code block markers (e.g. avoid wrapping your output with \`\`\`json and \`\`\`).
Do not include any '\n' characters in the JSON output.
If necessary, infer missing details sensibly based on the dish type and common cooking practices.
Recipe text must always be in English.
`

const generateRecipe = async (text) => {
  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "user", content: instructions },
      { role: "user", content: text }
    ],
    response_format: { type: "json_object"}
  });
  const data = JSON.parse(response.choices[0].message.content);
  return data
}

const generateRecipeImage = async (prompt) => {
  console.log("Generating image with prompt:", prompt);
  const response = await client.images.generate({
    model: "dall-e-2",
    prompt: prompt,
    n: 1,
    size: "1024x1024"
  });
  console.log("Generated image: ", response.data[0].url);
  return response.data[0].url;
}

const parseUserInputedIngredients = async (ingredients) => {

  const prompt = `
  You are an expert ingredient parser. Given a list of ingredients, your job is to format them into a clean JSON array.
  Your job is to normalize the ingredients, ensuring they are in a consistent format.
  It has to follow this format:
  'amount' 'unit' 'ingredient name' 'possible additional information'

  'amount' should be a number. It can be a decimal numbe, but not 1/2, 1/4, 1/3 etc.
  'unit' should be a common measurement unit (e.g., "tbsp", "tbs", "g", "kg", "L", "ml" etc.).

  Example: '1 cup all-purpose flour', '2 tbsp olive oil', '3 large eggs', '1 tsp salt', '412 g chicken', '500 g beff'.
  If the ingredient is a single item without a measurement (e.g., "onion"), assume a common size (e.g., "1 medium onion").

  If the ingredients list is malformed or contains errors, you should correct them to the best of your ability.

  Example input:
  212g minced beef, 32g carrots, 1 onion, 2 cloves garlic, 1 tbsp olive oil, 1 tsp salt, 1/2 tsp black pepper, 1/4 tsp paprika, 1/2 cup beef broth, 1/4 cup red wine, 1 bay leaf, 1 tsp dried thyme, 1 tsp dried oregano
  
  Example output:
  {
    result: [
      "212 g minced beef",
      "32 g carrots",
      "1 medium onion",
      "2 cloves garlic",
      "1 tbsp olive oil",
      "1 tsp salt",
      "0.5 tsp black pepper",
      "0.25 tsp paprika",
      "120 ml beef broth",
      "60 ml red wine",
      "1 bay leaf",
      "1 tsp dried thyme",
      "1 tsp dried oregano"
    ]
  }
  `

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "user", content: prompt },
      { role: "user", content: `Ingredients: ${ingredients}` }
    ],
    response_format: { type: "json_object" }
  });

  const data = JSON.parse(response.choices[0].message.content)
  return data.result;
}

const ai = {
  generateRecipe,
  generateRecipeImage,
  parseUserInputedIngredients
};

export default ai;

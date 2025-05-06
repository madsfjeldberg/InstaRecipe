import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const instructions = `
You are an expert recipe data extractor.
Given a raw block of recipe text, your job is to accurately extract and format it into a clean JSON object.
Structure:
{
  "name": "",
  "description": "",
  "ingredients": "",
  "ingredientsInGrams": "",
  "instructions": "",
  "category": "",
  "calories": 0
}
Extraction rules:
Name: Use the title, normally at the beginning.

Description: Write a short 1 to 2 sentence summary describing the dish and its appeal, inferring from context,
or from the given description in the text.

Ingredients: Parse all listed ingredients into a string. IMPORTANT: Add measurements and amounts before each ingredient.
If no measurements are given, use common sense to estimate reasonable amounts based on the ingredient type.
For example, "2 cups of flour", "1 tablespoon of sugar", "3 large eggs".
DO NOT include any non-ingredient text (e.g., "for garnish", "to taste", "diced", "minced").

IngredientsInGrams: This list will be used for nutritional calculations.
Convert the ingredients to grams where applicable.
Do not include items with no nutritional value, such as "salt", "pepper", "water", "1 pinch red pepper".
If the ingredient is not easily convertible (e.g., "1 cup of flour"), use a common conversion (e.g., 1 cup of flour = 120 grams).
If the ingredient is a liquid it should still be in grams.
IMPORTANT: All measurements MUST be in grams.

Instructions:
If instructions are missing, generate plausible cooking steps based on common methods and the ingredients.
Write clear, numbered, concise steps.

Category: This should be one of the following: Breakfast, Lunch, Dinner, Dessert, Snack, Beverage.

Calories: Extract the "Calories" value from macros if listed. Otherwise, make an informed guess based on the ingredients, and their amounts.

Special notes:
Ignore promotions (e.g., cookbook ads, links, social media plugs).
Always return valid and properly indented JSON.
Do not include any markdown formatting or code block markers (e.g. avoid wrapping your output with \`\`\`json and \`\`\`).
If necessary, infer missing details sensibly based on the dish type and common cooking practices.
`

const generateRecipe = async (text) => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: instructions,
    input: text
  });

  return response;
};

const ai = {
  generateRecipe
};

export default ai;
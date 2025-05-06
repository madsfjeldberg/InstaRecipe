import 'dotenv/config';

const apiKey = process.env.CALNINJA_API_KEY;
const apiUrl = 'https://api.calorieninjas.com/v1/nutrition?query=';

const getMacros = async (ingredients) => {
  const response = await fetch(apiUrl + ingredients, {
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch macros');
  }

  const data = await response.json();
  return stripItems(data.items);
}

const stripItems = (items) => {
  return items.map(item => ({
    name: item.name,
    serving_size: item.serving_size_g,
    calories: item.calories,
    protein: item.protein_g,
    fat: item.fat_total_g,
    carbs: item.carbohydrates_total_g,
  }));
};

const calculateTotalMacros = (items) => {
  const totalMacros = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };

  items.forEach(item => {
    totalMacros.calories += item.calories;
    totalMacros.protein += item.protein;
    totalMacros.fat += item.fat;
    totalMacros.carbs += item.carbs;
  });

  return totalMacros;
};

const macroAPI = {
  getMacros,
  calculateTotalMacros,
  stripItems,
};

export default macroAPI;
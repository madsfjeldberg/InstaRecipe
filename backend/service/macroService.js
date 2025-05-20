async function getMacros(ingredients) {
    try {
        const response = await fetch("https://api.calorieninjas.com/v1/nutrition?query=" + ingredients, {
            headers: {
                "X-Api-Key": process.env.CALORIE_NINJAS_API_KEY
            }
        });
        const data = await response.json();

        let macros;
        if (!data.items) {
            macros = [];
        } else {
            macros = data.items;
        }
        return stripItems(macros)

    } catch (error) {
        console.error(error)
    }
}

const stripItems = (items) => {
    return items.map(item => ({
        name: item.name,
        servingSize: item.serving_size_g,
        calories: item.calories,
        protein: item.protein_g,
        fat: item.fat_total_g,
        carbs: item.carbohydrates_total_g,
    }));
};

const macroService = {
    getMacros,
    stripItems
};

export default macroService;

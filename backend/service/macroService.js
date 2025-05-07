async function getMacros(ingredients) {
    try {
        const response = await fetch("https://api.calorieninjas.com/v1/nutrition?query=" + ingredients, {
            headers: {
                "X-Api-Key": process.env.CALORIE_NINJAS_API_KEY
            }
        });
        return await response.json();

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



export default { getMacros, stripItems, calculateTotalMacros };
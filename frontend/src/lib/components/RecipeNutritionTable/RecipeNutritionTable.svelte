<script>
    import { Zap, BicepsFlexed, CakeSlice, Wheat } from 'lucide-svelte';

    const { ingredientsList } = $props();
</script>

<div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
        <span
            class="flex items-center font-medium text-gray-700 dark:text-gray-300"
        >
            <Zap class="text-yellow-500 mr-2" />
            Calories
        </span>
        <span
            class="inline-block font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap"
            >{ingredientsList
                .reduce((sum, i) => sum + i.calories, 0)
                .toFixed() ?? 0} kcal</span
        >
    </div>
    <div class="flex items-center justify-between">
        <span
            class="flex items-center font-medium text-gray-700 dark:text-gray-300"
        >
            <BicepsFlexed class="text-blue-500 mr-2" />
            Protein
        </span>
        <span class="font-bold text-gray-900 dark:text-gray-100"
            >{ingredientsList
                .reduce((sum, i) => sum + i.protein, 0)
                .toFixed() ?? 0} g</span
        >
    </div>
    <div class="flex items-center justify-between">
        <span
            class="flex items-center font-medium text-gray-700 dark:text-gray-300"
        >
            <CakeSlice class="w-5 h-5 mr-2 text-pink-500" />
            Fat
        </span>
        <span class="font-bold text-gray-900 dark:text-gray-100"
            >{ingredientsList
                .reduce((sum, i) => sum + i.fat, 0)
                .toFixed() ?? 0} g</span
        >
    </div>
    <div class="flex items-center justify-between">
        <span
            class="flex items-center font-medium text-gray-700 dark:text-gray-300"
        >
            <Wheat class="w-5 h-5 mr-2 text-green-500" />
            Carbs
        </span>
        <span class="font-bold text-gray-900 dark:text-gray-100"
            >{ingredientsList
                .reduce((sum, i) => sum + i.carbs, 0)
                .toFixed() ?? 0} g</span
        >
    </div>
</div>

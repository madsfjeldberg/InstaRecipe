import 'dotenv/config'
import { Router } from 'express';
const router = Router();



router.get("/api/macros", async (req, res) => {
    const { ingredients } = req.query;
    if (!ingredients) {
        return res.status(400).send({ errorMessage: "Missing ingredients in request" })
    }

    try {
        const response = await fetch("https://api.calorieninjas.com/v1/nutrition?query=" + ingredients, {
            headers: {
                "X-Api-Key": process.env.CALORIE_NINJAS_API_KEY
            }
        });
        const result = await response.json();
        res.send({ data: result });

    } catch (error) {
        console.error(error)
        res.status(500).send({ errorMessage: "Something went wrong calling the Nutrition Ninjas API"})
    }
})



export default router;

import { Router } from 'express';

import emailService from '../util/email.js'

const router = Router();

router.post("/api/grocerylist", async (req, res) => {
    const { groceryList } = req.body;
    if(!groceryList) {
        return res.status(400).send({ errorMessage: "Technical error in frontend: Grocery list was not generated propaply neither included in the request" });
    }

    try {
        await emailService.sendGroceryListEmail(req.user.email, groceryList);
        res.send({ data: groceryList });
    } catch (error) {
        console.error("Failed to send grocery list email:", error);
        res.status(500).send({ errorMessage: "Failed to send grocery list email. Please try again later." });
    }
})

export default router;

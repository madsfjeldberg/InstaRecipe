import { Router } from 'express';
import emailService from '../service/emailService.js'

const router = Router();

router.post("/api/grocerylist", async (req, res) => {
    const { groceryList } = req.body;
    if(!groceryList) {
        return res.status(400).send({ errorMessage: "Technical error in frontend: Grocery list was not generated propaply neither included in the request" });
    }

    await emailService.sendGroceryListEmail(req.user.email, groceryList)
    res.send({ data: groceryList })
})

export default router;
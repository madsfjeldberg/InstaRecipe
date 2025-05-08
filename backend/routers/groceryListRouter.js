import { Router } from 'express';
import emailService from '../util/email.js'

const router = Router();

router.post("/api/grocerylist", async (req, res) => {
    const { groceryList } = req.body;
    if(!groceryList) {
        return res.status(400).send({ errorMessage: "Technical error: Grocery list was not generated propaply neither included in the request" });
    }

    const emailResponse = await emailService.sendGroceryListEmail(req.user.email, groceryList)
    console.log("IN GROCERY LIST ROUTER", emailResponse);
    res.send({ data: groceryList})
})

export default router;
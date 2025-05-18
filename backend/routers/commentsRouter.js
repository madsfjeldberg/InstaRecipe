import { Router } from "express";
import commentsRepository from "../repository/commentsRepository.js";

const router = Router();


router.get("/api/comments/:recipeId", async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const comments = await commentsRepository.getCommentsByRecipeId(recipeId);
        res.send({ data: comments });

    }catch(error) {
        res.status(500).send({ errorMessage: error.message})
    }
})



export default router;

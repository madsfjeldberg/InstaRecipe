import { Router } from 'express';

import commentsRepository from '../repository/commentsRepository.js';

const router = Router();


router.get("/api/comments/:recipeId", async (req, res) => {
    try {
        const comments = await commentsRepository.getCommentsByRecipeId(req.params.recipeId);
        res.send({ data: comments });

    }catch(error) {
        res.status(500).send({ errorMessage: "Could not retrieve comments on recipe with id: " + req.params.recipeId });
    }
})



export default router;

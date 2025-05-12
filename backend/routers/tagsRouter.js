import { Router } from "express";
import prisma from "../database/prismaClient.js";

const router = Router();

router.get("/api/tags", async(req, res) => {
    try {
        const recipeTags = await prisma.tag.findMany();
        res.send({ data: recipeTags});

    } catch (error) {
        console.error(error)
        res.status(500).send({ errorMessage: "Server error could not retrieve the recipe tags."})
    }
})

export default router;
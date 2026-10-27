import express from "express";
import { createCard, getCards } from "../controllers/cardController.js";

const router = express.Router();

router.post("/", createCard);
router.get("/", getCards)

export default router;
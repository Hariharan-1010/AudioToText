import express from 'express';
import { getAudioFile } from '../controllers/main.controller.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("<p>Les go, routes is handled</p>");
});

router.get("/atot", getAudioFile);


export default router;
import express from 'express';
import { exportCaption, getAudioFile } from '../controllers/main.controller.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("<p>Les go, routes is handled</p>");
});

router.get("/atot", getAudioFile);
router.post("/caption", exportCaption);


export default router;
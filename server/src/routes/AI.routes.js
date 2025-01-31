import { Router } from 'express';
import * as aiController from '../controllers/AI.controller.js';
const router = Router();

// router.get('/get-result', aiController.getResult)
router.route("/get-result").post(aiController.getResult);
export default router;


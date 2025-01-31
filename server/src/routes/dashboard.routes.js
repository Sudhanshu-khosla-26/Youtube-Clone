import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
    getChannelDetails
} from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats/@:username").get(getChannelStats);
router.route("/videos/@:username").get(getChannelVideos);
router.route("/@:username").get(getChannelDetails);

export default router;
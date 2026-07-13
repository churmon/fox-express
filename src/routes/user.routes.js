import { Router} from "express";
import { getProfile } from "../controllers/userController.js";

const router = Router();

// Example protected profile route
router.get("/profile", getProfile);

export default router;
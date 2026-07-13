import { Router} from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createPost, getPosts } from "../controllers/vehicleCheck2Controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Example protected profile route
router.post("/create",requireAuth, upload.array("images", 10), createPost);
router.get("/", getPosts);
// router.put("/:id", requireAuth, updateVehicleChecks);

export default router;
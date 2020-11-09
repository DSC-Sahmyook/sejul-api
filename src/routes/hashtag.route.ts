import { Router } from "express";
import { HashtagController } from "../controllers";
import { Auth } from "../middlewares";

const router = Router();

router.get("/", HashtagController.fetchAll);
router.post("/", Auth.isAuthenticated, HashtagController.create);

export default router;

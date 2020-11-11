import { Router } from "express";
import { SearchController } from "../controllers";

const router = Router();

router.get("/", SearchController.search);

export default router;

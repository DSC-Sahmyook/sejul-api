import { Router } from "express";
import { SearchController } from "../controllers";

const router = Router();

router.get("/article", SearchController.searchInArticle);
router.get("/summary", SearchController.searchInSummary);

export default router;

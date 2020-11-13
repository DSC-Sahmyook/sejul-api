import { Router } from "express";
import { ArticleController } from "../controllers";
import * as Middlewares from "../middlewares";

const router = Router();

router.get(
    "/",
    Middlewares.Auth.isAuthenticated,
    ArticleController.fetchArticles
);
router.post(
    "/",
    Middlewares.Auth.isAuthenticated,
    ArticleController.storeArticle
);
router.delete(
    "/",
    Middlewares.Auth.isAuthenticated,
    ArticleController.removeArticle
);

export default router;

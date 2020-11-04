import { Router } from "express";
import * as controllers from "../controllers/auth.controller";
import * as passport from "passport";

const router = Router();

router.get("/signin", (req, res) => {
    res.send("Hello");
});

router.post("/signin", controllers.signin);

router.post("/signup", controllers.signup);

export default router;

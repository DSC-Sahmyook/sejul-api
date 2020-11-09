import { Router } from "express";
import * as controllers from "../controllers/auth.controller";
import * as passport from "passport";

const router = Router();
// 로그인
router.post("/signin", controllers.signin);

// 회원 가입
router.post("/signup", controllers.signup);

export default router;

import { Router } from "express";
import * as controllers from "../controllers/auth.controller";
import * as passport from "passport";

import * as TestController from "../controllers/test.controller";

const router = Router();

router.get("/", TestController.fn1);

export default router;

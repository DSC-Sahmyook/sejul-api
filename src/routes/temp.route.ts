import { Router } from "express";
import * as tmpCtrls from "../controllers/temp.controller";
const router = Router();

router.get("/summary", tmpCtrls.fetchSummaries);

router.get("/hashtag", tmpCtrls.fetchHashtags);

export default router;

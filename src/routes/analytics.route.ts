import { Router } from "express";
import { AnalyticsController } from "../controllers";

const router = Router();

// 컨텐츠가 많은 해시태그 조회하기
router.get("/hashtag/hottest", AnalyticsController.fetchHottestHashtags);
// 최근에 작성된 글
router.get("/summary/recent", AnalyticsController.fetchRecentSummary);
// 활동이 많은 사용자
router.get("/user/featured", AnalyticsController.fetchActivityUser);

export default router;

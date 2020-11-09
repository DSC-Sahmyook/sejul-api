// 정보 가공 관련 라우팅
import { Router } from "express";
import { SummaryController } from "../controllers";
import { Auth } from "../middlewares";

const router = Router();

// 글 상세 조회하기
router.get("/:summary_id", SummaryController.fetchDetail);
// 글 상세 목록 조회하기
router.get("/", SummaryController.fetchAll);
// 글 생성하기
router.post("/", Auth.isAuthenticated, SummaryController.create);
// 글 수정하기
router.put("/:summary_id", Auth.isAuthenticated, SummaryController.update);
// 글 삭제하기
router.delete("/:summary_id", Auth.isAuthenticated, SummaryController.remove);

export default router;

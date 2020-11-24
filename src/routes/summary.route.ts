// 정보 가공 관련 라우팅
import { Router } from "express";
import { SummaryController } from "../controllers";
import { Auth } from "../middlewares";

const router = Router();

// #region GET METHODS

// 글 상세 목록 조회하기
router.get("/", SummaryController.fetchAll);

// 특정 유저 글 조회하기
router.get("/user/:username", SummaryController.fetchRelatedUser);

// 글 상세 조회하기
router.get("/:summary_id", SummaryController.fetchDetail);

// #endregion GET METHODS 끝

//#region POST METHODS

// 글 생성하기
router.post("/", Auth.isAuthenticated, SummaryController.create);

router.post(
    // 해당 주소에서 post로 요청 받음
    "/:summary_id/like", // 대상 주소
    Auth.isAuthenticated, // 로그인 여부 체크
    SummaryController.likeSummary // likesummary 컨트롤러 함수 사용
);

//#endregion POST METHODS 끝

//#region PUT METHODS

// 글 수정하기
router.put("/:summary_id", Auth.isAuthenticated, SummaryController.update);

//#endregion

//#region DELETE METHODS

// 글 삭제하기
router.delete(
    "/:summary_id/like",
    Auth.isAuthenticated,
    SummaryController.removeFromLikeSummary
);

router.delete("/:summary_id", Auth.isAuthenticated, SummaryController.remove);

//#endregion

export default router;

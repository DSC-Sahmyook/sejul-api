import { Response, Router } from "express";
import {
    UserController,
    SummaryController,
    ArticleController,
    HashtagController,
} from "../controllers";
import * as Middlewares from "../middlewares";

import * as Multer from "multer";

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

const router = Router();

// 유저 정보 가져오기
router.get(
    "/",
    Middlewares.Auth.isAuthenticated,
    UserController.authenticatedUserInfo
);
// 유저가 팔로우 중인 사용자 정보
router.get(
    "/:username/following",
    UserController.fetchFollowingUserAndSummaries
);
// 유저가 팔로우 중인 해시태그 정보
router.get(
    "/:username/hashtags",
    UserController.fetchFollowingHashtagAndSummaries
);
// 유저가 좋아요한 글
router.get("/:username/likes", SummaryController.fetchLikeSummary);
// 유저가 저장한 기사
router.get("/:username/bookmarks", UserController.UserArticles);

// 유저가 작성한 글
router.get("/:username/summaries", SummaryController.fetchRelatedUser);
// 유저의 정보
router.get("/:username", UserController.fetchUserWithSummaries);

// 유저 이미지 변경
router.post(
    "/profile",
    Middlewares.Auth.isAuthenticated,
    multer.single("profileImage"),
    Middlewares.GCP.uploadImage,
    UserController.uploadProfileImage
);

// 유저가 좋아요 한 글
router.post(
    "/summary/:summary_id/like",
    Middlewares.Auth.isAuthenticated,
    SummaryController.likeSummary
);

// 유저가 팔로우중인 해시태그와 관련 글
router.post(
    "/hashtag/:hashtag_id/like",
    Middlewares.Auth.isAuthenticated,
    HashtagController.followHashtag
);

// 유저가 팔로우중인 사용자들과 관련 글
router.post(
    "/following/:username",
    Middlewares.Auth.isAuthenticated,
    UserController.followUser
);

// 유저 패스워드 수정
router.put(
    "/password",
    Middlewares.Auth.isAuthenticated,
    UserController.changePassword
);

// 유저 정보 수정
router.put("/:username", Middlewares.Auth.isItself, UserController.editUser);

// 사용자 팔로우 취소
router.delete(
    "/following/:username",
    Middlewares.Auth.isAuthenticated,
    UserController.unFollowUser
);

// 해시태그 팔로우 취소
router.delete(
    "/hashtag/:hashtag_id",
    Middlewares.Auth.isAuthenticated,
    HashtagController.unfollowHashtag
);

router.delete(
    "/summary/:summary_id/like",
    Middlewares.Auth.isAuthenticated,
    SummaryController.removeFromLikeSummary
);

// 유저 삭제
router.delete("/remove", Middlewares.Auth.isItself, UserController.deleteUser);

export default router;

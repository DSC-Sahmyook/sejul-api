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
router.get("/:username/hashtags", HashtagController.followHashtag);
// 유저가 좋아요한 글
router.get("/:username/likes", SummaryController.fetchLikeSummary);
// 유저가 저장한 기사
router.get(
    "/:username/bookmarks",
    Middlewares.Auth.isAuthenticated,
    ArticleController.fetchArticles,
    //UserController.UserArticles,
);
// 유저가 작성한 글
router.get("/:username/summary", SummaryController.fetchRelatedUser);
// 유저의 정보
router.get("/:username", UserController.info);

// 유저 이미지 변경
router.post(
    "/:username/profile",
    Middlewares.Auth.isAuthenticated,
    multer.single("profileImage"),
    Middlewares.GCP.uploadImage,
    UserController.uploadProfileImage
);

// 유저가 좋아요 한 글
router.put(
    "/:username/like",
    Middlewares.Auth.isItself,
    SummaryController.likeSummary
);

// 유저가 팔로우중인 해시태그와 관련 글
router.put(
    "/:username/hashtag",
    Middlewares.Auth.isItself,
    HashtagController.followHashtag
);

// 유저가 팔로우중인 사용자들과 관련 글
router.put(
    "/:username/following",
    Middlewares.Auth.isItself,
    UserController.followUser
);

// 유저 패스워드 수정
router.put(
    "/:username/password",
    Middlewares.Auth.isItself,
    UserController.changePassword
);

// 유저 정보 수정
router.put("/:username", Middlewares.Auth.isItself, UserController.editUser);

// 글 좋아요 취소
router.delete(
    "/:username/like/:summaryId",
    Middlewares.Auth.isItself,
    SummaryController.removeFromLikeSummary
);

// 사용자 팔로우 취소
router.delete(
    "/:username/following/:target",
    Middlewares.Auth.isItself,
    UserController.unFollowUser
);

// 해시태그 팔로우 취소
router.delete(
    "/:username/hashtag/:hashtagId",
    Middlewares.Auth.isItself,
    HashtagController.unfollowHashtag
);

// 유저 삭제
router.delete(
    "/:username",
    Middlewares.Auth.isItself,
    UserController.deleteUser
);

export default router;

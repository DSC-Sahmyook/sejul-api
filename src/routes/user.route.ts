import { Response, Router } from "express";
import { UserController } from "../controllers";
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
router.get("/", Middlewares.Auth.isAuthenticated, UserController.info);
router.get("/:username", Middlewares.Auth.isAuthenticated, UserController.info);

router.post(
    "/:username/profile",
    Middlewares.Auth.isAuthenticated,
    multer.single("profileImage"),
    Middlewares.GCP.uploadImage,
    UserController.uploadProfileImage
);

// 유저 패스워드 수정
router.put(
    "/:username/password",
    Middlewares.Auth.isItself,
    UserController.changePassword
);

// 유저 정보 수정
router.put("/:username", Middlewares.Auth.isItself, UserController.editUser);

// 유저 삭제
router.delete(
    "/:username",
    Middlewares.Auth.isItself,
    UserController.deleteUser
);

export default router;

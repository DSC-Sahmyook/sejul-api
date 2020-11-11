import { Response, Router } from "express";
import { UserController } from "../controllers";
import * as Middlewares from "../middlewares";

const router = Router();

// 유저 정보 가져오기
router.get("/", Middlewares.Auth.isAuthenticated, UserController.info);
router.get("/:username", Middlewares.Auth.isAuthenticated, UserController.info);

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

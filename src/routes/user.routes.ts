import { Router } from "express";
import { UserController } from "../controllers";
import * as Middlewares from "../middlewares";

const router = Router();

router.get("/:username", Middlewares.Auth.isAuthenticated, UserController.info);

router.put(
    "/:username/password",
    Middlewares.Auth.isItself,
    UserController.changePassword
);

router.put("/:username", Middlewares.Auth.isItself, UserController.editUser);

router.delete(
    "/:username",
    Middlewares.Auth.isItself,
    UserController.deleteUser 
);

export default router;

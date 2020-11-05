import { Response, Router } from "express";
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

// this.app.use('/api/user' , userRoutes);
// router.get("/")
// -> localhost:3000/api/user <- HTTP GET
router.get("/", (request: any, response: Response) => {
    console.log("Hello");
});

// http method : get post delete put



export default router;

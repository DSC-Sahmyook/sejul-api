import * as express from "express";
import * as bodyparser from "body-parser";
import * as cors from "cors";
import * as helmet from "helmet";
import * as logger from "morgan";

import { Application } from "express";

import * as UTILS from "./utils";
import * as passport from "passport";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

export class App {
    private app: Application;

    constructor(private port?: number | string) {
        this.app = express();
        this.settings();
        this.db();
        this.auth();
        this.middleware();
        this.routes();
    }

    public async listen() {
        await this.app.listen(this.app.get("port"));
        console.info(`Server on port ${this.app.get("port")}`);
    }

    private async settings() {
        this.app.set("port", process.env.PORT || this.port || 3000);
    }

    private middleware() {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(logger("dev"));
        this.app.use(bodyparser.json());
        this.app.use(
            bodyparser.urlencoded({
                extended: true,
            })
        );
    }

    private async db() {
        return await UTILS.DB.Connector.init();
    }

    private auth() {
        this.app.use(passport.initialize());
        // JWT를 사용할 예정이라 세션은 필요없음
        // this.app.use(passport.session());
        UTILS.PASSPORT(passport);
    }

    private routes() {
        this.app.use("/api/user", userRoutes);
        this.app.use("/auth", authRoutes);

        this.app.use((req, res) => {
            // 404 ERROR
            res.status(404).send({ message: "잘못된 주소입니다" });
        });
        this.app.use((err, req, res, next) => {
            // 500 ERROR
            console.log(err);
            res.status(500).send({
                message: "서버 에러가 발생했습니다",
                error: err.message,
            });
        });
    }
}

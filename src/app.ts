import * as express from "express";
import * as bodyparser from "body-parser";
import * as cors from "cors";
import * as helmet from "helmet";
import * as logger from "morgan";

import { Application } from "express";

import * as UTILS from "./utils";
import * as passport from "passport";

import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import summaryRoutes from "./routes/summary.route";
import analysisRoutes from "./routes/analysis.route";
import hashtagRoutes from "./routes/hashtag.route";
import searchRoutes from "./routes/search.route";
import articleRoutes from "./routes/article.route";

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
        this.port =
            process.env.PORT ||
            (process.env.NODE_ENV === "production" ? 80 : 3000);
        this.app.set("port", process.env.PORT || this.port || 3000);

        process.env.GOOGLE_APPLICATION_CREDENTIALS = `${process.cwd()}/secure/carbide-acre-295302-d9592638e072.json`;
        console.log(
            "google authentication installed at",
            process.env["GOOGLE_APPLICATION_CREDENTIALS"]
        );
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
        // 라우팅 해주는 곳
        // localhost:3000/api/user
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api/user", userRoutes);
        this.app.use("/api/analysis", analysisRoutes);
        this.app.use("/api/summary", summaryRoutes);
        this.app.use("/api/hashtag", hashtagRoutes);
        this.app.use("/api/search", searchRoutes);
        this.app.use("/api/article", articleRoutes);

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

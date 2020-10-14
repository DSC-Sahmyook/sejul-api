import * as mongoose from "mongoose";
import ENV from "../env";
import * as Models from "./models";
const _env = ENV();

export class Connector {
    private static instance: mongoose.Mongoose;
    private constructor() {}

    public static async init() {
        try {
            await mongoose.connect(_env.get("DB_CONNECTION_STRING"), {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            mongoose.set("useCreateIndex", true);
            mongoose.connection
                .once("open", async () => {
                    console.log("[DB] connected to database server");
                    for (const key of Object.keys(Models)) {
                        if (!mongoose.models[key]) {
                            console.log(`[DB] '${key}' is not exists`);
                            await Models[key].createCollection();
                            console.log(`[DB] '${key}' initialized`);
                        }
                    }
                })
                .on("error", () => {
                    console.log("error !");
                });
            return this.instance;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    public static getConnection() {
        return mongoose.connection;
    }
}

import * as dotenv from "dotenv";

const __NODE_ENV = process.env.NODE_ENV || "development";
const __ENV_PATH = {
    production: `./production.env`,
    development: `./development.env`,
};

export default () => {
    try {
        dotenv.config({
            path: __ENV_PATH[__NODE_ENV.trim()],
        });


        return {
            get: (name: string): any => {
                return process.env[name];
            },
        };
    } catch (e) {
        throw e;
    }
};

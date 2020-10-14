import * as Interfaces from "./interfaces";

// EXPRESS USER 타입 재정의
declare module "express" {
    export interface Request {
        user?: Interfaces.IUser;
    }
}

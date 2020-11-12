import * as Interfaces from "./interfaces";

// EXPRESS USER 타입 재정의
declare module "express" {
    export interface Request {
        // request의 유저 정보를 변경
        user?: Interfaces.IUser;
        // 업로드 처리를 위한 임시 변수
        gcpImgUrl?: string;
    }
}

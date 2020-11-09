import { IUser } from "./IUser";

export interface IView {
    user: IUser; // 조회 사용자
    viewDate: Date; // 조회 일자
}

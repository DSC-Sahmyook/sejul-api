import { IUser } from "./IUser";

export interface IView {
    ip: string | String; // 조회 아이피
    viewDate: Date; // 조회 일자
    user: IUser;
}

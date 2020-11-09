import { IUser } from "./IUser";

export interface IRate {
    score: Number; // 점수
    user: IUser; // 평점 사용자
    rateDate: Date; // 평점 일자
}

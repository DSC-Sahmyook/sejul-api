import { ICollection } from "./ICollection";
import { IArticle } from "./IArticle";
import { IUser } from "./IUser";

/**
 * Author       : 유경수
 * Create Date  : 2020-10-14
 * Description  : 요약 정보
 */
export interface ISummary extends ICollection {
    article: IArticle; // 기사
    user: IUser; // 요약자
    content: string; // 내용
    timestamp: {
        // 요약 시간에 대한 내용
        start: Date; // 시작일자
        finish: Date; // 종료일자
    };
    views: [
        // 조회수
        {
            user: IUser; // 조회 사용자
            viewDate: Date; // 조회 일자
        }
    ];
    rates: [
        // 평점
        {
            score: Number; // 점수
            user: IUser; // 평점 사용자
            rateDate: Date; // 평점 일자
        }
    ];
}

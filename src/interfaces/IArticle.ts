import { ICollection } from "./ICollection";
import { IPress } from "./IPress";
import { IUser } from "./IUser";

/**
 * Author       : 유경수
 * Create Date  : 2020-10-14
 * Description  : 기사 정보
 */
export interface IArticle extends ICollection {
    title: string; // 기사 제목
    description: string; // 기사 내용
    link: string; // 기사 네이버 링크
    originALink: string; // 기사 언론사 링크
    pubDate: Date; // 등록 일자
    press: IPress; // 언론사
    views: [
        // 조회 정보
        {
            user: IUser; // 조회 사용자
            viewDate: Date; // 조회 일자
        }
    ];
    rates: [
        {
            score: Number; // 평점
            user: IUser; // 사용자
            rateDate: Date; // 평점 일자
        }
    ];
}

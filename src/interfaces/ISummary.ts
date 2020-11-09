import { ICollection } from "./ICollection";
import { IArticle } from "./IArticle";
import { IUser } from "./IUser";
import { IView } from "./IView";
import { IRate } from "./IRate";
import { IHashtag } from "./IHashtag";

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
    // 글 조회 정보
    views: [IView];
    // 글 평가 정보
    rates: [IRate];
    // 해시태그
    hashtags: [IHashtag];
}

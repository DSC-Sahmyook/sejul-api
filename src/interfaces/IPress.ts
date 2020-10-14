import { ICollection } from "./ICollection";

/**
 * Author       : 유경수
 * Create Date  : 2020-10-14
 * Description  : 언론사 정보
 */
export interface IPress extends ICollection {
    title: string; // 언론사 명
    description: string; // 언론사 간략 설명
    imgUrl: string; // 언론사 대표 이미지
    link: string; // 언론사 링크
}

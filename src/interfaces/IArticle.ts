/**
 * Author       : 유경수
 * Create Date  : 2020-10-14
 * Description  : 기사 정보
 *
 * Updated      
 * 2020-11-09 유경수    : 별도 모델에서 부속 모델로 축소됨, 저작권 문제
 */
export interface IArticle {
    title: string | String; // 기사 제목
    link: string | String; // 기사 네이버 링크
    originalLink: string | String; // 언론사 링크
}

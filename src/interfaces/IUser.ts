import { ICollection } from "./ICollection";
import { ICategory } from "./ICategory";
import { IPress } from "./IPress";

/**
 * Author       : 유경수
 * Create Date  : 2020-10-14
 * Description  : 유저 정보
 */
export interface IUser extends ICollection {
    email: string; // 사용자 이메일
    password: string; // 사용자 비밀번호
    username: string; // 유저 정보
    tokens: {
        // 소셜 로그인 정보
        kakao?: string; // 카카오 로그인 토큰
        facebook?: string; // 페이스북 로그인 토큰
        google?: string; // 구글 로그인 토큰
        naver?: string; // 네이버 로그인 토큰
    };
    keywords: [string]; // 관심 키워드
    following: [IUser]; // 내가 팔로우 중인 유저
    follower: [IUser]; // 나를 팔로우 중인 유저
    interestPress: [IPress]; // 내가 관심 가진 언론사
    interestCategories: [ICategory]; // 내가 관심 가진 분야
    notInterestCategories: [ICategory]; // 내가 관심 없는 분야
    isAdmin: Boolean; // 관리자 여부
}

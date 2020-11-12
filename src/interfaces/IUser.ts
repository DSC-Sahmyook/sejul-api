import { ICollection } from "./ICollection";
import { IHashtag } from "./IHashtag";

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
    profile : string; // 프로필 이미지 주소
    following: [IUser]; // 내가 팔로우 중인 유저
    follower: [IUser]; // 나를 팔로우 중인 유저
    hashtags: [IHashtag]; // 내가 관심 가진 분야
    isAdmin: Boolean; // 관리자 여부
}

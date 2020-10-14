import { ICollection } from "./ICollection";

export interface IUser extends ICollection {
    _id: string;
    email: string;
    password: string;
    username: string;
    tokens: {
        kakao?: string;
        facebook?: string;
        google?: string;
        naver?: string;
    };
    isAdmin: Boolean;
}

import {
    hasWhiteSpace,
    hasNewLine,
    hasKor,
    hasEng,
    hasSpecial,
    isEmpty,
    hasNum,
    chkLen,
} from "./strings";

export const isUsername = (username: string) => {
    if (username !== null && username !== undefined) {
        return (
            // 빈 문자열 검수
            !isEmpty(username) &&
            // 공백 미포함
            !hasWhiteSpace(username) &&
            // 줄바꿈 미포함
            !hasNewLine(username) &&
            // 한글 미포함
            !hasKor(username) &&
            // 특수 문자 미포함
            !hasSpecial(username) &&
            // 5자 보다 길고, 20자보다 작음
            chkLen(username, { min: 5, max: 20 }) &&
            // 영대소문자 허용
            (hasEng(username) ||
                // 숫자 허용
                hasNum(username))
        );
    } else {
        return false;
    }
};

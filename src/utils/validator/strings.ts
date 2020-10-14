export const isEmpty = (v: string) => {
    if (v === null || v === undefined) {
        return true;
    }
    return v.trim().length === 0;
};

export const hasSpecial = (v: string) => {
    const regex = /([!\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])/g;
    return regex.test(v);
};

export const hasEng = (v: string) => {
    const regex = /([0-9])/g;
    return regex.test(v);
};

export const hasKor = (v: string) => {
    const regex = /([ㄱ-ㅎㅏ-ㅣ가-힣])/g;
    return regex.test(v);
};

export const hasNum = (v: string) => {
    const regex = /([0-9])/g;
    return regex.test(v);
};

export const hasWhiteSpace = (v: string) => {
    const regex = /\s/g;
    return regex.test(v);
};

export const hasNewLine = (v: string) => {
    const regex = /\r\n|\n|\r/g;
    return regex.test(v);
};

interface IchkLen {
    min?: number;
    max?: number;
}

/**
 * @param v 길이를 체크할 문자열
 * @param opt.min 최소값, 양수이면 포함, 음수이면 미포함
 * @param opt.max 최대값, 양수이면 포함, 음수이면 미포함
 */
export const chkLen = (v: string | String, opt: IchkLen) => {
    if (v === null || v === undefined) {
        return false;
    }
    const existsMin = opt.min !== null && opt.min !== undefined;
    const existsMax = opt.max !== null && opt.max !== undefined;
    if (existsMin && existsMax) {
        // 둘 다 있음
        v = v.trim();
        const opMin = opt.min > 0 ? " >= " : " > ";
        const opMax = opt.max > 0 ? " <= " : " < ";

        return (
            eval(`${v.length} ${opMin} ${opt.min}`) &&
            eval(`${v.length} ${opMax} ${opt.max}`)
        );
    } else if (existsMin && !existsMax) {
        // 최대 값만 있음
        v = v.trim();
        const opMax = opt.max > 0 ? " < " : " <= ";

        return eval(`${v.length} ${opMax} ${opt.max}`);
    } else if (!existsMin && existsMax) {
        // 최소 값만 있음
        // 최대 값만 있음
        v = v.trim();
        const opMin = opt.min > 0 ? " > " : " >= ";

        return eval(`${v.length} ${opMin} ${opt.min}`);
    } else {
        // 둘다 없음
        return false;
    }
};

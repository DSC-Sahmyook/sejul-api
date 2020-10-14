import { isEmpty, chkLen } from "./strings";

export const isPassword = (pw: string) => {
    if (pw === null || pw === undefined) {
        return false;
    }
    if (isEmpty(pw)) {
        return false;
    }

    pw = pw.trim();

    const _len = chkLen(pw, { min: 5, max: 10 });

    return _len;
};

export const comparePassword = (pw: string, chk: string) => {
    return pw === chk;
};

import { chkLen, isEmpty } from "./strings";

export const isHp = (hp: string, containHypen: Boolean = true) => {
    if (hp === null || hp === undefined || isEmpty(hp)) {
        return false;
    }

    if (containHypen) {
        const regex = /^\d{3}-\d{3,4}-\d{4}$/;
        return regex.test(hp);
    } else {
        return chkLen(hp, { min: 10, max: 11 });
    }
};

import { Request, Response, json, NextFunction } from "express";

import * as Models from "../utils/db/models";
import createEnv from "../utils/env";

// 1. 어떤 주소에 필요한 작업을 끝내주세요

// 2. 마저 개발
// 2.1. 라우팅 하는 법
// 2.2. 리스폰스 하는 법
// 2.2. 리퀘스트 읽어오는 법
// 2.3. 디비 불러오는 거

export const fn1 = async (req: Request, res: Response) => {
    // request : 사용자의 요청
    // response : 내 응답
    // res.send("Hello"); // Hello
    // res.json({ Hello: "World" });
    // 비동기 통신
    // 자바스크립트 비동기 통신 <- async await
    // Models.User.findOne;
};

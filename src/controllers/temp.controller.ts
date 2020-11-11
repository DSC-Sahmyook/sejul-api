import { Request, Response } from "express";
import * as Models from "../utils/db/models";
import { IAPIError } from "../interfaces/IAPIError";
import { Model, modelNames } from "mongoose";

// 모든 요약 글을 조회하는 함수를 작성해주세요
export const fetchSummaries = async (request: Request, response: Response) => {
    // 데이터 조회는 mongoose를 이용합니다
    // Models.Summary를 사용하세요
    // 반드시 response를 통해 응답해야합니다
    try {
        const summaries = await Models.Summary.find();
        response.json(summaries);
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "조회 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
    response.json("응답");
    }
};

// 모든 해시태그를 조회하는 함수를 작성해주세요
export const fetchHashtags = async (request: Request, response: Response) => {
    // 데이터 조회는 mongoose를 이용합니다
    // Models.Hashtag를 사용하세요
    // 반드시 response를 통해 응답해야합니다
    try {
        const hashtags = await Models.Hashtag.find();
        response.json(hashtags);
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "조회 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
    response.json("응답");
    }
};

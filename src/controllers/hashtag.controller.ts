import { Request, Response } from "express";
import * as Models from "../utils/db/models";
import { VALIDATOR } from "../utils";
import { IAPIError } from "../interfaces/IAPIError";
// import { ENV, VALIDATOR } from "../utils";

export const fetchAll = async (request: Request, response: Response) => {
    try {
        const hashtags = await Models.Hashtag.find();
        response.json(hashtags);
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "조회 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
        response.status(500).json(_error);
    }
};

export const create = async (request: Request, response: Response) => {
    try {
        const { hashtag } = request.body;
        if (
            !VALIDATOR.isEmpty(hashtag) &&
            (VALIDATOR.hasEng(hashtag) || VALIDATOR.hasKor(hashtag)) &&
            !VALIDATOR.hasWhiteSpace(hashtag) &&
            hashtag.indexOf("#") < 0
        ) {
            const newHashtag = new Models.Hashtag({
                text: hashtag,
            });

            const result = await newHashtag.save();
            response.status(201).json({
                message: "생성되었습니다",
                result: result,
            });
        } else {
            throw new Error("올바른 해시태그 형식이 아닙니다");
        }
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "생성 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
        response.status(500).json(_error);
    }
};

export const followHashtag = async (req: Request, res: Response) => {
    try {
        // 코드
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

export const unfollowHashtag = async (req: Request, res: Response) => {
    try {
        // 코드
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

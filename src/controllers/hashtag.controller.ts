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
        const { username } = req.params;
        const page = Number(req.query.page) || 1;
        const cnt = Number(req.query.cnt) || 15;

        //사용자 조회
        const user = await Models.User.findOne({
            username: username,
        });
        
        //사용자 해쉬태그 아이디= user.hashtags
        
        //해당 해시태그를 포함하는 모든 작성 글 조회
        const userHashtagSummary = await Models.Summary.aggregate([
            {
                $match: {
                    hashtags: { $in: user.hashtags },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $skip: cnt * (page - 1),
            },
            {
                $limit: cnt,
            },
        ]);

        if (user) {
            const result = {
                hashtags: user.hashtags, // 해시태그
                summary: {
                    currentPage: page, // 요청한 현재 페이지
                    data: userHashtagSummary, // 실제 요약글 데이터
                    total: userHashtagSummary.length, // 해당 조건에 해당하는 모든 글의 갯수
                },
            };
            res.status(200).json(result);
        } else {
            throw new Error("사용자가 존재하지 않습니다");
        }
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
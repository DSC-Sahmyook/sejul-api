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
                // 모든 데이터 갯수를 가져오기 위해서 분리
                // facet은 여러개의 요청 파이프라인을 위해 사용
                $facet: {
                    // 먼저 글 정보를 불러옴
                    summaries: [
                        {
                            // 글 정보중 해시태그가 유저의 해시태그와 동일한 경우 추출
                            $match: {
                                hashtags: { $in: user.hashtags },
                            },
                        },
                        {
                            // 해시태그의 정보를 추가로 가져옴
                            $lookup: {
                                from: "hashtags", // 대상 collection 이름
                                localField: "hashtags", // summary 내에서 컬럼명
                                foreignField: "_id", // 대상 collection 내에서 필드명
                                as: "hashtags", // 가져온 데이터를 저장할 곳
                            },
                        },
                        {
                            // 배열을 정렬함
                            $sort: { createdAt: -1 },
                        },
                        {
                            // 페이징 처리를 위해 건너뜀
                            $skip: cnt * (page - 1),
                        },
                        {
                            // 갯수 제한
                            $limit: cnt,
                        },
                    ],
                    // 글 정보를 조회하면서 count 정보를 산출
                    metadata: [
                        { $count: "count" },
                        {
                            $addFields: {
                                page: page,
                            },
                        },
                    ],
                },
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

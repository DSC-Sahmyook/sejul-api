/**
 * Author       : 유경수
 * Created Date : 2020-11-09
 * Description  : 요약 글 관련 API
 * History
 * -
 */
import { json, Request, Response } from "express";
import * as Models from "../utils/db/models";
import { ENV, VALIDATOR } from "../utils";
import { IAPIError } from "../interfaces";
import * as moment from "moment";

const env = ENV();

/**
 * @description 요약 글 상세 조회하기
 * @param summary_id 글 번호
 */
export const fetchDetail = async (req: Request, res: Response) => {
    try {
        // 글 번호 가져오기
        const { summary_id } = req.params;

        // 사용자 아이피 가져오기
        const forwarded = req.headers["x-forwarded-for"];
        const ip = forwarded
            ? forwarded.toString().split(/, /)[0]
            : req.connection.remoteAddress;

        const result = await Models.Summary.findOne({
            _id: summary_id,
        })
            .populate("hashtags")
            .populate("user");

        if (result) {
            // 같은 ip는 조회수 카운트에 더하지 않음
            const isExists = result.views.find((item) => {
                return item.ip === ip;
            });

            if (!isExists) {
                result.views.push({
                    ip: ip,
                    user: req.user || undefined,
                    viewDate: new Date(),
                });
                await result.save();
            }

            res.status(200).json(result);
        } else {
            res.status(404).json({
                displayMessage: "글이 존재하지 않습니다",
                message: "글이 존재하지 않습니다",
            });
        }
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "조회 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
        res.status(500).json(_error);
    }
};

/**
 * @description 유저별 요약 글 조회하기
 * @param username 유저이름
 * @param userObjectID 유저 ObjectID
 * @param page 글 페이지
 * @param cnt 글 조회 갯수
 */
export const fetchRelatedUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const page = Number(req.query.page) || 1;
        const cnt = Number(req.query.cnt) || 15;

        // 유저 ObjectID 가져오기
        const userObjectID = (
            await Models.User.findOne({
                username: username,
            })
        )._id;

        if (userObjectID) {
            // 해당 유저의 글 조회
            const result = await Models.Summary.aggregate([
                {
                    $match: { user: userObjectID },
                },
                {
                    $lookup: {
                        from: "hashtags",
                        localField: "hashtags",
                        foreignField: "_id",
                        as: "hashtags",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { id: "$user" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$id"] },
                                },
                            },
                            {
                                $project: {
                                    password: 0,
                                    isDeleted: 0,
                                    isAdmin: 0,
                                    following: 0,
                                    hashtags: 0,
                                    lastUpdatedDate: 0,
                                    createdAt: 0,
                                    articles: 0,
                                },
                            },
                        ],
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
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

            res.status(200).json(result);
        } else {
            throw new Error("글이 존재하지 않습니다");
        }
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "조회 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
        res.status(500).json(_error);
    }
};

/**
 * @description 요약 글 목록 조회하기
 * @query page 글 페이지
 * @query cnt 글 조회 갯수
 */
export const fetchAll = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const cnt = Number(req.query.cnt) || 15;

        const result = await Models.Summary.aggregate([
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

        res.status(200).json(result);
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "조회 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
        res.status(500).json(_error);
    }
};

/**
 * @description 요약 글 추가하기
 */
export const create = async (req: Request, res: Response) => {
    try {
        // 데이터가 올바른지 확인
        let {
            articleTitle,
            articleLink,
            articleOriginalLink,
            content,
            timestamp,
            hashtags,
        } = req.body;

        // 1. 제목 확인
        if (
            VALIDATOR.isEmpty(articleTitle) ||
            articleTitle.length < 10 ||
            articleTitle.length > 500
        ) {
            throw new Error("제목 형식이 올바르지 않습니다");
        }

        // 2. 링크 확인
        if (
            VALIDATOR.isEmpty(articleLink) ||
            articleLink.length > 1000 ||
            !VALIDATOR.isUrl(articleLink)
        ) {
            throw new Error("링크 형식이 올바르지 않습니다");
        }
        if (
            VALIDATOR.isEmpty(articleOriginalLink) ||
            articleOriginalLink.length > 1000 ||
            !VALIDATOR.isUrl(articleOriginalLink)
        ) {
            throw new Error("링크 형식이 올바르지 않습니다");
        }

        // 3. 내용 확인
        if (VALIDATOR.isEmpty(content) || content.length > 3000) {
            throw new Error("내용이 올바르지 않습니다");
        }

        // 4. 타임스탬프 관련
        if (VALIDATOR.isEmpty(timestamp)) {
            throw new Error("타이머의 시간정보가 올바르지 않습니다");
        }

        hashtags = hashtags.split(",");
        let hashtagIds = [];
        hashtags.map(async (hashtag) => {
            const fetched = await Models.Hashtag.findOne({
                text: hashtag,
            });
            if (fetched) {
                hashtagIds.push(fetched);
            } else {
                const newHashatag = new Models.Hashtag({
                    text: hashtag,
                });
                await newHashatag.save();
                hashtagIds.push(newHashatag);
            }
        });

        // 데이터 생성
        const newSummary = new Models.Summary({
            article: {
                title: articleTitle,
                link: articleLink,
                originalLink: articleOriginalLink,
            },
            user: req.user,
            content: content,
            timestamp: timestamp,
            hashtags: hashtagIds,
        });

        const result = await newSummary.save();
        res.status(201).json({
            message: "생성되었습니다",
            summary: result,
        });
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "조회 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
        res.status(500).json(_error);
    }
};

/**
 * @description 요약 글 수정하기
 * @param summary_id 수정할 글 번호
 * @query content 수정할 내용
 */
export const update = async (req: Request, res: Response) => {
    try {
        const { summary_id } = req.params;
        const { content } = req.body;
        const fetchedSummary = await Models.Summary.findOne({
            _id: summary_id,
        });
        if (fetchedSummary) {
            if (!VALIDATOR.isEmpty(content) && content.length < 3000) {
                fetchedSummary.content = content;
                fetchedSummary.lastUpdatedDate = new Date();
                await fetchedSummary.save();

                res.json({
                    message: "수정되었습니다",
                });
            } else {
                throw new Error("글 내용이 올바르지 않습니다");
            }
        } else {
            throw new Error("존재하지 않는 글입니다");
        }
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "실행 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
        res.status(500).json(_error);
    }
};

/**
 * @description 요약 글 삭제하기
 * @param summary_id 삭제할 글 번호
 */
export const remove = async (req: Request, res: Response) => {
    try {
        const { summary_id } = req.params;
        const fetchedSummary = await Models.Summary.findOne({
            _id: summary_id,
        });
        if (fetchedSummary !== null && fetchedSummary !== undefined) {
            if (fetchedSummary.user._id === req.user._id || req.user.isAdmin) {
                const result = await Models.Summary.updateOne(
                    {
                        _id: summary_id,
                    },
                    {
                        isDeleted: true,
                    }
                );
                res.json({
                    message: "삭제되었습니다",
                    result: result,
                });
            } else {
                throw new Error("삭제 권한이 없는 사용자 입니다");
            }
        } else {
            throw new Error("존재하지 않는 글 입니다");
        }
    } catch (e) {
        const _error: IAPIError = {
            displayMessage: "실행 중 오류가 발생했습니다",
            message: e.message,
            error: e,
        };
        res.status(500).json(_error);
    }
};

export const fetchLikeSummary = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const page = Number(req.query.page) || 1;
        const cnt = Number(req.query.cnt) || 15;
        // 해당 유저의 좋아요한 글 목록
        
        const currentUser = await Models.User.findOne({
            username: username,
        });

        if (currentUser) {
            const likedSummaries = await Models.Summary.find({
                _id: {
                    $in: currentUser.likes,
                },
            })
                .sort({ createdAt: -1 })
                .skip(cnt * (page - 1))
                .limit(cnt)
                .populate("user", { password: 0, isAdmin: 0, isDeleted: 0 })
                .populate("hashtags");

            res.status(200).json({
                data: likedSummaries,
                page: page,
                count: currentUser.likes.length,
            });
        } else {
            res.status(404).json({
                message: "존재하지 않는 사용자 입니다",
            });
            return;
        }
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

// 유저가 좋아요 한 글
export const likeSummary = async (req: Request, res: Response) => {
    try {
        const { summary_id } = req.params;

        //좋아요 누를 글 조회
        const fetchedSummary = await Models.Summary.findOne({
            _id: summary_id,
        });

        if (req.user !== null && req.user !== undefined) {
            //사용자가 있을 때
            if (fetchedSummary !== null && fetchedSummary !== undefined) {
                //글이 존재하고

                //post 메소드로 요청이 왔을 때
                //likes에 글이 존재하는지 조회

                // 로그인 한 사용자의 좋아요 글 중 현재 검색한 글의 _id와 같은게 있는지 확인
                let alreadyLikedSummary = req.user.likes.find((summary) => {
                    return `${summary._id}` === `${fetchedSummary._id}`;
                });

                if (alreadyLikedSummary) {
                    //이미 likes에 있다면
                    throw new Error("이미 추가된 글입니다."); //저장하지 않음
                } else {
                    //likes에 없다면
                    req.user.likes.push(fetchedSummary); //저장

                    await req.user.save();

                    res.status(201).json({
                        message: "추가되었습니다",
                    });
                }
            }
        } else {
            throw new Error("사용자가 존재하지 않습니다.");
        }
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

export const removeFromLikeSummary = async (req: Request, res: Response) => {
    try {
        const { summary_id } = req.params;

        //좋아요 지울 글 조회
        const fetchedSummary = await Models.Summary.findOne({
            _id: summary_id,
        });

        if (req.user !== null && req.user !== undefined) {
            //사용자가 있을 때
            if (fetchedSummary !== null && fetchedSummary !== undefined) {
                //글이 존재하고

                //delete 메소드로 요청이 왔을 때

                //likes에 글이 존재하는지 조회
                const userLikesData = req.user.likes.find((summary) => {
                    return `${fetchedSummary._id}` === `${summary._id}`;
                });

                if (userLikesData) {
                    //likes에 있다면
                    await Models.User.updateOne(
                        {
                            _id: req.user._id,
                        },
                        {
                            $pull: {
                                likes: userLikesData,
                            }, //삭제
                        }
                    );

                    await req.user.save();

                    res.status(201).json({
                        message: "삭제되었습니다",
                    });
                } else {
                    //likes에 없다면
                    throw new Error("이미 삭제된 글입니다."); //삭제하지 않음
                }
            }
        } else {
            throw new Error("사용자가 존재하지 않습니다.");
        }
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

/**
 * Author       : 유경수
 * Created Date : 2020-11-09
 * Description  : 유저 정보 조회 및 수정 관련
 * History
 * -
 */
import { NextFunction, Request, Response } from "express";
import * as Models from "../utils/db/models";
import * as Utility from "../utils";
import * as bcrypt from "bcrypt";
import { followHashtag } from "./hashtag.controller";
import { IHashtag } from "../interfaces";

const env = Utility.ENV();

/**
 * @description 프로필 이미지 업로드
 * @author 유경수
 */
export const uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.gcpImgUrl) {
        res.status(500).json({
            message: "이미지 업로드 중 오류가 발생했습니다",
        });
        return;
    }
    try {
        req.user.profile = req.gcpImgUrl;
        req.user.lastUpdatedDate = new Date();
        await req.user.save();
        res.status(200).json({
            message: "이미지가 업로드 되었습니다",
        });
    } catch (e) {
        res.status(500).json({
            message: "오류가 발생했습니다",
            error: e.message,
        });
    }
};

//#region 사용자 정보 수정

export const authenticatedUserInfo = (req: Request, res: Response) => {
    res.status(200).json(req.user);
};

/**
 * @description 사용자 정보 가져오기
 * @author 유경수
 */
export const info = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const result = await Models.User.findOne(
            { username: username },
            { password: 0, isAdmin: 0, isDeleted: 0 }
        );
        const summaries = await Models.Summary.find(
            {
                user: result._id,
            },
            {
                _id: 0,
                password: 0,
                isDeleted: 0,
                isAdmin: 0,
            }
        )
            .populate("user", {
                _id: 0,
                password: 0,
                isDeleted: 0,
                isAdmin: 0,
                hashtags: 0,
                following: 0,
                articles: 0,
            })
            .populate("hashtags");
        if (result) {
            res.status(200).json({
                user: result,
                summaries: summaries,
            });
        } else {
            res.status(404).json({
                message: "존재하지 않는 사용자입니다",
            });
        }
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

/**
 * @description 사용자 정보 변경
 * @author 유경수
 */
export const editUser = async (req: Request, res: Response) => {
    // req.params.username      : 현재 사용자 이름
    // req.body.username        : 변경할 사용자 이름

    const _username = req.body.username;
    if (_username !== undefined && _username !== null) {
        // 사용자 명 체크 로직 추가 되어야
        if (Utility.VALIDATOR.isUsername(_username)) {
            await Models.User.updateOne(
                {
                    _id: req.user._id,
                },
                {
                    $set: {
                        username: _username,
                        lastUpdatedDate: new Date(),
                    },
                }
            );
        } else {
            res.status(400).json({
                message: "사용자 명이 올바르지 않습니다",
            });
        }
    } else {
        res.status(400).json({
            message: "사용자 명이 주어지지 않았습니다",
        });
    }
};

/**
 * @description 패스워드 변경
 * @author 유경수
 */
export const changePassword = async (req: Request, res: Response) => {
    // 확인용 기존 패스워드와 데이터베이스에 저장된 패스워드를 비교
    const compare = bcrypt.compareSync(req.body.origin, req.user.password);
    if (compare) {
        // 변경할 패스워드
        const _newPassword = req.body.new;
        // 변경할 패스워드의 확인용
        const _verifyNewPassword = req.body.verify;

        // 변경할 패스워드가 정해진 패스워드 형식을 만족하는지 확인
        if (!Utility.VALIDATOR.isPassword(_newPassword)) {
            // 오류 응답 : 패스워드 형식이 정상이 아닌 경우
            return res.status(400).json({
                message: "패스워드 형식이 올바르지 않습니다",
            });
        }

        // 변경할 패스워드를 둘 다 모두 동일하게 입력했는지 확인
        if (_newPassword === _verifyNewPassword) {
            try {
                // 새로 저장할 패스워드의 해싱
                const saltRound = Number(env.get("HASH_SALT_ROUND"));
                const salt = bcrypt.genSaltSync(saltRound);
                const hashed = bcrypt.hashSync(_newPassword, salt);

                // 새로운 패스워드를 저장
                await Models.User.updateOne(
                    {
                        _id: req.user._id,
                    },
                    {
                        $set: { password: hashed, lastUpdatedDate: new Date() },
                    }
                );

                // 응답
                res.status(200).json({
                    message: "변경되었습니다",
                });
            } catch (e) {
                // 오류 응답
                res.status(500).json({
                    message: "오류가 발생했습니다",
                    error: e.message,
                });
            }
        } else {
            // 오류 응답 : 패스워드가 일치하지 않는 경우
            res.status(400).json({
                message: "패스워드가 일치하지 않습니다",
            });
        }
    } else {
        // 오류 응답 : 기존 패스워드가 일치하지 않는 경우
        res.status(403).json({
            message: "패스워드가 올바르지 않습니다",
        });
    }
};

/**
 * @description 사용자 삭제
 * @author 유경수
 */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        // 삭제 처리
        // 삭제 처리는 remove하지 않고, isDeleted 항목을 true로 변경하는 것으로 함
        await Models.User.updateOne(
            {
                _id: req.user._id,
            },
            {
                $set: {
                    isDeleted: true,
                    lastUpdatedDate: new Date(),
                },
            }
        );

        // 정상 응답
        res.status(200).json({
            message: "정상적으로 삭제되었습니다",
        });
    } catch (e) {
        // 오류 응답 : 알 수 없는 오류
        res.status(500).json({
            message: "오류가 발생했습니다",
            error: e.message,
        });
    }
};
//#endregion

// 특정 유저가 팔로우 중인 사용자와 작성 글
export const fetchFollowingUserAndSummaries = async (
    req: Request,
    res: Response
) => {
    try {
        const { username } = req.params;
        const page = Number(req.query.page) || 1;
        const cnt = Number(req.query.cnt) || 15;

        // 팔로우하는 사용자 목록 가져오기
        const currentUser = await Models.User.findOne({ username: username });
        const followUsers = await Models.User.aggregate([
            {
                $match: {
                    _id: {
                        $in: currentUser.following,
                    },
                },
            },
            {
                $project: {
                    password: 0,
                    isDeleted: 0,
                    isAdmin: 0,
                    lastUpdatedDate: 0,
                    createdAt: 0,
                    articles: 0,
                },
            },
            {
                $lookup: {
                    from: "summaries",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$user", "$$id"] },
                            },
                        },
                        { $project: { _id: 1, user: 1 } },
                    ],
                    as: "summaries",
                },
            },
        ]);

        let followUserIds = [];
        followUsers.forEach((item) => followUserIds.push(item._id));
        // 팔로우하는 사용자들의 모든 글 가져오기
        const userFollowingSummaryData = await Models.Summary.aggregate([
            {
                $match: { user: { $in: followUserIds } },
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
                $lookup: {
                    from: "hashtags",
                    foreignField: "_id",
                    localField: "hashtags",
                    as: "hashtags",
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

        const result = {
            users: followUsers, // 사용자들
            summary: {
                currentPage: page, // 요청한 현재 페이지
                data: userFollowingSummaryData, // 해당 페이지의 갯수?? 해당 페이지의 data?
                total: followUsers.length, // 이 경우에 해당하는 모든 글의 갯수
            },
        };
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

export const fetchFollowingHashtagAndSummaries = async (
    req: Request,
    res: Response
) => {
    try {
        try {
            const { username } = req.params;
            const page = Number(req.query.page) || 1;
            const cnt = Number(req.query.cnt) || 15;

            // 팔로우하는 사용자 목록 가져오기
            const currentUser = await Models.User.findOne({
                username: username,
            });
            const followHashtags = await Models.Hashtag.aggregate([
                {
                    $match: {
                        _id: {
                            $in: currentUser.hashtags,
                        },
                    },
                },
            ]);
            let tagIds = [];
            followHashtags.forEach((tag: IHashtag) => tagIds.push(tag._id));

            const fetchedSummaries = await Models.Summary.aggregate([
                {
                    $match: {
                        hashtags: {
                            $in: tagIds,
                        },
                    },
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

            res.json({
                hashtags: followHashtags,
                summaries: fetchedSummaries,
            });
        } catch (e) {
            res.status(500).json({
                message: "조회 중 오류가 발생했습니다",
                error: e.message,
            });
        }
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

export const followUser = async (req: Request, res: Response) => {
    try {
        // 코드
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

export const unFollowUser = async (req: Request, res: Response) => {
    try {
        // 코드
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

export const UserArticles = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const page = Number(req.query.page) || 1;
        const cnt = Number(req.query.cnt) || 15;

        //사용자의 기사=user.articles

        const fetchUserArticles = await Models.User.aggregate([
            {
                // 모든 데이터 갯수를 가져오기 위해서 분리
                // facet은 여러개의 요청 파이프라인을 위해 사용
                $facet: {
                    // 먼저 글 정보를 불러옴
                    articles: [
                        {
                            // 글 정보중 해시태그가 유저의 해시태그와 동일한 경우 추출
                            $match: {
                                username: username,
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

        if (username) {
            const result = {
                data: fetchUserArticles[0].articles.articles,
                currentPage: page,
                total: fetchUserArticles[0].matadata.count,
            };
            res.status(200).json(result);
        } else {
            throw new Error("사용자가 존재하지 않습니다");
        }
    } catch (e) {
        res.status(500).json({
            message: "오류가 발생했습니다",
            error: e.message,
        });
    }
};

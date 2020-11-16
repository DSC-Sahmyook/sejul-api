/**
 * Author       : 유경수
 * Created Date : 2020-11-09
 * Description  : 통계 관련 API
 * History
 * -
 */

import { Request, Response } from "express";
import * as Models from "../utils/db/models";
import { ENV, VALIDATOR } from "../utils";

// 가장 글이 많이 작성된 해시태그 조회하기
export const fetchHottestHashtags = async (req: Request, res: Response) => {
    try {
        const result = await Models.Summary.aggregate([
            { $unwind: "$hashtags" },
            {
                $lookup: {
                    from: "hashtags",
                    foreignField: "_id",
                    localField: "hashtags",
                    as: "hashtag_detail",
                },
            },
            {
                $group: {
                    _id: "$hashtags",
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
            {
                $limit: 10,
            },
        ]);
        const filteredIds = [];
        let data = [];

        result.forEach((item) => {
            filteredIds.push(item._id);
        });
        data = await Models.Hashtag.find({
            _id: {
                $in: filteredIds,
            },
        });
        if (filteredIds.length < 10) {
            const count = 10 - filteredIds.length;
            const additionalData = await Models.Hashtag.find({
                _id: {
                    $nin: filteredIds,
                },
            }).limit(count);
            data = [...data, ...additionalData];
        }

        res.json(data);
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

// 최근 요약글
export const fetchRecentSummary = async (req: Request, res: Response) => {
    try {
        const result = await Models.Summary.find()
            .limit(10)
            .populate("user")
            .populate("hashtags");
        res.json(result);
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

// 가장 활동이 많은 사용자
export const fetchActivityUser = async (req: Request, res: Response) => {
    try {
        const summary = await Models.Summary.aggregate([
            {
                $group: {
                    _id: "$user",
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
            {
                $limit: 10,
            },
        ]);
        const filteredIds = [];
        let data = [];

        summary.forEach((item) => {
            filteredIds.push(item._id);
        });

        data = await Models.User.find({
            _id: {
                $in: filteredIds,
            },
        });

        if (filteredIds.length < 10) {
            const count = 10 - filteredIds.length;
            const additionalData = await Models.User.find({
                _id: {
                    $nin: filteredIds,
                },
            }).limit(count);
            data = [...data, ...additionalData];
        }

        res.json(data);
    } catch (e) {
        res.status(500).json({
            message: "조회 중 오류가 발생했습니다",
            error: e.message,
        });
    }
};

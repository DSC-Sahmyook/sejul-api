import { Request, Response } from "express";
import * as Models from "../utils/db/models";
import { ENV } from "../utils";
import Axios from "axios";
import { IAPIError } from "../interfaces";
//추가
import { IView } from "../interfaces";

const env = ENV();

/**
 * @description 기사를 검색하는 API
 */
export const searchInArticle = async (req: Request, res: Response) => {
    try {
        const { search, page = 1, cnt = 10 } = req.query;
        const response = await Axios({
            method: "get",
            url: "https://openapi.naver.com/v1/search/news.json",
            headers: {
                "X-Naver-Client-Id": env.get("NAVER_API_CLIENT_ID"),
                "X-Naver-Client-Secret": env.get("NAVER_API_CLIENT_SECRET"),
            },
            params: {
                query: search,
                start: page,
                display: cnt,
            },
        });
        res.json(response.data);
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
 * @description 요약 글을 검색하는 API
 */
export const searchInSummary = async (req: Request, res: Response) => {
    try {
        // 코드 작성 부
        const { search = "", page = 1, cnt = 10 } = req.query;

        const result = await Models.Summary.find({
            content: { $regex: `.*${search}.*` },
        })
            .limit(10)
            .populate("user", {
                password: 0,
                isAdmin: 0,
                isDeleted: 0,
            })
            .populate("hashtags");

        const resultCount = await Models.Summary.find({
            content: { $regex: `.*${search}.*` },
        });

        res.json({
            page: page,
            data: result,
            count: resultCount.length,
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

import { Request, Response } from "express";
import * as Models from "../utils/db/models";
import { ENV } from "../utils";
import Axios from "axios";
import { IAPIError } from "../interfaces";

const env = ENV();

export const search = async (req: Request, res: Response) => {
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

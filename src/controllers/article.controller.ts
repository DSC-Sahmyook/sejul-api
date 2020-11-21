import { NextFunction, Request, Response } from "express";
import * as Models from "../utils/db/models";
import * as Utility from "../utils";
import * as bcrypt from "bcrypt";

const env = Utility.ENV();

//#region

export const storeArticle = async (req: Request, res: Response) => {
    const { url } = req.body;
    if (url && url.length > 0) {
        try {
            const parsed = await Utility.OGPARSER(url);
            req.user.articles.push({
                title: parsed.title,
                link: url,
                originalLink: url,
            });

            await req.user.save();

            res.status(201).json({
                message: "추가되었습니다",
            });
        } catch (e) {
            res.status(500).json({
                message: "저장 중 오류가 발생했습니다",
                error: e.message,
            });
        }
    } else {
        res.status(400).json({
            message: "url이 주어지지 않았습니다",
        });
    }
};

export const fetchArticles = async (req: Request, res: Response) => {
    try {
        const user = await Models.User.findOne({
            _id: req.user._id,
        });
        res.status(200).json(user.articles);
    } catch (e) {
        res.status(500).json({
            message: "오류가 발생했습니다",
            error: e.message,
        });
    }
};

export const removeArticle = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;
        const user = await Models.User.findOne({
            _id: req.user._id,
        });

        const idx = user.articles.findIndex((article) => {
            return article.link === url;
        });
        user.articles.splice(idx, 1);
        await user.save();

        res.status(200).json({
            message: "삭제 되었습니다",
        });
    } catch (e) {
        res.status(500).json({
            message: "오류가 발생했습니다",
            error: e.message,
        });
    }
};

//#endregion

export const checkAlreadyStored = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;
        if (url === undefined || url === null) {
            throw new Error("주소가 주어져야 합니다");
        }

        const user = await Models.User.findOne({
            _id: req.user._id,
        });

        let isAlreadyStored = false;
        user.articles.forEach((item) => {
            if (item.link === url || item.originalLink === url) {
                isAlreadyStored = true;
            }
        });

        res.status(200).json({
            isAlreadyStored: isAlreadyStored,
            message: "조회되었습니다",
        });
    } catch (e) {
        res.status(500).json({
            message: "오류가 발생했습니다",
            error: e.message,
        });
    }
};

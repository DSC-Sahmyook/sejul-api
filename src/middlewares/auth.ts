import { Request, Response, NextFunction } from "express";
import * as Models from "../utils/db/models";
import * as passport from "passport";
import { Document } from "mongoose";

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate(
        "jwt",
        { session: false },
        (err: Error, user: Document, info: any) => {
            if (err) {
                return res.status(500).json({
                    message: "오류가 발생했습니다",
                    error: err.message,
                });
            }
            if (!user) {
                return res.status(400).json({
                    message: info.message,
                });
            }

            req.login(user, { session: false }, (e) => {
                if (err) {
                    return res.status(500).json({
                        message: "오류가 발생했습니다",
                        error: err.message,
                    });
                }
                next();
            });
        }
    )(req, res, next);
};

export const isItself = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate(
        "jwt",
        { session: false },
        async (err: Error, user: Document, info: any) => {
            if (err) {
                return res.status(500).json({
                    message: "오류가 발생했습니다",
                    error: err.message,
                });
            }
            if (!user) {
                return res.status(400).json({
                    message: info.message,
                });
            }

            const _username = req.param("username");
            const _user = await Models.User.findOne({ username: _username });

            if (user._id === _user._id) {
                req.login(_user, { session: false }, (e) => {
                    if (err) {
                        return res.status(500).json({
                            message: "오류가 발생했습니다",
                            error: err.message,
                        });
                    }
                    next();
                });
            } else {
                return res.status(401).json({
                    message: "권한이 없습니다",
                });
            }
        }
    )(req, res, next);
};

export const isAdministrator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate(
        "jwt",
        { session: false },
        (err: Error, user: Document, info: any) => {
            if (err) {
                return res.status(500).json({
                    message: "오류가 발생했습니다",
                    error: err.message,
                });
            }
            if (!user) {
                return res.status(401).json({
                    message: info.message,
                });
            }

            if (!user.toJSON().isAdmin) {
                return res.status(401).json({
                    message: "관리자 권한이 없습니다",
                });
            }

            req.login(user, { session: false }, (e) => {
                if (err) {
                    return res.status(500).json({
                        message: "오류가 발생했습니다",
                        error: err.message,
                    });
                }
                next();
            });
        }
    )(req, res, next);
};

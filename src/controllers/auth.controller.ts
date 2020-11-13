/**
 * Author       : 유경수
 * Created Date : 2020-11-04
 * Description  : 인증 및 회원 가입 관련 항목
 * History
 * -
 */
import { Request, Response, json, NextFunction } from "express";
import * as jsonwebtoken from "jsonwebtoken";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import * as Models from "../utils/db/models";
import createEnv from "../utils/env";
import {
    isEmail,
    isPassword,
    comparePassword,
    isEmpty,
} from "../utils/validator";
import { Document, Error, Model } from "mongoose";
import { IUser } from "../interfaces";
import { IKakaoStrategyInfo } from "../utils/passport/strategies/kakao.strategy";

const env = createEnv();

export const signup = async (req: Request, res: Response) => {
    const _email = req.body.email;
    const _pw = req.body.password;
    const _pw_valid = req.body.password_valid;
    const _username = req.body.username;

    if (!isEmail(_email)) {
        res.status(400).json({
            message: `올바른 이메일이 아닙니다`,
        });
    } else if (!isPassword(_pw)) {
        res.status(400).json({
            message: "올바른 패스워드가 아닙니다",
        });
    } else if (!comparePassword(_pw, _pw_valid)) {
        res.status(400).json({
            message: "패스워드가 동일하지 않습니다",
        });
    } else if (isEmpty(_username)) {
        res.status(400).json({
            message: "유저 이름이 주어지지 않았습니다",
        });
    } else {
        try {
            if (await Models.User.exists({ email: _email })) {
                res.status(400).json({
                    message: "이미 존재하는 이메일입니다",
                });
            } else {
                const saltRound = Number(env.get("HASH_SALT_ROUND"));
                const salt = bcrypt.genSaltSync(saltRound);
                const hashed = bcrypt.hashSync(_pw, salt);
                const _newUser = new Models.User({
                    email: _email,
                    password: hashed,
                    username: _username,
                });

                await _newUser.save();

                res.status(201).json({
                    message: "정상적으로 생성되었습니다",
                });
            }
        } catch (e) {
            res.status(500).json({
                message: "오류가 발생했습니다",
                error: {
                    message: e.message,
                },
            });
        }
    }
};

export const signin = (req: Request, res: Response, next: Function) => {
    passport.authenticate(
        "local",
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

            req.login(user, { session: false }, (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "오류가 발생했습니다",
                        error: err.message,
                    });
                } else {
                    const _user: IUser = user.toJSON();
                    const token = jsonwebtoken.sign(
                        {
                            _id: _user._id,
                        },
                        env.get("JWT_SECRET"),
                        {
                            expiresIn: "7d",
                            issuer: "DSC-Sahmyook",
                            subject: "user-info",
                        }
                    );
                    return res.status(200).json({
                        message: "로그인이 성공했습니다",
                        token,
                    });
                }
            });
        }
    )(req, res, next);
};

export const kakaoCallback = (req: Request, res: Response, next: Function) => {
    passport.authenticate(
        "kakao",
        { session: false },
        async (err: Error, user: IUser, info: IKakaoStrategyInfo) => {
            if (err) {
                res.status(500).json({
                    message: "오류가 발생했습니다",
                    error: err.message,
                });
                return;
            }
            if (user) {
                // 로그인 성공
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: "오류가 발생했습니다",
                            error: err.message,
                        });
                    } else {
                        const _user: IUser = user.toJSON();
                        const token = jsonwebtoken.sign(
                            {
                                _id: _user._id,
                            },
                            env.get("JWT_SECRET"),
                            {
                                expiresIn: "7d",
                                issuer: "DSC-Sahmyook",
                                subject: "user-info",
                            }
                        );
                        return res.status(200).json({
                            message: "로그인이 성공했습니다",
                            token,
                        });
                    }
                });
            } else {
                // 로그인 실패
                if (req.user) {
                    // 기존 로그인 정보가 있는 경우
                    // 카카오 정보를 추가함
                    req.user.tokens.kakao = info.profile.id;
                    const updated = await req.user.save();

                    req.login(updated, { session: false }, (err) => {
                        if (err) {
                            return res.status(500).json({
                                message: "오류가 발생했습니다",
                                error: err.message,
                            });
                        } else {
                            const _user: IUser = updated.toJSON();
                            const token = jsonwebtoken.sign(
                                {
                                    _id: _user._id,
                                },
                                env.get("JWT_SECRET"),
                                {
                                    expiresIn: "7d",
                                    issuer: "DSC-Sahmyook",
                                    subject: "user-info",
                                }
                            );
                            return res.status(200).json({
                                message: "로그인이 성공했습니다",
                                token,
                            });
                        }
                    });
                } else {
                    if (info.profile._json.kakao_account.has_email) {
                        const saltRound = Number(env.get("HASH_SALT_ROUND"));
                        const salt = bcrypt.genSaltSync(saltRound);
                        const hashed = bcrypt.hashSync(
                            `${info.profile.id}${new Date().getTime()}`,
                            salt
                        );

                        const existUser = await Models.User.findOne({
                            email: info.profile._json.kakao_account.email,
                        });

                        let signingUser;
                        let signingMessage;

                        if (existUser) {
                            existUser.tokens.kakao = info.profile.id;
                            signingUser = await existUser.save();
                            signingMessage =
                                "기존 계정과 연결되고 로그인되었습니다";
                        } else {
                            const newUser = new Models.User({
                                email: info.profile._json.kakao_account.email,
                                password: hashed,
                                username: info.profile.displayName,
                                tokens: {
                                    kakao: info.profile.id,
                                },
                            });
                            signingUser = await newUser.save();
                            signingMessage =
                                "새로운 계정을 만들고 로그인되었습니다";
                        }

                        req.login(signingUser, { session: false }, (err) => {
                            if (err) {
                                return res.status(500).json({
                                    message: "오류가 발생했습니다",
                                    error: err.message,
                                });
                            } else {
                                const _user: IUser = signingUser.toJSON();
                                const token = jsonwebtoken.sign(
                                    {
                                        _id: _user._id,
                                    },
                                    env.get("JWT_SECRET"),
                                    {
                                        expiresIn: "7d",
                                        issuer: "DSC-Sahmyook",
                                        subject: "user-info",
                                    }
                                );
                                return res.status(200).json({
                                    message: signingMessage,
                                    token,
                                });
                            }
                        });
                    } else {
                        res.status(400).json({
                            message:
                                "이메일이 반드시 필요합니다. 다시 시도해주세요",
                        });
                    }
                }
            }
        }
    )(req, res, next);
};

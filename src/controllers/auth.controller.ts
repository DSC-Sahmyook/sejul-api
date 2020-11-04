import { Request, Response, json, NextFunction } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import * as Models from '../utils/db/models';
import createEnv from '../utils/env';
import { isEmail, isPassword, comparePassword, isEmpty } from '../utils/validator';
import { Document, Error } from 'mongoose';
import { IUser } from '../interfaces';

const env = createEnv();

export const signup = async (req: Request, res: Response)=>{
    const _email = req.body.email;
    const _pw = req.body.password;
    const _pw_valid = req.body.password_valid;
    const _username = req.body.username;
    
    if(!isEmail(_email)){
        res.status(400).json({
            message : `올바른 이메일이 아닙니다`
        });
    }
    else if(!isPassword(_pw)){
        res.status(400).json({
            message : '올바른 패스워드가 아닙니다'
        });
    }
    else if(!comparePassword(_pw, _pw_valid)){
        res.status(400).json({
            message : "패스워드가 동일하지 않습니다"
        });
    }
    else if(isEmpty(_username)){
        res.status(400).json({
            message : "유저 이름이 주어지지 않았습니다"
        });
    }
    else{
        try{
            if(await Models.User.exists({ email : _email })){
                res.status(400).json({
                    message : "이미 존재하는 이메일입니다"
                });
            }
            else{
                const saltRound = Number(env.get("HASH_SALT_ROUND"));
                const salt = bcrypt.genSaltSync(saltRound);
                const hashed = bcrypt.hashSync(_pw, salt);
                const _newUser = new Models.User({
                    email : _email,
                    password : hashed,
                    username : _username
                });
        
                await _newUser.save();
                
                res.status(201).json({
                    message : "정상적으로 생성되었습니다"
                });
            }
        }
        catch(e){
            res.status(500).json({
                message : "오류가 발생했습니다",
                error : {
                    message : e.message
                }
            })
        }
    }

}

export const signin = (req: Request, res: Response, next: Function)=>{
    passport.authenticate('local' , { session: false } , (err : Error, user : Document, info : any)=>{
        if(err){
            return res.status(500).json({
                message : "오류가 발생했습니다",
                error : err.message
            });
        }
        if(!user){
            return res.status(400).json({
                message : info.message
            });
        }
        
        req.login(user, {session : false} , err=>{
            if(err){
                return res.status(500).json({
                    message : "오류가 발생했습니다",
                    error : err.message
                });
            }
            else{
                const _user : IUser = user.toJSON();
                const token = jsonwebtoken.sign(
                    {  
                        _id : _user._id,
                    },
                    env.get("JWT_SECRET"),
                    {
                        expiresIn : '7d',
                        issuer : "OldRookie",
                        subject : "user-info"
                    }
                );
                return res.status(200).json({
                    message : "로그인이 성공했습니다",
                    token
                });
            }
        });
    })(req, res, next);
}
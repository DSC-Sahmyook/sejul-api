import { Request, Response } from "express";
import * as Models from "../utils/db/models";
// import { ENV, VALIDATOR } from "../utils";

export const fetchAll = async (request: Request, response: Response) => {
    response.json("응답");
};

export const create = async (request: Request, response: Response) => {
    const { hashtag } = request.body;
};

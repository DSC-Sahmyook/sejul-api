import { Request, Response } from "express";
import * as Models from "../utils/db/models";
// import { ENV, VALIDATOR } from "../utils";

export const fetchAll = (request: Request, response: Response) => {
    response.json("응답");
};

export const create = (request: Request, response: Response) => {
    response.json("응답");
};

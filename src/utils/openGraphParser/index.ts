import * as cheerio from "cheerio";
import Axios from "axios";
import { isUrl } from "../validator";

export interface IOGParserResult {
    title: string;
    description: string;
    image: string;
}

export default async (url: string): Promise<IOGParserResult> => {
    if (isUrl(url)) {
        try {
            const response = await Axios.get(url);
            const $ = cheerio.load(response.data);
            const ogTitleTag = $("meta[property='og:title']");
            const ogDescTag = $("meta[property='og:description']");
            const ogImageTag = $("meta[property='og:image']");

            if (ogTitleTag && ogDescTag && ogImageTag) {
                return {
                    title: ogTitleTag.attr("content"),
                    description: ogDescTag.attr("content"),
                    image: ogImageTag.attr("content"),
                };
            } else {
                return undefined;
            }
        } catch (e) {
            throw e;
        }
    } else {
        return undefined;
    }
};

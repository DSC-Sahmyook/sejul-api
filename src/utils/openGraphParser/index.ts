import * as cheerio from "cheerio";
import { isUrl } from "../validator";
import * as jschardet from "jschardet";
const Iconv = require("iconv").Iconv;
import * as rp from "request-promise";
export interface IOGParserResult {
    title: string;
    description: string;
    image: string;
}

function anyToUtf8(str: Buffer) {
    const { encoding } = jschardet.detect(str);
    console.log("source encoding = " + encoding);
    const iconv = new Iconv(encoding, "utf-8//translit//ignore");
    return iconv.convert(str).toString();
}

export default async (url: string): Promise<IOGParserResult> => {
    if (isUrl(url)) {
        try {
            const response = await rp({
                url: url,
                encoding: null,
            });
            const html = anyToUtf8(response);
            const $ = cheerio.load(html);
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
